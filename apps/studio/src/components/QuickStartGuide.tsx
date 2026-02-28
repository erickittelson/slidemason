interface QuickStartGuideProps {
  status: { hasFiles: boolean; hasBrief: boolean; hasDeck: boolean } | null;
}

const steps = [
  { key: 'files', title: '1. Add source files', desc: 'Drop files below — PDFs, docs, markdown, images.' },
  { key: 'brief', title: '2. Fill in the brief', desc: 'Scroll down to the Brief section and fill in title, audience, tone.' },
  { key: 'deck', title: '3. Generate your deck', desc: 'Tell your coding agent:', cmd: 'read prompts/build-outline.md' },
  { key: 'done', title: '✓ Deck ready!', desc: 'Navigate slides to preview, or export to PDF.' },
];

function getCurrentStep(status: { hasFiles: boolean; hasBrief: boolean; hasDeck: boolean }) {
  if (!status.hasFiles) return 0;
  if (!status.hasBrief) return 1;
  if (!status.hasDeck) return 2;
  return 3;
}

export function QuickStartGuide({ status }: QuickStartGuideProps) {
  if (!status) return <p style={{ color: '#888', fontSize: '0.8rem' }}>Loading...</p>;

  const copy = (text: string) => navigator.clipboard.writeText(text);
  const current = getCurrentStep(status);

  return (
    <div style={{ marginBottom: '16px' }}>
      <h4 style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 8px' }}>Getting Started</h4>
      {steps.map((step, i) => {
        const isDone = i < current;
        const isActive = i === current;
        return (
          <div
            key={step.key}
            style={{
              padding: '8px 10px', borderRadius: '6px', marginBottom: '4px',
              backgroundColor: isActive ? 'rgba(139,92,246,0.12)' : 'transparent',
              borderLeft: isActive ? '3px solid rgba(139,92,246,0.6)' : '3px solid transparent',
              opacity: isDone ? 0.5 : 1,
            }}
          >
            <p style={{
              color: isDone ? '#666' : isActive ? '#fff' : '#aaa',
              fontSize: '0.8rem', fontWeight: isActive ? 600 : 400,
              margin: 0, textDecoration: isDone ? 'line-through' : 'none',
            }}>
              {step.title}
            </p>
            {isActive && (
              <p style={{ color: '#999', fontSize: '0.75rem', margin: '2px 0 0', lineHeight: 1.3 }}>
                {step.desc}
              </p>
            )}
            {isActive && step.cmd && (
              <button
                onClick={() => copy(step.cmd!)}
                style={{
                  marginTop: '6px', padding: '4px 8px', fontSize: '0.7rem',
                  backgroundColor: 'rgba(139,92,246,0.2)', color: '#c4b5fd',
                  border: '1px solid rgba(139,92,246,0.3)', borderRadius: '4px',
                  cursor: 'pointer', fontFamily: 'monospace',
                }}
              >
                📋 {step.cmd}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
