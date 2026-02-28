# Component Catalog — Complete Reference

All 116 components available in `@slidemason/components`, organized by category. Every component supports `className?: string` and `style?: CSSProperties` unless noted otherwise. Most components also accept `animate?: boolean | 'stagger'` for entry animations.

Import all components from `@slidemason/components`:

```tsx
import { Headline, StatGrid, BarChart } from '@slidemason/components'
```

---

## Category 1: Core Layout (16 components)

These are the foundational building blocks used by most templates.

| Component | Props | Description | When to Use |
|-----------|-------|-------------|-------------|
| `Headline` | `children` | Large bold heading (h1) using clamp sizing | Primary slide heading |
| `Subheadline` | `children` | Muted secondary heading (h2) | Subtitle or supporting heading |
| `BulletGroup` | `items: string[]` | Styled unordered bullet list | Any list of key points |
| `NumberedSteps` | `steps: string[]` | Ordered numbered list | Sequential items or agenda |
| `TwoColumn` | `left: ReactNode`, `right: ReactNode` | Two-column flex layout | Side-by-side content |
| `ThreeCard` | `cards: Array<{title, content}>` | Three-column card grid | Three key points or concepts |
| `SectionLabel` | `label: string` | Centered label with horizontal rules | Section separators |
| `StatCard` | `value: string`, `label: string` | Single statistic display | Individual KPI |
| `StatGrid` | `stats: Array<{value, label}>` | Responsive grid of stat cards (2-4) | Multiple KPIs at a glance |
| `QuoteCallout` | `quote: string`, `attribution?: string` | Styled blockquote with attribution | Highlighting a quote |
| `ImagePanel` | `src: string`, `alt: string`, `caption?: string` | Image with optional caption | Displaying an image |
| `KPIStrip` | `kpis: Array<{value, label}>` | Horizontal row of KPIs | Compact metric bar |
| `TimelineRow` | `date: string`, `title: string`, `description?: string` | Single timeline entry | Individual timeline event |
| `ComparisonMatrix` | `headers: [string, string]`, `rows: Array<{label, values}>` | Two-column comparison table | Side-by-side feature comparison |
| `FooterMark` | `text: string` | Small muted footer text | Branding or copyright |
| `PresenterNotes` | `children: ReactNode` | Hidden presenter notes (data attribute) | Speaker notes for any slide |

---

## Category 2: Typography & Text (12 components)

Rich text presentation components for emphasis and variety.

| Component | Props | Description | When to Use |
|-----------|-------|-------------|-------------|
| `HeroText` | `children`, `gradient?: boolean`, `shadow?: boolean` | Extra-large display text | Hero slide headlines |
| `GradientText` | `children`, `from?: string`, `to?: string`, `direction?: string` | Text with CSS gradient fill | Stylized emphasis text |
| `TypewriterText` | `text: string`, `speed?: number` | Typewriter animation effect | Dramatic text reveal |
| `StatCallout` | `value: string`, `label: string`, `trend?: {direction, value}` | Prominent stat with optional trend | Highlighting a key metric |
| `PullQuote` | `quote: string`, `attribution?: string` | Large decorative quote | Featured quotations |
| `CodeBlock` | `code: string`, `language?: string` | Syntax-highlighted code | Code samples |
| `HighlightBox` | `children`, `variant?: 'info'|'warning'|'success'|'tip'` | Colored callout box | Callouts, tips, warnings |
| `Annotation` | `text: string`, `position?: 'top'|'bottom'|'left'|'right'` | Positioned annotation label | Labeling diagram elements |
| `BigNumber` | `value: number`, `prefix?: string`, `suffix?: string` | Animated counting number | Dramatic stat reveal |
| `Label` | `text: string`, `color?: string`, `variant?: 'filled'|'outline'` | Small tag/badge | Status labels, categories |
| `BlockQuoteStack` | `quotes: Array<{text, author?}>` | Stacked multiple quotes | Multiple testimonials |
| `TextReveal` | `lines: string[]` | Staggered line reveal animation | Dramatic multi-line reveal |

---

## Category 3: Lists & Sequential (12 components)

Ordered and structured list displays.

