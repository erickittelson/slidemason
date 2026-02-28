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

/* ── New template props ──────────────────────────────────── */

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartSlideProps {
  title?: string;
  subtitle?: string;
  type: 'bar' | 'donut' | 'pie' | 'area' | 'stacked-bar' | 'waterfall' | 'progress' | 'gauge';
  data: ChartDataPoint[];
  /** For stacked-bar: each item has segments */
  stackedData?: Array<{ label: string; segments: Array<{ value: number; label?: string }> }>;
  /** For bar chart direction */
  direction?: 'horizontal' | 'vertical';
  /** For donut center label */
  centerLabel?: string;
  /** For gauge/progress max value */
  max?: number;
  /** For gauge: label below the value */
  gaugeLabel?: string;
}

export interface MatrixSlideProps {
  title?: string;
  subtitle?: string;
  type: 'swot' | 'feature' | 'priority' | 'competitor' | 'quadrant';
  /** SWOT */
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
  /** Feature matrix */
  features?: string[];
  products?: Array<{ name: string; values: Array<boolean | string> }>;
  /** Priority matrix / competitor map */
  items?: Array<{ label: string; x?: number; y?: number; effort?: number; impact?: number }>;
  xAxis?: string;
  yAxis?: string;
}

export interface MockupSlideProps {
  title?: string;
  subtitle?: string;
  type: 'phone' | 'browser' | 'laptop';
  src?: string;
  url?: string;
  /** Side text */
  bullets?: string[];
  mediaPosition?: 'left' | 'right';
}

export interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
}

export interface TeamSlideProps {
  title?: string;
  subtitle?: string;
  members: TeamMember[];
}

export interface SlidePricingTier {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
}

export interface PricingSlideProps {
  title?: string;
  subtitle?: string;
  tiers: SlidePricingTier[];
}

export interface CodeSlideProps {
  title?: string;
  subtitle?: string;
  code: string;
  language?: string;
  annotations?: Array<{ x: number; y: number; label: string }>;
}

export interface GallerySlideProps {
  title?: string;
  subtitle?: string;
  type: 'images' | 'logos' | 'icons';
  images?: Array<{ src: string; alt: string }>;
  logos?: Array<{ src: string; alt: string }>;
  icons?: string[];
  columns?: 2 | 3;
}

export interface ScoreSlideProps {
  title?: string;
  subtitle?: string;
  type: 'scorecard' | 'traffic-light' | 'harvey-ball' | 'gauge' | 'rating';
  /** Scorecard */
  criteria?: Array<{ label: string; weight: number; score: number }>;
  /** Traffic light */
  statusItems?: Array<{ label: string; status: 'green' | 'yellow' | 'red'; note?: string }>;
  /** Harvey ball matrix */
  harveyOptions?: Array<{ name: string; scores: Array<0 | 25 | 50 | 75 | 100> }>;
  harveyCriteria?: string[];
  /** Rating */
  ratings?: Array<{ label: string; rating: number; max?: number }>;
  /** Gauge items (multiple gauges) */
  gauges?: Array<{ value: number; min?: number; max?: number; label?: string }>;
}

export interface NetworkSlideProps {
  title?: string;
  subtitle?: string;
  type: 'org-chart' | 'mind-map' | 'hub-spoke' | 'concentric';
  /** Org chart */
  nodes?: Array<{ id: string; label: string; parentId?: string }>;
  /** Mind map / hub-spoke */
  center?: string;
  branches?: Array<{ label: string; children?: string[] }>;
  spokes?: Array<{ label: string }>;
  /** Concentric circles */
  rings?: Array<{ label: string }>;
}

export interface FlowSlideProps {
  title?: string;
  subtitle?: string;
  type: 'flowchart' | 'sankey' | 'swimlane';
  /** Flowchart */
  flowNodes?: Array<{ id: string; label: string; type: 'process' | 'decision' | 'start' | 'end' }>;
  edges?: Array<{ from: string; to: string; label?: string }>;
  /** Sankey */
  sankeyNodes?: Array<{ id: string; label: string }>;
  flows?: Array<{ from: string; to: string; value: number }>;
  /** Swimlane */
  lanes?: Array<{ label: string; items: Array<{ text: string; start: number; end: number }> }>;
}

export interface StatementSlideProps {
  title?: string;
  type: 'gradient-text' | 'typewriter' | 'big-number' | 'pull-quote' | 'text-reveal' | 'highlight';
  /** Text content for gradient-text, typewriter, text-reveal */
  text?: string;
  lines?: string[];
  /** Big number */
  value?: number;
  prefix?: string;
  suffix?: string;
  /** Pull quote */
  quote?: string;
  attribution?: string;
  /** Highlight box */
  variant?: 'info' | 'warning' | 'success' | 'tip';
  /** Background style */
  background?: 'mesh' | 'geometric' | 'noisy' | 'spotlight' | 'none';
}
