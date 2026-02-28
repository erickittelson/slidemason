import { useRef, type DragEvent } from 'react';

interface AssetLibraryProps {
  assets: { name: string; ext: string }[];
  onUpload: (files: FileList) => void;
  onRemove: (name: string) => void;
}

const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];

export function AssetLibrary({ assets, onUpload, onRemove }: AssetLibraryProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) onUpload(e.dataTransfer.files);
  };

  return (
    <div>
      {/* Upload button */}
      <button
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        style={{
          width: '100%', padding: '10px', fontSize: '0.8rem',
          backgroundColor: 'rgba(255,255,255,0.05)', color: '#888',
          border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '6px',
          cursor: 'pointer', marginBottom: '8px',
        }}
      >
        + Upload logos & images
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => e.target.files && onUpload(e.target.files)}
      />

      {/* Thumbnail grid */}
      {assets.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {assets.map(a => (
            <div key={a.name} style={{
              position: 'relative', borderRadius: '6px', overflow: 'hidden',
              backgroundColor: 'rgba(255,255,255,0.05)', aspectRatio: '1',
            }}>
              {IMAGE_EXTS.includes(a.ext.toLowerCase()) ? (
                <img
                  src={`/__api/assets/${encodeURIComponent(a.name)}`}
                  alt={a.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888', fontSize: '0.7rem' }}>
                  {a.ext}
                </div>
              )}
              <button
                onClick={() => onRemove(a.name)}
                style={{
                  position: 'absolute', top: '2px', right: '2px',
                  width: '18px', height: '18px', borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff',
                  border: 'none', cursor: 'pointer', fontSize: '0.6rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ✕
              </button>
              <span style={{
                position: 'absolute', bottom: '2px', left: '2px', right: '2px',
                fontSize: '0.55rem', color: '#aaa', overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {a.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