| Component | Props | Description | When to Use |
|-----------|-------|-------------|-------------|
| `IconList` | `items: Array<{icon, text}>` | List with Lucide icons | Feature lists with icons |
| `Checklist` | `items: Array<{text, checked}>` | Checkbox-style list | Requirements, task lists |
| `TimelineVertical` | `events: Array<{date, title, description?}>` | Vertical timeline with dots | Chronological events |
| `TimelineHorizontal` | `milestones: Array<{label, date?, active?}>` | Horizontal milestone line | Project milestones |
| `ProcessFlow` | `steps: Array<{label, icon?}>` | Horizontal process with arrows | Step-by-step workflows |
| `StepCards` | `steps: Array<{number, title, description}>` | Numbered step cards | Detailed process steps |
| `AccordionList` | `items: Array<{title, content, expanded?}>` | Expandable list items | FAQ, detailed breakdowns |
| `ProgressSteps` | `steps: string[]`, `current: number` | Progress indicator with steps | Multi-step progress |
| `RankedList` | `items: Array<{label, value}>` | Horizontal bar ranked list | Rankings, leaderboards |
| `BreadcrumbPath` | `steps: string[]`, `current?: number` | Breadcrumb navigation trail | Showing position in a flow |
| `MilestoneTracker` | `milestones: Array<{label, status}>` | Status-tracked milestones | Project status tracking |
| `SwimLanes` | `lanes: Array<{label, items: Array<{text, start, end}>}>` | Gantt-style swim lanes | Parallel workstreams |

---

## Category 4: Cards & Grids (14 components)

Card-based layouts for structured content.

| Component | Props | Description | When to Use |
|-----------|-------|-------------|-------------|
| `IconCard` | `icon: string`, `title: string`, `description: string` | Card with Lucide icon header | Feature highlights |
| `FeatureGrid` | `features: Array<{icon, title, description}>`, `columns?: 2|3` | Grid of icon+text feature cards | Feature overviews |
| `PricingTable` | `tiers: PricingTier[]` | Side-by-side pricing columns | Pricing pages |
| `TeamGrid` | `members: Array<{name, role, avatar?}>` | Avatar grid of team members | Team introductions |
| `TestimonialCard` | `quote`, `name`, `title?`, `company?`, `avatar?` | Styled testimonial card | Customer quotes |
| `MetricCard` | `value`, `label`, `trend?`, `sparkline?: number[]` | Metric with optional sparkline | Dashboard KPIs |
| `ImageCard` | `src`, `alt`, `title`, `description?` | Image with text overlay | Visual content cards |
| `LogoGrid` | `logos: Array<{src, alt}>` | Responsive logo grid | Partner/client logos |
| `StackedCards` | `cards: Array<{title, content}>` | Vertically stacked cards | Layered information |
| `NumberedCards` | `items: Array<{title, description}>` | Auto-numbered cards | Ordered concepts |
| `GlassCard` | `children` | Glassmorphism effect card | Stylized content containers |
| `ActionCard` | `icon`, `title`, `description`, `action` | Card with CTA action text | Actionable items |
| `InfoCard` | `title`, `content`, `accent?: string` | Simple info card with accent bar | General information display |
| `ProfileCard` | `name`, `title`, `bio?`, `avatar?`, `social?` | Detailed profile card | Individual bios |

---

## Category 5: Diagrams & Frameworks (16 components)

SVG-based diagram components for complex visual relationships.

