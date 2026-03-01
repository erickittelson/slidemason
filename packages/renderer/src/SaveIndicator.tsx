interface SaveIndicatorProps {
  status: 'idle' | 'saved' | 'error';
}

export function SaveIndicator({ status }: SaveIndicatorProps) {
  if (status === 'idle') return null;

  return (
    <div
      className="absolute top-5 left-1/2 -translate-x-1/2 font-mono text-xs px-3 py-1.5 rounded-full"
      style={{
        zIndex: 50,
        backgroundColor: status === 'saved'
          ? 'rgba(34, 197, 94, 0.2)'
          : 'rgba(239, 68, 68, 0.2)',
        color: status === 'saved' ? 'var(--sm-success)' : 'var(--sm-danger)',
        border: `1px solid ${
          status === 'saved'
            ? 'rgba(34, 197, 94, 0.3)'
            : 'rgba(239, 68, 68, 0.3)'
        }`,
        backdropFilter: 'blur(8px)',
      }}
    >
      {status === 'saved' ? 'Saved' : 'Save failed'}
    </div>
  );
}
