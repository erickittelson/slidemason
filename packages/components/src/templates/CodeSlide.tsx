import type { CodeSlideProps } from './types';
import { Headline } from '../Headline';
import { CodeBlock } from '../typography/CodeBlock';

export function CodeSlide({ title, subtitle, code, language, annotations }: CodeSlideProps) {
  return (
    <div className="flex flex-1 flex-col">
      {title && <Headline>{title}</Headline>}
      {subtitle && (
        <p className="sm-fade-up sm-stagger-1" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', color: 'var(--sm-muted)', margin: '0 0 clamp(1rem, 2vh, 2rem)' }}>
          {subtitle}
        </p>
      )}
      <div className="flex flex-1 items-center">
        <div style={{ width: '100%' }}>
          <CodeBlock code={code} language={language} animate="stagger" />
          {annotations && annotations.length > 0 && (
            <ol
              className="sm-fade-up sm-stagger-2"
              style={{
                margin: 'clamp(0.5rem, 1vh, 1rem) 0 0',
                paddingLeft: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                fontSize: 'clamp(0.7rem, 1.1vw, 0.85rem)',
                color: 'var(--sm-muted)',
              }}
            >
              {annotations.map((a, i) => (
                <li key={i}>{a.label}</li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
