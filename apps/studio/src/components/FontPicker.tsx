import { HEADING_FONTS, BODY_FONTS } from '../lib/fonts';

interface FontPickerProps {
  headingFont: string;
  bodyFont: string;
  onChangeHeading: (font: string) => void;
  onChangeBody: (font: string) => void;
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', fontSize: '0.8rem',
  backgroundColor: '#2a2a3e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '6px', outline: 'none', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  color: '#aaa', fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: '4px',
};

export function FontPicker({ headingFont, bodyFont, onChangeHeading, onChangeBody }: FontPickerProps) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4 style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 8px' }}>Fonts</h4>

      <div style={{ marginBottom: '8px' }}>
        <label style={labelStyle}>Heading Font</label>
        <select style={selectStyle} value={headingFont} onChange={e => onChangeHeading(e.target.value)}>
          {HEADING_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <p style={{ color: '#ccc', fontSize: '0.8rem', marginTop: '4px', fontFamily: `'${headingFont}', sans-serif` }}>
          The quick brown fox
        </p>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label style={labelStyle}>Body Font</label>
        <select style={selectStyle} value={bodyFont} onChange={e => onChangeBody(e.target.value)}>
          {BODY_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <p style={{ color: '#ccc', fontSize: '0.8rem', marginTop: '4px', fontFamily: `'${bodyFont}', sans-serif` }}>
          The quick brown fox jumps over the lazy dog
        </p>
      </div>
    </div>
  );
}
