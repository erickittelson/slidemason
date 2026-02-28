import { HEADING_FONTS, BODY_FONTS, FONT_PAIRINGS, loadGoogleFont } from '../lib/fonts';

interface FontPickerProps {
  headingFont: string;
  bodyFont: string;
  onChangeHeading: (font: string) => void;
  onChangeBody: (font: string) => void;
  onChangePairing: (heading: string, body: string) => void;
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', fontSize: '0.8rem',
  backgroundColor: '#2a2a3e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '6px', outline: 'none', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  color: '#aaa', fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: '4px',
};

export function FontPicker({ headingFont, bodyFont, onChangeHeading, onChangeBody, onChangePairing }: FontPickerProps) {
  const activePairing = FONT_PAIRINGS.find(p => p.heading === headingFont && p.body === bodyFont);

  return (
    <div style={{ marginBottom: '16px' }}>
      <h4 style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 8px' }}>Fonts</h4>

      {/* Recommended pairings */}
      <label style={labelStyle}>Recommended Pairings</label>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '10px',
      }}>
        {FONT_PAIRINGS.map(p => {
          const isActive = p.heading === headingFont && p.body === bodyFont;
          return (
            <button
              key={p.name}
              onClick={() => {
                loadGoogleFont(p.heading);
                loadGoogleFont(p.body);
                onChangePairing(p.heading, p.body);
              }}
              onMouseEnter={() => {
                loadGoogleFont(p.heading);
                loadGoogleFont(p.body);
              }}
              style={{
                padding: '8px', textAlign: 'left', cursor: 'pointer',
                backgroundColor: isActive ? 'rgba(139,92,246,0.25)' : '#2a2a3e',
                border: `1px solid ${isActive ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '6px', color: '#fff', lineHeight: 1.2, overflow: 'hidden',
              }}
              title={`${p.heading} + ${p.body}`}
            >
              <span style={{
                display: 'block', fontFamily: `'${p.heading}', sans-serif`,
                fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.1, marginBottom: '3px',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff',
              }}>
                Aa Heading
              </span>
              <span style={{
                display: 'block', fontFamily: `'${p.body}', sans-serif`,
                fontSize: '0.65rem', lineHeight: 1.2, color: '#bbb', marginBottom: '4px',
              }}>
                Body text sample here
              </span>
              <span style={{
                display: 'block', fontSize: '0.55rem', color: '#666',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {p.heading} + {p.body}
              </span>
            </button>
          );
        })}
      </div>

      {/* Preview of current pairing */}
      <div style={{
        backgroundColor: '#1a1a2e', borderRadius: '6px', padding: '10px',
        border: '1px solid rgba(255,255,255,0.08)', marginBottom: '10px',
      }}>
        <p style={{
          color: '#fff', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 4px',
          fontFamily: `'${headingFont}', sans-serif`,
        }}>
          Heading Preview
        </p>
        <p style={{
          color: '#aaa', fontSize: '0.8rem', margin: 0,
          fontFamily: `'${bodyFont}', sans-serif`,
        }}>
          Body text looks like this. The quick brown fox jumps over the lazy dog.
        </p>
        {activePairing && (
          <p style={{ color: '#8b5cf6', fontSize: '0.6rem', margin: '6px 0 0', fontStyle: 'italic' }}>
            {activePairing.name} — {activePairing.heading} + {activePairing.body}
          </p>
        )}
      </div>

      {/* Custom heading/body overrides */}
      <label style={labelStyle}>Custom Heading</label>
      <div style={{ marginBottom: '8px' }}>
        <select style={selectStyle} value={headingFont} onChange={e => onChangeHeading(e.target.value)}>
          {HEADING_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <label style={labelStyle}>Custom Body</label>
      <div style={{ marginBottom: '8px' }}>
        <select style={selectStyle} value={bodyFont} onChange={e => onChangeBody(e.target.value)}>
          {BODY_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
    </div>
  );
}
