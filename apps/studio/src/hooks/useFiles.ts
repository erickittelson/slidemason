import { useState, useEffect, useCallback } from 'react';

interface FileEntry {
  name: string;
  ext: string;
}

export function useFiles() {
  const [files, setFiles] = useState<FileEntry[]>([]);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/__api/files');
      const data = await res.json();
      const raw: string[] = data.files ?? [];
      setFiles(raw.map(name => ({
        name,
        ext: name.includes('.') ? name.slice(name.lastIndexOf('.')) : '',
      })));
    } catch {
      setFiles([]);
    }
  }, []);

  const upload = useCallback(async (fileList: FileList) => {
    const formData = new FormData();
    for (const file of fileList) {
      formData.append('files', file);
    }
    await fetch('/__api/files', { method: 'POST', body: formData });
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (name: string) => {
    await fetch(`/__api/files/${encodeURIComponent(name)}`, { method: 'DELETE' });
    await refresh();
  }, [refresh]);

  useEffect(() => { refresh(); }, [refresh]);

  return { files, upload, remove, refresh };
}
