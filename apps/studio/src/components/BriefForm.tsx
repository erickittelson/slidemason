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
  color: '#aaa', fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: '4px',
};

export function BriefForm({ brief, onChange, onSave, saved }: BriefFormProps) {
  const update = (field: keyof Brief, value: string) => {
    onChange({ ...brief, [field]: value });
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <h4 style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 8px' }}>Brief</h4>

      <div style={{ marginBottom: '8px' }}>
        <label style={labelStyle}>Title</label>
        <input style={inputStyle} value={brief.title} onChange={e => update('title', e.target.value)} placeholder="Presentation title" />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label style={labelStyle}>Audience</label>
        <input style={inputStyle} value={brief.audience} onChange={e => update('audience', e.target.value)} placeholder="Who is this for?" />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label style={labelStyle}>Goal</label>
        <input style={inputStyle} value={brief.goal} onChange={e => update('goal', e.target.value)} placeholder="What should the audience do after?" />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label style={labelStyle}>Tone</label>
        <select style={inputStyle} value={brief.tone} onChange={e => update('tone', e.target.value)}>
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="inspirational">Inspirational</option>
          <option value="technical">Technical</option>
        </select>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label style={labelStyle}>Constraints</label>
        <textarea
          style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
          value={brief.constraints}
          onChange={e => update('constraints', e.target.value)}
          placeholder="Max slides, must-include topics, etc."
        />
      </div>

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
