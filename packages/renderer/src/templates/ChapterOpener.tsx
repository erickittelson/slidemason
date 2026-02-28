import { ChapterCard, MeshGradient } from '@slidemason/components';

interface ChapterOpenerProps {
  number: number;
  title: string;
  subtitle?: string;
  colors?: string[];
}

export function ChapterOpener({ number, title, subtitle, colors }: ChapterOpenerProps) {
  return (
    <MeshGradient colors={colors}>
      <div className="flex flex-col h-full items-center justify-center">
        <ChapterCard number={number} title={title} subtitle={subtitle} />
      </div>
    </MeshGradient>
  );
}
