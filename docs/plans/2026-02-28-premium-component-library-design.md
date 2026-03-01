# Slidemason V2: Premium Component Library Design

## Goal

Transform Slidemason from a 16-component text-layout tool into a 116-component cinematic presentation system with world-class visual capabilities spanning consulting, keynote, SaaS, and TED-talk styles.

## Architecture: Category-Based Component Library

100+ reusable React components organized into 10 categories, composable into 40 slide templates, styled by 12 themes, with CSS animations and SVG diagram primitives.

---

## Infrastructure

### Icon System
- **Lucide React** (~1000 icons, tree-shakeable, MIT license)
- SVG icons inherit `currentColor` → auto theme-aware
- Used throughout components: cards, lists, diagrams, headers

### Animation System (`motion.css`)

**Entrances:**
- `sm-fade-in`, `sm-fade-up`, `sm-fade-down`, `sm-fade-left`, `sm-fade-right`
- `sm-scale-in`, `sm-scale-up`
- `sm-blur-in`, `sm-rotate-in`, `sm-bounce-in`, `sm-elastic-in`
- `sm-typewriter` (character-by-character)
- `sm-counter` (number count-up)

**Emphasis/Looping:**
- `sm-pulse`, `sm-glow`, `sm-float`, `sm-shimmer`

**SVG-specific:**
- `sm-draw` (stroke-dasharray line drawing)
- `sm-fill-in` (progressive fill)
- `sm-morph` (path morphing)

**3D & Depth:**
- `sm-flip-in` (3D card flip)
- `sm-tilt` (parallax tilt)
- `sm-depth-push` (translateZ)
- `sm-parallax-slow`, `sm-parallax-fast`

**Slide Transitions:**
- `sm-transition-fade`, `sm-transition-slide`, `sm-transition-zoom`
- `sm-transition-morph`, `sm-transition-reveal`, `sm-transition-blur`

**Timing/Orchestration:**
- `sm-stagger-1` through `sm-stagger-12`
- `sm-delay-100` through `sm-delay-2000`
- `sm-duration-fast` (200ms), `sm-duration-normal` (500ms), `sm-duration-slow` (1000ms), `sm-duration-cinematic` (2000ms)
- `sm-ease-out`, `sm-ease-spring`, `sm-ease-cinematic`
- All respect `prefers-reduced-motion: reduce`

### SVG Diagram Primitives (`packages/components/src/svg/`)
- `Arrow`, `Connector`, `CircleNode`, `BoxNode` — flowcharts
- `ArcSegment`, `Ring` — cycles/flywheels/donuts
- `FunnelTrapezoid`, `PyramidLayer` — funnels/pyramids
- All use CSS variables for fills/strokes

### Component Prop Convention
Every component receives:
- `className?: string` — layout overrides
- `style?: CSSProperties` — inline overrides
- `animate?: boolean | 'stagger'` — opt-in animations

---

## 10 Component Categories (116 total)

### Category 1: Typography & Text (12)
1. `HeroText` — Massive centered text, gradient fills, text shadows
2. `GradientText` — CSS gradient fill text (linear/radial, theme-aware)
3. `TypewriterText` — Character-by-character typing animation
4. `StatCallout` — Giant number + label + optional trend arrow (↑12%)
5. `PullQuote` — Large italic quote with decorative oversized quotation marks
6. `CodeBlock` — Syntax-highlighted code with line numbers, language badge
7. `HighlightBox` — Colored callout box (info/warning/success/tip variants)
8. `Annotation` — Floating note with arrow pointing to content
9. `BigNumber` — Animated counter that counts up to target
10. `Label` — Small pill/tag/badge for categories or status
11. `BlockQuoteStack` — Multiple quotes stacked with visual connectors
12. `TextReveal` — Text that fades in line-by-line with stagger

