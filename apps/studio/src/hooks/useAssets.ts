import { useState, useEffect, useCallback } from 'react';

interface AssetEntry {
  name: string;
  ext: string;
}

export function useAssets() {
  const [assets, setAssets] = useState<AssetEntry[]>([]);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/__api/assets');
      const data = await res.json();
      setAssets(data.files ?? []);
    } catch {
      setAssets([]);
    }
  }, []);

  const upload = useCallback(async (fileList: FileList) => {
    const formData = new FormData();
    for (const file of fileList) {
      formData.append('files', file);
    }
    await fetch('/__api/assets', { method: 'POST', body: formData });
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (name: string) => {
    await fetch(`/__api/assets/${encodeURIComponent(name)}`, { method: 'DELETE' });
    await refresh();
  }, [refresh]);

  useEffect(() => { refresh(); }, [refresh]);

  return { assets, upload, remove, refresh };
}
