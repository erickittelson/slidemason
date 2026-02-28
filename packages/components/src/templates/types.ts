import type { CSSProperties } from 'react';

/* ── Shared types ─────────────────────────────────────────── */

export type AccentColor = 'blue' | 'emerald' | 'purple' | 'amber' | 'rose';

export type GradientName =
  | 'blue-purple'
  | 'emerald-blue'
  | 'amber-rose'
  | 'purple-rose';

export interface SlideItem {
  label: string;
  description?: string;
  icon?: string;
}

export interface MetricItem {
  value: string;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: AccentColor;
}

export interface TimelineItem {
  phase: string;
  title: string;
  description: string;
  status?: 'completed' | 'in-progress' | 'upcoming';
}

export interface ComparisonItem {
  label: string;
  before: string;
  after: string;
}

export interface ColumnItem {
  title: string;
  description: string;
  items?: string[];
  icon?: string;
  color?: AccentColor;
}

export interface QuoteData {
  text: string;
  attribution?: string;
  role?: string;
}

export interface ActionItem {
  action: string;
  owner?: string;
  date?: string;
  status?: 'todo' | 'in-progress' | 'done';
}

/* ── Template props ───────────────────────────────────────── */

export interface TitleSlideProps {
  title: string;
  subtitle?: string;
  badge?: string;
  gradient?: GradientName;
}

export interface AgendaSlideProps {
  title?: string;
  items: SlideItem[];
}

export interface SectionDividerSlideProps {
  number?: string;
  title: string;
  subtitle?: string;
  gradient?: GradientName;
}

export interface ContentSlideProps {
  title: string;
  subtitle?: string;
  bullets?: string[];
  layout?: 'single' | 'two-column';
  rightBullets?: string[];
}

export interface ContentMediaSlideProps {
  title: string;
  subtitle?: string;
  bodyText?: string;
  bullets?: string[];
  mediaPosition?: 'left' | 'right';
  visual?: 'icon-grid' | 'diagram' | 'checklist';
  visualItems?: SlideItem[];
}

export interface MetricsSlideProps {
  title?: string;
  subtitle?: string;
  metrics: MetricItem[];
}

export interface FeatureSlideProps {
  title?: string;
  subtitle?: string;
  features: SlideItem[];
  columns?: 2 | 3;
}

export interface TimelineSlideProps {
  title?: string;
  subtitle?: string;
  items: TimelineItem[];
  variant?: 'vertical' | 'horizontal';
}

export interface ComparisonSlideProps {
  title?: string;
  beforeLabel?: string;
  afterLabel?: string;
  variant?: 'before-after' | 'pros-cons';
  items?: ComparisonItem[];
  pros?: string[];
  cons?: string[];
}

export interface ProcessSlideProps {
  title?: string;
  subtitle?: string;
  steps: SlideItem[];
}

export interface QuoteSlideProps {
  quote: QuoteData;
  theme?: AccentColor;
}

export interface DiagramSlideProps {
  title?: string;
  subtitle?: string;
  type: 'flywheel' | 'funnel' | 'cycle' | 'pyramid';
  segments: Array<{ label: string; value?: number }>;
}

export interface TableSlideProps {
  title?: string;
  subtitle?: string;
  steps: ActionItem[];
}

export interface FullBleedSlideProps {
  title: string;
  subtitle?: string;
  gradient?: AccentColor | 'dark';
}

export interface ConclusionSlideProps {
  variant?: 'thankyou' | 'qa' | 'contact';
  title?: string;
  subtitle?: string;
  callToAction?: string;
  contactInfo?: {
    email?: string;
    website?: string;
    social?: string;
  };
  items?: SlideItem[];
}
