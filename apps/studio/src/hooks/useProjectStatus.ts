import { useState, useEffect, useCallback } from 'react';

interface ProjectStatus {
  hasFiles: boolean;
  hasBrief: boolean;
  hasDeck: boolean;
}

export function useProjectStatus() {
  const [status, setStatus] = useState<ProjectStatus | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/__api/status');
      const data = await res.json();
      setStatus(data);
    } catch {
      setStatus(null);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { status, refresh };
}
