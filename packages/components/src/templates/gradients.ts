/** Tailwind gradient classes keyed by gradient name */
export const gradientMap: Record<string, string> = {
  'blue-purple': 'from-blue-400 via-purple-500 to-blue-600',
  'emerald-blue': 'from-emerald-400 via-teal-500 to-blue-600',
  'amber-rose': 'from-amber-400 via-orange-500 to-rose-600',
  'purple-rose': 'from-purple-400 via-pink-500 to-rose-600',
};

/** Tailwind color classes keyed by accent color name */
export const accentColorMap: Record<string, { text: string; bg: string; border: string; gradient: string }> = {
  blue:    { text: 'text-blue-400',    bg: 'bg-blue-500/20',    border: 'border-blue-500/30',    gradient: 'from-blue-400 to-blue-600' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', gradient: 'from-emerald-400 to-emerald-600' },
  purple:  { text: 'text-purple-400',  bg: 'bg-purple-500/20',  border: 'border-purple-500/30',  gradient: 'from-purple-400 to-purple-600' },
  amber:   { text: 'text-amber-400',   bg: 'bg-amber-500/20',   border: 'border-amber-500/30',   gradient: 'from-amber-400 to-amber-600' },
  rose:    { text: 'text-rose-400',    bg: 'bg-rose-500/20',    border: 'border-rose-500/30',    gradient: 'from-rose-400 to-rose-600' },
};
