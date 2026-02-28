import { createContext, useContext, type ReactNode } from 'react';
import { useNavigation } from './useNavigation';

interface DeckContextValue {
  currentSlide: number;
  slideCount: number;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  theme: string;
}

const DeckContext = createContext<DeckContextValue | null>(null);

export function useDeck() {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error('useDeck must be used within DeckProvider');
  return ctx;
}

interface DeckProviderProps {
  children: ReactNode;
  slideCount: number;
  theme?: string;
}

export function DeckProvider({ children, slideCount, theme = 'slate' }: DeckProviderProps) {
  const nav = useNavigation(slideCount);
  return (
    <DeckContext.Provider value={{ ...nav, slideCount, theme }}>
      {children}
    </DeckContext.Provider>
  );
}
