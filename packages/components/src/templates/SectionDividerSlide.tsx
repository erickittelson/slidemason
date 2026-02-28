import type { SectionDividerSlideProps } from './types';
import { SectionHeader } from '../navigation/SectionHeader';

export function SectionDividerSlide({ number, title, subtitle }: SectionDividerSlideProps) {
  return (
    <SectionHeader
      number={number != null ? Number(number) : undefined}
      title={title}
      subtitle={subtitle}
      animate
      className="flex-1"
    />
  );
}
