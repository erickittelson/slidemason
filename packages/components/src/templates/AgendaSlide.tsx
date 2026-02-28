import type { AgendaSlideProps } from './types';

export function AgendaSlide({ title = 'Agenda', items }: AgendaSlideProps) {
  return (
    <div className="flex flex-1 flex-col">
      <h2 className="sm-fade-up font-bold" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--sm-text)', marginBottom: 'clamp(1.5rem, 3vh, 3rem)' }}>
        {title}
      </h2>
      <div className="flex flex-col" style={{ gap: 'clamp(0.75rem, 1.5vh, 1.5rem)' }}>
        {items.map((item, i) => (
          <div key={i} className={`sm-fade-up sm-stagger-${i + 1} flex items-start`} style={{ gap: 'clamp(0.75rem, 1.5vw, 1.5rem)' }}>
            <span className="font-mono font-bold" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', color: 'var(--sm-primary)', minWidth: '2.5rem' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <span className="font-semibold" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.5rem)', color: 'var(--sm-text)' }}>
                {item.label}
              </span>
              {item.description && (
                <p style={{ fontSize: 'clamp(0.8rem, 1.3vw, 1.1rem)', color: 'var(--sm-muted)', margin: '0.25rem 0 0' }}>
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
