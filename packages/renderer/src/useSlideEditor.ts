import { useCallback, useEffect, useRef, useState } from 'react';

/* ── Text element detection ── */

const TEXT_TAGS = new Set([
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'LI',
  'A', 'STRONG', 'EM', 'TD', 'TH', 'LABEL',
]);

function findTextAncestor(el: HTMLElement, boundary: HTMLElement): HTMLElement | null {
  let current: HTMLElement | null = el;
  while (current && current !== boundary) {
    if (TEXT_TAGS.has(current.tagName)) return current;
    current = current.parentElement;
  }
  return null;
}

/* ── Persistence helper ── */

async function saveEdit(
  deckSlug: string,
  payload: Record<string, unknown>,
): Promise<boolean> {
  try {
    const res = await fetch(
      `/__api/decks/${encodeURIComponent(deckSlug)}/slides/edit`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}

/* ── Edit mode CSS ── */

export const EDIT_MODE_STYLES = `
  [data-edit-mode] h1:hover,
  [data-edit-mode] h2:hover,
  [data-edit-mode] h3:hover,
  [data-edit-mode] h4:hover,
  [data-edit-mode] h5:hover,
  [data-edit-mode] h6:hover,
  [data-edit-mode] p:hover,
  [data-edit-mode] span:hover,
  [data-edit-mode] li:hover,
  [data-edit-mode] td:hover,
  [data-edit-mode] th:hover {
    outline: 2px dashed rgba(99, 102, 241, 0.4) !important;
    outline-offset: 4px;
    cursor: text !important;
  }
  [data-edit-mode] [contenteditable="true"] {
    outline: 2px solid rgba(99, 102, 241, 0.8) !important;
    outline-offset: 4px;
    cursor: text !important;
  }
`;

/* ── Hook ── */

interface UseSlideEditorOptions {
  deckSlug: string | null | undefined;
  currentSlide: number;
  slideRef: React.RefObject<HTMLDivElement | null>;
}

export function useSlideEditor({ deckSlug, currentSlide, slideRef }: UseSlideEditorOptions) {
  const [editMode, setEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [toolbarPos, setToolbarPos] = useState<{ x: number; y: number } | null>(null);

  const activeElementRef = useRef<HTMLElement | null>(null);
  const originalTextRef = useRef<string>('');
  const deckSlugRef = useRef(deckSlug);
  deckSlugRef.current = deckSlug;

  // ── Save flash ──
  const flashSave = useCallback((ok: boolean) => {
    setSaveStatus(ok ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 1500);
  }, []);

  // ── Deactivate on slide change ──
  useEffect(() => {
    const el = activeElementRef.current;
    if (el) {
      el.contentEditable = 'false';
      activeElementRef.current = null;
      setToolbarPos(null);
    }
  }, [currentSlide]);

  // ── Save text edit (called from native blur listener) ──
  const saveTextEdit = useCallback((element: HTMLElement) => {
    const oldText = originalTextRef.current;
    const newText = element.textContent || '';
    const slug = deckSlugRef.current;

    if (oldText.trim() === newText.trim() || !oldText.trim() || !slug) return;

    saveEdit(slug, {
      type: 'text',
      oldText: oldText.trim(),
      newText: newText.trim(),
    }).then((ok) => flashSave(ok));
  }, [flashSave]);

  // ── Click handler ──
  const handleSlideClick = useCallback(
    (e: React.MouseEvent) => {
      if (!editMode) return;

      const target = e.target as HTMLElement;
      const textEl = findTextAncestor(target, e.currentTarget as HTMLElement);

      const prev = activeElementRef.current;

      if (!textEl) {
        if (prev) {
          prev.contentEditable = 'false';
          activeElementRef.current = null;
          setToolbarPos(null);
        }
        return;
      }

      if (prev === textEl) return;

      if (prev) {
        prev.contentEditable = 'false';
      }

      textEl.contentEditable = 'true';
      textEl.focus();
      originalTextRef.current = textEl.textContent || '';
      activeElementRef.current = textEl;

      const blurHandler = () => {
        textEl.removeEventListener('blur', blurHandler);
        saveTextEdit(textEl);
        textEl.contentEditable = 'false';
        if (activeElementRef.current === textEl) {
          activeElementRef.current = null;
        }
      };
      textEl.addEventListener('blur', blurHandler);

      // Position toolbar above the element
      const rect = textEl.getBoundingClientRect();
      const containerRect = slideRef.current!.getBoundingClientRect();
      setToolbarPos({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 8,
      });
    },
    [editMode, saveTextEdit, slideRef],
  );

  // ── Start text edit (from toolbar button) ──
  const startTextEdit = useCallback(() => {
    const el = activeElementRef.current;
    if (!el) return;
    el.contentEditable = 'true';
    el.focus();
  }, []);

  // ── Color selection ──
  const handleColorSelect = useCallback(
    (cssVar: string) => {
      const el = activeElementRef.current;
      const slug = deckSlugRef.current;
      if (!el || !slug) return;

      const currentColor = el.style.color;
      const currentBg = el.style.backgroundColor;
      const isText = TEXT_TAGS.has(el.tagName);

      let oldValue: string;

      if (isText && currentColor && currentColor.includes('var(')) {
        oldValue = currentColor;
        el.style.color = cssVar;
      } else if (currentBg && currentBg.includes('var(')) {
        oldValue = currentBg;
        el.style.backgroundColor = cssVar;
      } else if (isText) {
        oldValue = '';
        el.style.color = cssVar;
      } else {
        oldValue = '';
        el.style.backgroundColor = cssVar;
      }

      if (oldValue) {
        const context = (el.textContent || '').trim().slice(0, 60);
        saveEdit(slug, {
          type: 'color',
          oldValue,
          newValue: cssVar,
          context,
        }).then((ok) => flashSave(ok));
      } else {
        flashSave(true);
      }

      setToolbarPos(null);
    },
    [flashSave],
  );

  // ── Reorder ──
  const handleReorder = useCallback(
    (_dir: 'up' | 'down') => {
      // TODO: implement reorder via API
      setToolbarPos(null);
    },
    [],
  );

  // ── Delete ──
  const handleDelete = useCallback(() => {
    // TODO: implement delete via API
    setToolbarPos(null);
  }, []);

  // ── Toggle edit mode ──
  const toggleEditMode = useCallback(() => {
    const el = activeElementRef.current;
    if (editMode && el) {
      el.contentEditable = 'false';
      activeElementRef.current = null;
      setToolbarPos(null);
    }
    setEditMode(!editMode);
  }, [editMode]);

  return {
    editMode,
    saveStatus,
    toolbarPos,
    setToolbarPos,
    handleSlideClick,
    startTextEdit,
    handleColorSelect,
    handleReorder,
    handleDelete,
    toggleEditMode,
  };
}
