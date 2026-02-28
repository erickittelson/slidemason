interface QuickStartGuideProps {
  status: { hasFiles: boolean; hasBrief: boolean; hasDeck: boolean } | null;
}

export function QuickStartGuide({ status }: QuickStartGuideProps) {
  if (!status) return <p style={{ color: '#888', fontSize: '0.8rem' }}>Loading...</p>;

  const copy = (text: string) => navigator.clipboard.writeText(text);

  let step: { title: string; desc: string; cmd?: string };

  if (!status.hasFiles) {
    step = { title: '1. Add source files', desc: 'Drop files below to get started. PDFs, docs, markdown — anything your presentation is based on.' };
  } else if (!status.hasBrief) {
    step = { title: '2. Fill in the brief', desc: 'Tell us about your presentation: title, audience, tone, and goals.' };
  } else if (!status.hasDeck) {
    step = { title: '3. Generate your deck', desc: 'Tell your coding agent to build the outline:', cmd: 'read prompts/build-outline.md' };
  } else {
    step = { title: '✓ Deck ready!', desc: 'Your presentation is built. Navigate slides to preview, or export to PDF.' };
  }

  return (
    <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: '16px' }}>
      <h3 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, margin: '0 0 4px' }}>{step.title}</h3>
      <p style={{ color: '#aaa', fontSize: '0.8rem', lineHeight: 1.4, margin: 0 }}>{step.desc}</p>
      {step.cmd && (
        <button
          onClick={() => copy(step.cmd!)}
          style={{
            marginTop: '8px', padding: '6px 10px', fontSize: '0.75rem',
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
}
