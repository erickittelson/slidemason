import type { ReactNode } from 'react';

export interface PresenterNotesProps {
  children: ReactNode;
}

export function PresenterNotes({ children }: PresenterNotesProps) {
  return (
    <aside
      data-presenter-notes="true"
      className="hidden print:hidden"
    >
      {children}
    </aside>
  );
}
