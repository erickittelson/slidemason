import { useState, useEffect, useCallback } from 'react';

export interface Brief {
  title: string;
  audience: string;
  goal: string;
  tone: string;
  constraints: string;
  fonts?: { heading: string; body: string };
  theme?: string;
}

const DEFAULT_BRIEF: Brief = {
  title: '', audience: '', goal: '', tone: 'professional', constraints: '',
};

export function useBrief() {
  const [brief, setBrief] = useState<Brief>(DEFAULT_BRIEF);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/__api/brief');
      const data = await res.json();
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        setBrief({ ...DEFAULT_BRIEF, ...data });
      }
    } catch {}
  }, []);

  const save = useCallback(async (updates?: Partial<Brief>) => {
    const toSave = updates ? { ...brief, ...updates } : brief;
    if (updates) setBrief(toSave as Brief);
    await fetch('/__api/brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toSave),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [brief]);

  useEffect(() => { load(); }, [load]);

  return { brief, setBrief, save, saved, load };
}
