import { useState, useEffect, useCallback } from 'react';

export interface Brief {
  title: string;
  subtitle: string;
  presenter: string;
  audience: string;
  goal: string;
  tone: string;
  slideCount: string;
  duration: string;
  dataStyle: string;
  visualStyle: string;
  contentFocus: string;
  extraConstraints: string;
  infoCutoff: string;
  fonts?: { heading: string; body: string };
  theme?: string;
}

const DEFAULT_BRIEF: Brief = {
  title: '', subtitle: '', presenter: '', audience: '', goal: '',
  tone: 'professional', slideCount: '', duration: '', dataStyle: '',
  visualStyle: '', contentFocus: '', extraConstraints: '', infoCutoff: '',
};

export function useBrief(slug: string | null) {
  const [brief, setBrief] = useState<Brief>(DEFAULT_BRIEF);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    if (!slug) { setBrief(DEFAULT_BRIEF); return; }
    try {
      const res = await fetch(`/__api/decks/${encodeURIComponent(slug)}/brief`);
      const data = await res.json();
      if (data && typeof data === 'object' && !data.error && Object.keys(data).length > 0) {
        setBrief({ ...DEFAULT_BRIEF, ...data });
      }
    } catch {}
  }, [slug]);

  const save = useCallback(async (updates?: Partial<Brief>) => {
    if (!slug) return;
    const toSave = updates ? { ...brief, ...updates } : brief;
    if (updates) setBrief(toSave as Brief);
    await fetch(`/__api/decks/${encodeURIComponent(slug)}/brief`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toSave),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [slug, brief]);

  useEffect(() => { load(); }, [load]);

  return { brief, setBrief, save, saved, load };
}