| Component | Props | Description | When to Use |
|-----------|-------|-------------|-------------|
| `Flywheel` | `segments: Array<{label}>`, `size?: number` | Circular flywheel diagram | Reinforcing loops |
| `CycleDiagram` | `stages: Array<{label}>`, `size?: number` | Circular cycle with arrows | Cyclical processes |
| `FunnelChart` | `stages: Array<{label, value?}>` | Tapering funnel visualization | Conversion funnels |
| `PyramidChart` | `layers: Array<{label}>` | Stacked pyramid layers | Hierarchies, priorities |
| `VennDiagram` | `sets: Array<{label}>`, `intersection?: string` | 2-3 overlapping circles | Relationships, overlaps |
| `OrgChart` | `nodes: Array<{id, label, parentId?}>` | Hierarchical org tree | Organization structures |
| `MindMap` | `center: string`, `branches: Array<{label, children?}>` | Radial mind map | Brainstorming, concept maps |
| `Flowchart` | `nodes: Array<{id, label, type}>`, `edges: Array<{from, to, label?}>` | Process/decision flowchart | Decision trees, workflows |
| `MatrixQuadrant` | `xAxis`, `yAxis`, `quadrants: [4 strings]`, `items?` | 2x2 matrix with plotted items | Strategic analysis |
| `RadarChart` | `axes: Array<{label, value, max?}>`, `size?: number` | Spider/radar chart | Multi-dimensional comparison |
| `ConcentricCircles` | `rings: Array<{label}>` | Nested concentric rings | Layered concepts |
| `SankeyFlow` | `nodes: Array<{id, label}>`, `flows: Array<{from, to, value}>` | Sankey flow diagram | Resource/flow allocation |
| `TreeMap` | `items: Array<{label, value}>` | Proportional rectangle treemap | Proportional data display |
| `HubSpoke` | `center: string`, `spokes: Array<{label}>` | Hub-and-spoke diagram | Central concept with branches |
| `BridgeDiagram` | `start: {label, value}`, `changes: Array<{label, value}>`, `end: {label, value}` | Waterfall bridge chart | Financial bridges |
| `LoopDiagram` | `stages: Array<{label}>`, `direction?: 'clockwise'|'counterclockwise'` | Circular loop with direction | Iterative processes |

---

## Category 6: Data Visualization (14 components)

Chart and data display components.

| Component | Props | Description | When to Use |
|-----------|-------|-------------|-------------|
| `BarChart` | `bars: Array<{label, value}>`, `direction?: 'horizontal'|'vertical'`, `max?` | Bar chart | Categorical comparisons |
| `StackedBar` | `bars: Array<{label, segments: Array<{value, label?}>}>` | Stacked bar chart | Composition breakdowns |
| `DonutChart` | `segments: Array<{label, value}>`, `centerLabel?`, `size?` | Donut/ring chart | Part-of-whole data |
| `ProgressBar` | `value: number`, `max?`, `label?`, `showPercent?` | Linear progress bar | Completion percentage |
| `ProgressRing` | `value: number`, `max?`, `size?`, `label?` | Circular progress ring | Circular completion |
| `GaugeChart` | `value: number`, `min?`, `max?`, `label?` | Semi-circle gauge | Single metric gauge |
| `Sparkline` | `data: number[]`, `width?`, `height?`, `color?` | Tiny inline line chart | Inline trend indicators |
| `HeatmapGrid` | `rows: Array<{label, cells: number[]}>`, `columnLabels?` | Color-coded data grid | Pattern recognition in data |
| `WaterfallChart` | `items: Array<{label, value}>`, `startLabel?` | Waterfall chart | Incremental value changes |
| `BulletChart` | `value`, `target`, `ranges: [3 numbers]`, `label?` | Bullet comparison chart | Actual vs target metrics |
| `AreaChart` | `data: Array<{label, value}>`, `fill?: boolean` | Filled line/area chart | Trend visualization |
| `ScatterPlot` | `points: Array<{x, y, label?}>`, `xLabel?`, `yLabel?` | Scatter plot | Correlation display |
| `PieChart` | `slices: Array<{label, value}>` | Pie chart | Simple proportions |
| `HarveyBall` | `value: 0|25|50|75|100`, `size?` | Harvey ball indicator | Qualitative scoring |

---

## Category 7: Comparison & Analysis (12 components)

Side-by-side and analytical comparison components.

