export const HEADING_FONTS = [
  // Sans-serif — bold & modern
  'Inter', 'Oswald', 'Montserrat', 'Raleway', 'Poppins',
  'Space Grotesk', 'DM Sans', 'Outfit', 'Plus Jakarta Sans', 'Sora',
  'Bebas Neue', 'Barlow Condensed', 'Anton', 'Archivo Black',
  // Serif — elegant & editorial
  'Playfair Display', 'DM Serif Display', 'Lora', 'Merriweather',
  'Libre Baskerville', 'Cormorant Garamond', 'Crimson Text',
  // Slab — strong & punchy
  'Roboto Slab', 'Arvo', 'Zilla Slab',
];

export const BODY_FONTS = [
  // Sans-serif — clean & readable
  'Inter', 'DM Sans', 'Source Sans 3', 'IBM Plex Sans', 'Nunito',
  'Open Sans', 'Lato', 'Rubik', 'Work Sans', 'Karla',
  'Plus Jakarta Sans', 'Outfit', 'Poppins', 'Raleway',
  // Serif — warm & readable
  'Source Serif 4', 'Lora', 'Merriweather', 'Libre Baskerville',
  'Crimson Text', 'PT Serif',
  // Mono — technical
  'JetBrains Mono', 'IBM Plex Mono',
];

export interface FontPairing {
  name: string;
  heading: string;
  body: string;
  vibe: string;
}

export const FONT_PAIRINGS: FontPairing[] = [
  { name: 'Clean & Modern', heading: 'Inter', body: 'Inter', vibe: 'Versatile, no-nonsense' },
  { name: 'Bold Impact', heading: 'Oswald', body: 'DM Sans', vibe: 'Strong headlines, smooth body' },
  { name: 'Startup Vibes', heading: 'Space Grotesk', body: 'DM Sans', vibe: 'Techy, approachable' },
  { name: 'Executive Suite', heading: 'Playfair Display', body: 'Source Sans 3', vibe: 'Elegant serif + clean sans' },
  { name: 'Editorial', heading: 'DM Serif Display', body: 'Lora', vibe: 'Magazine-quality polish' },
  { name: 'Tech Forward', heading: 'Plus Jakarta Sans', body: 'IBM Plex Sans', vibe: 'Geometric, professional' },
  { name: 'Friendly & Warm', heading: 'Poppins', body: 'Nunito', vibe: 'Rounded, inviting' },
  { name: 'Conference Stage', heading: 'Montserrat', body: 'Open Sans', vibe: 'Big stage energy' },
  { name: 'Condensed Power', heading: 'Barlow Condensed', body: 'Work Sans', vibe: 'Compact, data-friendly' },
  { name: 'Elegant Contrast', heading: 'Cormorant Garamond', body: 'Raleway', vibe: 'Refined serif + airy sans' },
  { name: 'Punchy & Direct', heading: 'Bebas Neue', body: 'Karla', vibe: 'All-caps impact' },
  { name: 'Minimal Luxe', heading: 'Outfit', body: 'Outfit', vibe: 'Cohesive, geometric' },
  { name: 'News Desk', heading: 'Libre Baskerville', body: 'Source Serif 4', vibe: 'Authoritative, trustworthy' },
  { name: 'Slab Strength', heading: 'Roboto Slab', body: 'Rubik', vibe: 'Bold slab + soft sans' },
  { name: 'Sharp & Smooth', heading: 'Sora', body: 'Inter', vibe: 'Geometric precision' },
];

const loaded = new Set<string>();

export function loadGoogleFont(fontName: string) {
  if (loaded.has(fontName) || fontName === 'Inter') return;
  loaded.add(fontName);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;600;700&display=swap`;
  document.head.appendChild(link);
}

export function applyFonts(heading: string, body: string) {
  loadGoogleFont(heading);
  loadGoogleFont(body);
  document.documentElement.style.setProperty('--sm-heading-font', `'${heading}', system-ui, sans-serif`);
  document.documentElement.style.setProperty('--sm-body-font', `'${body}', system-ui, sans-serif`);
}
