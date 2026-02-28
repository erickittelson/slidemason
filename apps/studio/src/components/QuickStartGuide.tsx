import type { ReactNode } from 'react';

interface QuickStartGuideProps {
  status: { hasFiles: boolean; hasBrief: boolean; hasDeck: boolean } | null;
  /** Slot rendered directly under step 1 (source files) */
  fileUpload: ReactNode;
  /** Slot rendered directly under step 2 (brief) */
  briefForm: ReactNode;
}

interface StepDef {
  key: string;
  title: string;
  desc: string;
  cmd?: string;
}

const STEPS: StepDef[] = [
  { key: 'files', title: '1. Add source files', desc: 'Upload PDFs, docs, markdown, or images your presentation is based on.' },
  { key: 'brief', title: '2. Fill in the brief', desc: 'Describe your presentation so the agent knows what to build.' },
  { key: 'deck', title: '3. Generate your deck', desc: 'Tell your coding agent to build the outline:', cmd: 'read prompts/build-outline.md' },
  { key: 'done', title: '✓ Deck ready!', desc: 'Navigate slides to preview, or export to PDF.' },
];

function getCurrentStep(status: { hasFiles: boolean; hasBrief: boolean; hasDeck: boolean }) {
  if (!status.hasFiles) return 0;
  if (!status.hasBrief) return 1;
  if (!status.hasDeck) return 2;
  return 3;
}

export function QuickStartGuide({ status, fileUpload, briefForm }: QuickStartGuideProps) {
  if (!status) return <p style={{ color: '#888', fontSize: '0.8rem' }}>Loading...</p>;

  const copy = (text: string) => navigator.clipboard.writeText(text);
  const current = getCurrentStep(status);

  return (
    <div>
      {STEPS.map((step, i) => {
        const isDone = i < current;
        const isActive = i === current;
        // Show the inline content for a step if it's active or already done
        // (user may want to add more files even after step 1 is "done")
        const showContent = i <= current;

        return (
          <div key={step.key} style={{ marginBottom: '12px' }}>
            {/* Step header */}
            <div
              style={{
                padding: '8px 10px', borderRadius: '6px',
                backgroundColor: isActive ? 'rgba(139,92,246,0.12)' : 'transparent',
                borderLeft: isActive ? '3px solid rgba(139,92,246,0.6)' : '3px solid transparent',
                opacity: isDone ? 0.6 : i > current ? 0.4 : 1,
              }}
            >
              <p style={{
                color: isDone ? '#888' : isActive ? '#fff' : '#666',
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

            {/* Inline content slots */}
            {step.key === 'files' && showContent && (
              <div style={{ marginTop: '8px', paddingLeft: '13px' }}>
                {fileUpload}
              </div>
            )}
            {step.key === 'brief' && showContent && (
              <div style={{ marginTop: '8px', paddingLeft: '13px' }}>
                {briefForm}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
