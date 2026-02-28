export const HEADING_FONTS = ['Inter', 'Playfair Display', 'Space Grotesk', 'Montserrat', 'DM Serif Display'];
export const BODY_FONTS = ['Inter', 'Source Serif 4', 'IBM Plex Sans', 'Lora', 'Nunito'];

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