### Category 2: Lists & Sequential (12)
13. `IconList` — Bullet list with Lucide icon per item
14. `Checklist` — Checkmark/x icons for done/not-done items
15. `TimelineVertical` — Vertical timeline with dots, lines, dates
16. `TimelineHorizontal` — Horizontal timeline with milestones
17. `ProcessFlow` — Horizontal boxes connected by arrows (A → B → C)
18. `StepCards` — Numbered step cards in horizontal row
19. `AccordionList` — Expandable sections (one expanded visually)
20. `ProgressSteps` — Step indicator with filled/unfilled circles + line
21. `RankedList` — Numbered list with magnitude bars
22. `BreadcrumbPath` — Horizontal journey path
23. `MilestoneTracker` — Timeline with completed/current/future states
24. `SwimLanes` — Parallel horizontal tracks for concurrent processes

### Category 3: Grids & Cards (14)
25. `IconCard` — Large Lucide icon + title + description
26. `FeatureGrid` — 2×2 or 3×3 icon + title + description grid
27. `PricingTable` — Side-by-side pricing tiers with checkmarks
28. `TeamGrid` — Avatar + name + role cards grid
29. `TestimonialCard` — Quote + avatar + name + company
30. `MetricCard` — Number + label + sparkline
31. `ImageCard` — Image with title and description overlay
32. `LogoGrid` — Evenly-spaced logo/partner grid
33. `StackedCards` — Overlapping fanned-out cards
34. `NumberedCards` — Cards with large sequential numbers (01, 02, 03)
35. `GlassCard` — Frosted glass (backdrop-blur) on gradient
36. `ActionCard` — Card with icon, text, CTA button
37. `InfoCard` — Card with colored left border stripe
38. `ProfileCard` — Person: photo, name, title, bio, social

### Category 4: Diagrams & Frameworks (16)
39. `Flywheel` — Circular diagram with labeled feeding segments
40. `CycleDiagram` — Circular arrows connecting 3-6 stages
41. `FunnelChart` — Tapered conversion funnel
42. `PyramidChart` — Layered triangle (Maslow-style)
43. `VennDiagram` — 2-3 overlapping circles with labels
44. `OrgChart` — Hierarchical tree of connected boxes
45. `MindMap` — Central node with radiating branches
46. `Flowchart` — Boxes + diamonds + arrows for decisions
47. `MatrixQuadrant` — 2×2 BCG-style matrix with labeled axes
48. `RadarChart` — Spider/radar multi-axis comparison
49. `ConcentricCircles` — Nested circles (target/bullseye)
50. `SankeyFlow` — Quantity flow from sources to destinations
51. `TreeMap` — Nested rectangles showing proportional sizes
52. `HubSpoke` — Central hub with radiating spokes
53. `BridgeDiagram` — Waterfall/bridge additions and subtractions
54. `LoopDiagram` — Feedback loop with labeled arrows

### Category 5: Data Visualization (14)
55. `BarChart` — Horizontal or vertical bars with labels
56. `StackedBar` — Stacked bar chart with segments
57. `DonutChart` — Ring chart with center label
58. `ProgressBar` — Horizontal fill bar with percentage
59. `ProgressRing` — Circular progress indicator
60. `GaugeChart` — Half-circle speedometer gauge
61. `Sparkline` — Tiny inline line chart
62. `HeatmapGrid` — Color-coded grid cells
63. `WaterfallChart` — Rising/falling incremental bars
64. `BulletChart` — Bar with target marker and ranges
65. `AreaChart` — Filled line chart
66. `ScatterPlot` — Dot plot with X/Y axes
67. `PieChart` — Classic pie chart with labels
68. `HarveyBall` — Filled circle quarters (consulting-style)