| Component | Props | Description | When to Use |
|-----------|-------|-------------|-------------|
| `ProsCons` | `pros: string[]`, `cons: string[]` | Two-column pros/cons layout | Advantage/disadvantage lists |
| `BeforeAfter` | `before: {title, items}`, `after: {title, items}` | Before/after split comparison | Transformation showcase |
| `VersusSlide` | `left: {label, points?}`, `right: {label, points?}` | Dramatic versus layout with "VS" | Head-to-head comparisons |
| `FeatureMatrix` | `features: string[]`, `products: Array<{name, values}>` | Feature check matrix table | Product feature comparison |
| `HarveyBallMatrix` | `criteria: string[]`, `options: Array<{name, scores}>` | Matrix with Harvey ball scores | Qualitative multi-criteria scoring |
| `SWOTGrid` | `strengths`, `weaknesses`, `opportunities`, `threats` (all string arrays) | 2x2 SWOT grid | Strategic SWOT analysis |
| `ScoreCard` | `criteria: Array<{label, weight, score}>` | Weighted scoring table with totals | Quantitative evaluation |
| `TrafficLight` | `items: Array<{label, status, note?}>` | Traffic light status indicators | Status dashboards |
| `RatingStars` | `items: Array<{label, rating, max?}>` | Star rating display | Comparative ratings |
| `GapAnalysis` | `current: {label, value}`, `desired: {label, value}`, `gap: string` | Current vs desired gap visual | Gap identification |
| `PriorityMatrix` | `items: Array<{label, effort, impact}>`, `effortLabel?`, `impactLabel?` | Effort/impact scatter plot | Prioritization |
| `CompetitorMap` | `items: Array<{label, x, y}>`, `xAxis`, `yAxis` | Competitive positioning plot | Market positioning |

---

## Category 8: Media & Visual (10 components)

Image, video, and visual display components.

| Component | Props | Description | When to Use |
|-----------|-------|-------------|-------------|
| `FullBleedImage` | `src`, `alt`, `children?`, `overlay?: 'dark'|'light'|'gradient'` | Full-bleed background image | Hero images, visual slides |
| `ImageGrid` | `images: Array<{src, alt}>`, `columns?: 2|3` | Responsive image grid | Photo galleries |
| `ImageTextSplit` | `image: {src, alt}`, `children`, `imagePosition?: 'left'|'right'` | 50/50 image + text layout | Image with explanation |
| `PhoneMockup` | `src?`, `children?` | Phone device frame | Mobile app screenshots |
| `BrowserMockup` | `url?`, `src?`, `children?` | Browser window frame | Web app screenshots |
| `LaptopMockup` | `src?`, `children?` | Laptop device frame | Desktop app screenshots |
| `ScreenshotAnnotated` | `src`, `alt`, `annotations: Array<{x, y, label}>` | Screenshot with labeled markers | Annotated UI walkthroughs |
| `VideoEmbed` | `src`, `poster?`, `aspectRatio?` | Video player or iframe embed | Video content |
| `IconMosaic` | `icons: string[]`, `columns?`, `opacity?` | Decorative icon grid background | Subtle visual backgrounds |
| `AvatarStack` | `avatars: Array<{src?, name}>`, `max?` | Overlapping avatar circles | User/team indicators |

---

## Category 9: Backgrounds & Decorative (10 components)

Background wrappers and decorative elements. These wrap `children`.

| Component | Props | Description | When to Use |
|-----------|-------|-------------|-------------|
| `GradientBg` | `children`, `type?: 'linear'|'radial'|'conic'`, `from?`, `to?`, `angle?` | Gradient background wrapper | Colored slide backgrounds |
| `MeshGradient` | `children`, `colors?: string[]` | Multi-point mesh gradient | Modern gradient backgrounds |
| `GeometricPattern` | `children`, `pattern?: 'dots'|'lines'|'triangles'|'crosses'`, `opacity?` | SVG pattern overlay | Textured backgrounds |
| `BlobShape` | `color?`, `size?`, `position?: {x, y}` | Organic blob SVG shape | Decorative accents |
| `GridLines` | `children`, `spacing?`, `opacity?` | Grid line overlay | Technical/structured feel |
| `WavesDivider` | `color?`, `position?: 'top'|'bottom'`, `flip?` | Wave SVG divider | Section transitions |
| `CircuitPattern` | `children`, `opacity?` | Circuit board SVG pattern | Tech-themed backgrounds |
| `TopographyLines` | `children`, `opacity?` | Topographic contour lines | Subtle organic texture |
| `NoisyGradient` | `children`, `from?`, `to?` | Gradient with noise texture | Textured gradient backgrounds |
| `SpotlightEffect` | `children`, `x?`, `y?`, `size?` | Radial spotlight overlay | Dramatic focus effect |

