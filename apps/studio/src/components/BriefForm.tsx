import { useState } from 'react';
import type { Brief } from '../hooks/useBrief';

interface BriefFormProps {
  brief: Brief;
  onChange: (brief: Brief) => void;
  onSave: () => void;
  saved: boolean;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', fontSize: '0.8rem',
  backgroundColor: '#2a2a3e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '6px', outline: 'none', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  color: '#aaa', fontSize: '0.75rem', fontWeight: 500, display: 'flex',
  alignItems: 'center', gap: '4px', marginBottom: '4px',
};

const tooltipStyle: React.CSSProperties = {
  position: 'absolute', top: '100%', left: 0,
  backgroundColor: '#1a1a2e', color: '#ccc', fontSize: '0.7rem', lineHeight: 1.3,
  padding: '6px 10px', borderRadius: '6px', width: '200px', textAlign: 'left',
  border: '1px solid rgba(255,255,255,0.15)', marginTop: '4px',
  pointerEvents: 'none', zIndex: 10,
};

const charCountStyle: React.CSSProperties = {
  color: '#555', fontSize: '0.65rem', textAlign: 'right', marginTop: '2px',
};

// Dropdown presets
const AUDIENCES = [
  'Executive leadership', 'Board of directors', 'Internal team', 'Investors / VCs',
  'Clients / customers', 'Conference attendees', 'General public',
];

const GOALS = [
  'Get budget approval', 'Align team on strategy', 'Close a deal',
  'Educate / train', 'Inspire action', 'Share progress / results',
  'Pitch for investment',
];

const CONSTRAINT_PRESETS = [
  '5 slides max', '10 slides max', '15 slides max', '20 slides max',
  '5-minute presentation', '10-minute presentation', '20-minute presentation',
  'No charts or data', 'Data-heavy with charts', 'Include appendix',
];

// Field config
const FIELDS: {
  key: keyof Brief;
  label: string;
  tooltip: string;
  placeholder: string;
  maxLength: number;
  type: 'text' | 'select' | 'dropdown-or-text' | 'textarea' | 'date';
  options?: string[];
}[] = [
  {
    key: 'title', label: 'Title', type: 'text', maxLength: 120,
    tooltip: 'Leave blank and the AI will generate a title from your content.',
    placeholder: 'Optional — AI will generate',
  },
  {
    key: 'subtitle', label: 'Subtitle', type: 'text', maxLength: 200,
    tooltip: 'A secondary line shown below the title on the cover slide.',
    placeholder: 'e.g. Roadmap for the next 6 months',
  },
  {
    key: 'presenter', label: 'Presented by', type: 'text', maxLength: 100,
    tooltip: 'Name and title shown on the cover or closing slide.',
    placeholder: 'e.g. Jane Smith, VP of Product',
  },
  {
    key: 'audience', label: 'Audience', type: 'dropdown-or-text', maxLength: 100,
    tooltip: 'Who will see this? Helps the AI choose the right tone and depth.',
    placeholder: 'e.g. Marketing team',
    options: AUDIENCES,
  },
  {
    key: 'goal', label: 'Goal', type: 'dropdown-or-text', maxLength: 150,
    tooltip: 'What should the audience do or feel after? Drives the narrative arc.',
    placeholder: 'e.g. Approve the proposed budget',
    options: GOALS,
  },
  {
    key: 'tone', label: 'Tone', type: 'select', maxLength: 0,
    tooltip: 'Sets the writing style — from buttoned-up boardroom to casual all-hands.',
    placeholder: '',
    options: ['professional', 'casual', 'inspirational', 'technical', 'storytelling', 'data-driven'],
  },
  {
    key: 'constraints', label: 'Constraints', type: 'dropdown-or-text', maxLength: 300,
    tooltip: 'Slide count limits, time constraints, or content requirements.',
    placeholder: 'e.g. Keep under 10 slides, include ROI data',
    options: CONSTRAINT_PRESETS,
  },
  {
    key: 'infoCutoff', label: 'Information cutoff', type: 'date', maxLength: 0,
    tooltip: 'Latest date the data should cover. Helps the AI avoid outdated info.',
    placeholder: '',
  },
];

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span
      style={{ position: 'relative', cursor: 'help', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '14px', height: '14px', borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.08)', color: '#888',
        fontSize: '0.6rem', fontWeight: 700, lineHeight: 1,
      }}>
        ?
      </span>
      {show && <span style={tooltipStyle}>{text}</span>}
    </span>
  );
}

