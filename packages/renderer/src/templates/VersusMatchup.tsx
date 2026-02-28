import { VersusSlide } from '@slidemason/components';

interface VersusMatchupProps {
  left: { label: string; points?: string[] };
  right: { label: string; points?: string[] };
}

export function VersusMatchup({ left, right }: VersusMatchupProps) {
  return (
    <div className="flex flex-col h-full justify-center">
      <VersusSlide left={left} right={right} className="w-full" />
    </div>
  );
}