---

## Category 10: Navigation & Structure (8 components)

Deck navigation and structural components.

| Component | Props | Description | When to Use |
|-----------|-------|-------------|-------------|
| `AgendaNav` | `items: Array<{label, active?}>` | Horizontal agenda navigation bar | Agenda/TOC slides |
| `SectionHeader` | `title`, `number?`, `subtitle?` | Section header with optional number | Section openers |
| `ChapterCard` | `number`, `title`, `subtitle?` | Large chapter break card | Chapter transitions |
| `BreadcrumbBar` | `items: string[]`, `current?` | Navigation breadcrumb bar | Position indicators |
| `ProgressIndicator` | `current`, `total`, `position?: 'top'|'bottom'` | Slide progress bar | Deck progress |
| `TableOfContents` | `items: Array<{title, page?}>` | Vertical table of contents | Content overview |
| `EndSlide` | `variant: 'thankyou'|'qa'|'contact'`, `message?`, `contactInfo?` | End/closing slide | Final slide |
| `TitleCard` | `title`, `subtitle?`, `background?: 'gradient'|'image'`, `bgSrc?` | Title display card | Section titles |

---

## Category 11: Interactive & CTA (8 components)

Call-to-action and interactive components.

| Component | Props | Description | When to Use |
|-----------|-------|-------------|-------------|
| `RecommendationBox` | `title`, `description`, `icon?`, `priority?: 'high'|'medium'|'low'` | Styled recommendation callout | Key recommendations |
| `NextStepsGrid` | `steps: Array<{action, owner?, date?, status?}>` | Action items grid | Next steps and owners |
| `ContactCard` | `name`, `title?`, `email?`, `phone?`, `avatar?` | Contact information card | Contact details |
| `QRCode` | `url`, `size?`, `label?` | QR code generator (SVG) | Links and resources |
| `CTAButton` | `text`, `variant?: 'primary'|'secondary'|'outline'`, `icon?` | Styled call-to-action button | Action prompts |
| `PollResults` | `question?`, `options: Array<{label, value, total?}>` | Poll/survey results bars | Survey data display |
| `CountdownTimer` | `targetDate: string`, `labels?` | Live countdown display | Event countdowns |
| `EmbedFrame` | `src`, `title?`, `aspectRatio?` | Responsive iframe embed | External content |

---

## Category 12: SVG Primitives (8 components)

Low-level SVG building blocks used internally by diagram components. Use these for custom diagrams.

| Component | Props | Description | When to Use |
|-----------|-------|-------------|-------------|
| `Arrow` | `x1`, `y1`, `x2`, `y2`, `color?`, `strokeWidth?` | SVG arrow with arrowhead | Directional connections |
| `Connector` | `x1`, `y1`, `x2`, `y2`, `curvature?`, `color?`, `strokeWidth?` | Curved SVG connector line | Smooth connections |
| `CircleNode` | `cx`, `cy`, `r?`, `label?`, `fill?`, `stroke?` | SVG circle with centered label | Diagram nodes |
| `BoxNode` | `x`, `y`, `width?`, `height?`, `label?`, `rx?`, `fill?`, `stroke?` | SVG rounded rectangle with label | Diagram boxes |
| `ArcSegment` | `cx`, `cy`, `radius`, `startAngle`, `endAngle`, `color?`, `strokeWidth?` | SVG arc/segment path | Circular chart segments |
| `Ring` | `cx`, `cy`, `radius?`, `thickness?`, `fillPercent?`, `color?`, `trackColor?` | SVG ring/donut segment | Progress rings |
| `FunnelTrapezoid` | `x`, `y`, `topWidth`, `bottomWidth`, `height`, `label?`, `fill?` | SVG trapezoid shape | Funnel stages |
| `PyramidLayer` | `cx`, `cy`, `level`, `totalLevels`, `totalHeight?`, `totalWidth?`, `label?`, `fill?` | SVG pyramid layer | Pyramid levels |
