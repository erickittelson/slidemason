import { z } from 'zod';

const SlideTypes = z.enum([
  'title-hero', 'agenda', 'section-divider', 'two-column-argument',
  'quote-insight', 'stat-grid', 'image-caption', 'comparison-table',
  'timeline', 'roadmap', 'recommendation-ask', 'appendix',
]);

export const SlideEntrySchema = z.object({
  id: z.string().min(1),
  type: SlideTypes,
  intent: z.string().min(1),
  headline: z.string().min(1),
  subheadline: z.string().optional(),
  components: z.array(z.string()).default([]),
  copyPoints: z.array(z.string()).optional(),
  notesSeed: z.string().optional(),
  visual: z.string().optional(),
});

export const OutlineSchema = z.object({
  theme: z.string().default('slate'),
  slides: z.array(SlideEntrySchema).min(1),
});

export type Outline = z.infer<typeof OutlineSchema>;
export type SlideEntry = z.infer<typeof SlideEntrySchema>;