### Category 6: Comparison & Analysis (12)
69. `ProsCons` — Two-column green checks vs red X's
70. `BeforeAfter` — Side-by-side, before dimmed / after highlighted
71. `VersusSlide` — Dramatic "VS" centerpiece
72. `FeatureMatrix` — Feature comparison grid with icons
73. `HarveyBallMatrix` — Matrix with Harvey ball indicators
74. `SWOTGrid` — 2×2 SWOT analysis
75. `ScoreCard` — Criteria + weights + scores with total
76. `TrafficLight` — Items with red/yellow/green indicators
77. `RatingStars` — Items with 1-5 star ratings
78. `GapAnalysis` — Current → gap → desired state
79. `PriorityMatrix` — Effort vs Impact quadrant
80. `CompetitorMap` — Positioning on 2 axes

### Category 7: Media & Visual (10)
81. `FullBleedImage` — Edge-to-edge bg image + text overlay
82. `ImageGrid` — 2×2 or 3×3 image mosaic
83. `ImageTextSplit` — 50/50 image + text layout
84. `PhoneMockup` — Content inside phone frame SVG
85. `BrowserMockup` — Content inside browser chrome
86. `LaptopMockup` — Content inside laptop frame
87. `ScreenshotAnnotated` — Image with numbered callout circles
88. `VideoEmbed` — Embedded video player
89. `IconMosaic` — Decorative Lucide icon grid background
90. `AvatarStack` — Overlapping circular avatars

### Category 8: Backgrounds & Decorative (10)
91. `GradientBg` — Full-slide gradient (linear/radial/conic)
92. `MeshGradient` — Multi-point blurred gradient
93. `GeometricPattern` — Repeating SVG pattern (dots, lines, triangles)
94. `BlobShape` — Organic blob SVG decorative elements
95. `GridLines` — Subtle grid/graph-paper background
96. `WavesDivider` — SVG wave shape between sections
97. `CircuitPattern` — Circuit board line pattern
98. `TopographyLines` — Contour lines pattern
99. `NoisyGradient` — Gradient with grain/noise overlay
100. `SpotlightEffect` — Radial gradient spotlight

### Category 9: Navigation & Structure (8)
101. `AgendaNav` — Agenda with current section highlighted
102. `SectionHeader` — Full-slide section break with number + title
103. `ChapterCard` — Chapter opener with large number + decorative lines
104. `BreadcrumbBar` — Top navigation state bar
105. `ProgressIndicator` — Thin progress bar at slide edge
106. `TableOfContents` — Clickable agenda with page numbers
107. `EndSlide` — Thank You / Q&A / contact ending
108. `TitleCard` — Chapter title with bg image/gradient

### Category 10: Interactive & CTA (8)
109. `RecommendationBox` — Highlighted action with icon + emphasis
110. `NextStepsGrid` — Actions with owners, dates, status
111. `ContactCard` — Person + email + phone + social
112. `QRCode` — Generated QR code for URL
113. `CTAButton` — Large styled call-to-action
114. `PollResults` — Bar chart of survey/vote results
115. `CountdownTimer` — Animated countdown to date
116. `EmbedFrame` — iframe wrapper for external content

---

## 40 Templates

### Existing (1-12)
1. TitleHero, 2. SectionDivider, 3. Agenda, 4. TwoColumnArgument,
5. QuoteInsight, 6. StatGridSlide, 7. ImageCaption, 8. ComparisonTableSlide,
9. TimelineSlide, 10. Roadmap, 11. RecommendationAsk, 12. Appendix

