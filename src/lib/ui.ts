// Static Tailwind class maps. Full class strings are listed here so Tailwind's
// content scanner keeps them (dynamic `bg-${x}` strings would be purged).

export interface TopicStyle {
  text: string;
  bgSolid: string;
  bgSoft: string;
  border: string;
  dot: string;
}

export const COLOR_STYLES: Record<string, TopicStyle> = {
  blue: {
    text: 'text-blue-700',
    bgSolid: 'bg-blue-600 hover:bg-blue-700',
    bgSoft: 'bg-blue-50',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  violet: {
    text: 'text-violet-700',
    bgSolid: 'bg-violet-600 hover:bg-violet-700',
    bgSoft: 'bg-violet-50',
    border: 'border-violet-200',
    dot: 'bg-violet-500',
  },
  emerald: {
    text: 'text-emerald-700',
    bgSolid: 'bg-emerald-600 hover:bg-emerald-700',
    bgSoft: 'bg-emerald-50',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  teal: {
    text: 'text-teal-700',
    bgSolid: 'bg-teal-600 hover:bg-teal-700',
    bgSoft: 'bg-teal-50',
    border: 'border-teal-200',
    dot: 'bg-teal-500',
  },
  amber: {
    text: 'text-amber-700',
    bgSolid: 'bg-amber-600 hover:bg-amber-700',
    bgSoft: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  rose: {
    text: 'text-rose-700',
    bgSolid: 'bg-rose-600 hover:bg-rose-700',
    bgSoft: 'bg-rose-50',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
  },
  indigo: {
    text: 'text-indigo-700',
    bgSolid: 'bg-indigo-600 hover:bg-indigo-700',
    bgSoft: 'bg-indigo-50',
    border: 'border-indigo-200',
    dot: 'bg-indigo-500',
  },
  sky: {
    text: 'text-sky-700',
    bgSolid: 'bg-sky-600 hover:bg-sky-700',
    bgSoft: 'bg-sky-50',
    border: 'border-sky-200',
    dot: 'bg-sky-500',
  },
  cyan: {
    text: 'text-cyan-700',
    bgSolid: 'bg-cyan-600 hover:bg-cyan-700',
    bgSoft: 'bg-cyan-50',
    border: 'border-cyan-200',
    dot: 'bg-cyan-500',
  },
  orange: {
    text: 'text-orange-700',
    bgSolid: 'bg-orange-600 hover:bg-orange-700',
    bgSoft: 'bg-orange-50',
    border: 'border-orange-200',
    dot: 'bg-orange-500',
  },
};

export function colorStyle(color: string): TopicStyle {
  return COLOR_STYLES[color] ?? COLOR_STYLES.blue;
}
