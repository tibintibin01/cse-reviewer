import { formatDuration } from '../lib/format';

export default function Timer({ secondsLeft }: { secondsLeft: number }) {
  const warning = secondsLeft <= 60;
  return (
    <div
      className={`rounded-lg px-3 py-1.5 text-sm font-semibold tabular-nums ${
        warning ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
      }`}
      aria-live="polite"
    >
      {formatDuration(secondsLeft)}
    </div>
  );
}
