import { createContext, useContext, useRef } from 'react';

interface StaggerContextValue {
  claim(): number;
}

const StaggerContext = createContext<StaggerContextValue | null>(null);

export function StaggerProvider({ children }: { children: React.ReactNode }) {
  const counterRef = useRef(0);
  counterRef.current = 0;

  const value: StaggerContextValue = {
    claim() {
      return counterRef.current++;
    },
  };

  return (
    <StaggerContext.Provider value={value}>{children}</StaggerContext.Provider>
  );
}

export function useStagger(): number {
  const ctx = useContext(StaggerContext);
  return ctx ? ctx.claim() : 0;
}