function DropdownOrText({
  value, onChange, options, placeholder, maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  maxLength: number;
}) {
  const isCustom = value !== '' && !options.includes(value);
  const [showCustom, setShowCustom] = useState(isCustom);

  return (
    <div>
      {!showCustom ? (
        <select
          style={inputStyle}
          value={options.includes(value) ? value : ''}
          onChange={e => {
            if (e.target.value === '__custom__') {
              setShowCustom(true);
              onChange('');
            } else {
              onChange(e.target.value);
            }
          }}
        >
          <option value="">Select...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
          <option value="__custom__">Other (type your own)</option>
        </select>
      ) : (
        <div style={{ display: 'flex', gap: '4px' }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            value={value}
            onChange={e => onChange(e.target.value.slice(0, maxLength))}
            placeholder={placeholder}
            maxLength={maxLength}
          />
          <button
            onClick={() => { setShowCustom(false); onChange(''); }}
            style={{
              backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px', color: '#888', fontSize: '0.7rem', padding: '4px 8px',
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            List
          </button>
        </div>
      )}
    </div>
  );
}

export function BriefForm({ brief, onChange, onSave, saved }: BriefFormProps) {
  const update = (field: keyof Brief, value: string) => {
    onChange({ ...brief, [field]: value });
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <h4 style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 8px' }}>Brief</h4>

      {FIELDS.map(f => (
        <div key={f.key} style={{ marginBottom: '8px' }}>
          <label style={labelStyle}>
            {f.label}
            <Tooltip text={f.tooltip} />
          </label>

          {f.type === 'text' && (
            <>
              <input
                style={inputStyle}
                value={(brief[f.key] as string) ?? ''}
                onChange={e => update(f.key, e.target.value.slice(0, f.maxLength))}
                placeholder={f.placeholder}
                maxLength={f.maxLength}
              />
              {f.maxLength > 0 && (
                <div style={charCountStyle}>
                  {((brief[f.key] as string) ?? '').length}/{f.maxLength}
                </div>
              )}
            </>
          )}

          {f.type === 'select' && f.options && (
            <select
              style={inputStyle}
              value={(brief[f.key] as string) ?? ''}
              onChange={e => update(f.key, e.target.value)}
            >
              {f.options.map(o => (
                <option key={o} value={o}>
                  {o.charAt(0).toUpperCase() + o.slice(1)}
                </option>
              ))}
            </select>
          )}

          {f.type === 'dropdown-or-text' && f.options && (
            <>
              <DropdownOrText
                value={(brief[f.key] as string) ?? ''}
                onChange={v => update(f.key, v)}
                options={f.options}
                placeholder={f.placeholder}
                maxLength={f.maxLength}
              />
              {f.maxLength > 0 && (brief[f.key] as string)?.length > 0 && (
                <div style={charCountStyle}>
                  {((brief[f.key] as string) ?? '').length}/{f.maxLength}
                </div>
              )}
            </>
          )}

          {f.type === 'textarea' && (
            <>
              <textarea
                style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                value={(brief[f.key] as string) ?? ''}
                onChange={e => update(f.key, e.target.value.slice(0, f.maxLength))}
                placeholder={f.placeholder}
                maxLength={f.maxLength}
              />
              {f.maxLength > 0 && (
                <div style={charCountStyle}>
                  {((brief[f.key] as string) ?? '').length}/{f.maxLength}
                </div>
              )}
            </>
          )}

          {f.type === 'date' && (
            <input
              type="date"
              style={inputStyle}
              value={(brief[f.key] as string) ?? ''}
              onChange={e => update(f.key, e.target.value)}
            />
          )}
        </div>
      ))}

      <button
        onClick={onSave}
        style={{
          width: '100%', padding: '8px', fontSize: '0.8rem', fontWeight: 600,
          backgroundColor: saved ? 'rgba(34,197,94,0.3)' : 'rgba(139,92,246,0.3)',
          color: saved ? '#86efac' : '#c4b5fd',
          border: `1px solid ${saved ? 'rgba(34,197,94,0.4)' : 'rgba(139,92,246,0.4)'}`,
          borderRadius: '6px', cursor: 'pointer',
        }}
      >
        {saved ? '✓ Saved' : 'Save Brief'}
      </button>
    </div>
  );
}