### New (13-40)
13. `IconFeatures` — FeatureGrid + GradientBg
14. `DataDashboard` — KPIStrip + BarChart + DonutChart
15. `ProcessOverview` — ProcessFlow + Subheadline
16. `FunnelBreakdown` — FunnelChart + StatCallout
17. `CycleExplainer` — CycleDiagram + BulletGroup
18. `FlywheelSlide` — Flywheel + Subheadline
19. `SWOTAnalysis` — SWOTGrid
20. `ProsConsSlide` — ProsCons + Headline
21. `BeforeAfterSlide` — BeforeAfter + Headline
22. `VersusMatchup` — VersusSlide
23. `TeamIntro` — TeamGrid + Headline
24. `TestimonialSpotlight` — TestimonialCard + GradientBg
25. `PricingOverview` — PricingTable
26. `ScreenshotDemo` — BrowserMockup/PhoneMockup + Subheadline
27. `ImageStory` — FullBleedImage + HeroText
28. `DataComparison` — FeatureMatrix + Headline
29. `NumbersImpact` — BigNumber + StatCallout (×3)
30. `QuadrantAnalysis` — MatrixQuadrant + Headline
31. `OrgStructure` — OrgChart + Headline
32. `FlowDecision` — Flowchart + Headline
33. `GapBridge` — GapAnalysis + Headline
34. `RadarComparison` — RadarChart + Legend
35. `HeatmapView` — HeatmapGrid + Headline
36. `ScoreCardSlide` — ScoreCard + Headline
37. `NextStepsAction` — NextStepsGrid + Headline
38. `ContactEnd` — ContactCard + EndSlide
39. `ChapterOpener` — ChapterCard + MeshGradient
40. `LogoShowcase` — LogoGrid + Headline

---

## 12 Themes

| # | Name | Vibe | Background | Primary | Style |
|---|------|------|-----------|---------|-------|
| 1 | Slate | Modern dark | `#0f172a` | `#3b82f6` | Default, tech |
| 2 | Canvas | Clean light | `#fafaf9` | `#292524` | Minimal, editorial |
| 3 | Signal | Bold dark | `#020617` | `#e11d48` | Dramatic, urgent |
| 4 | Noir | Cinematic | `#000000` | `#d4a574` | Film noir, luxury |
| 5 | Dawn | Warm organic | `#fef3c7` | `#c2410c` | TED talk, earthy |
| 6 | Boardroom | Corporate | `#0c1929` | `#f8fafc` | Goldman, McKinsey |
| 7 | Neon | Cyberpunk | `#0a0a0a` | `#ec4899` | Startup, launch |
| 8 | Forest | Nature | `#052e16` | `#86efac` | Sustainability |
| 9 | Glacier | Cool minimal | `#f0f9ff` | `#0369a1` | Scandinavian |
| 10 | Sunset | Warm gradient | `#1e1b4b` | `#f97316` | Creative, bold |
| 11 | Paper | Academic | `#fffbeb` | `#1e3a5f` | Research, journal |
| 12 | Midnight | Rich dark | `#18181b` | `#8b5cf6` | Modern SaaS, AI |

### Theme Variables (per theme)
**Colors:** `--sm-bg`, `--sm-surface`, `--sm-text`, `--sm-muted`, `--sm-primary`, `--sm-secondary`, `--sm-accent`, `--sm-border`
**Semantic:** `--sm-success`, `--sm-warning`, `--sm-danger`
**Gradient:** `--sm-gradient-start`, `--sm-gradient-end`, `--sm-gradient-mesh-1` through `--sm-gradient-mesh-4`
**Charts:** `--sm-chart-1` through `--sm-chart-6`
**Glass:** `--sm-glass-bg`
**Typography:** `--sm-heading-font`, `--sm-body-font`, `--sm-mono-font`
**Layout:** `--sm-radius`
**Shadows:** `--sm-shadow-sm`, `--sm-shadow-md`, `--sm-shadow-lg`

---

## Dependencies

- `lucide-react` — Icon library
- No charting library — all data viz is pure SVG React components
- No animation library — pure CSS animations

## File Structure

```
packages/components/src/
├── svg/                    # SVG primitives (Arrow, Ring, etc.)
├── typography/             # Category 1: 12 components
├── lists/                  # Category 2: 12 components
├── cards/                  # Category 3: 14 components
├── diagrams/               # Category 4: 16 components
├── dataviz/                # Category 5: 14 components
├── comparison/             # Category 6: 12 components
├── media/                  # Category 7: 10 components
├── backgrounds/            # Category 8: 10 components
├── navigation/             # Category 9: 8 components
├── interactive/            # Category 10: 8 components
├── motion.css              # Animation system
└── index.ts                # Barrel export
```
