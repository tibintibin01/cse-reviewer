import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { QuizMode } from '../types';
import { clearResults, getMistakeIds, getResults } from '../lib/storage';
import { formatDate, formatDuration, formatPct } from '../lib/format';

const MODE_LABEL: Record<QuizMode, string> = {
  practice: 'Practice',
  mock: 'Mock',
  review: 'Review',
};

export default function History() {
  const [results, setResults] = useState(() => getResults());
  const mistakes = getMistakeIds().length;

  const attempts = results.length;
  const avg = attempts
    ? results.reduce((sum, r) => sum + r.scorePct, 0) / attempts
    : 0;
  const best = attempts ? Math.max(...results.map((r) => r.scorePct)) : 0;

  function clear() {
    if (window.confirm('Delete all attempt history? This cannot be undone.')) {
      clearResults();
      setResults([]);
    }
  }

  if (attempts === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="mb-2 text-xl font-bold text-slate-900">No attempts yet</h1>
        <p className="mb-6 text-sm text-slate-600">
          Take a practice quiz or a mock exam and your scores will show up here so you
          can track your progress.
        </p>
        <Link
          to="/practice"
          className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Start practicing
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-900">History &amp; Progress</h1>
        <button
          type="button"
          onClick={clear}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          Clear history
        </button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat label="Attempts" value={String(attempts)} />
        <Stat label="Average" value={formatPct(avg)} />
        <Stat label="Best" value={formatPct(best)} />
      </div>

      {mistakes > 0 && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          You have {mistakes} question{mistakes > 1 ? 's' : ''} in your review list.{' '}
          <Link to="/review" className="font-semibold underline">
            Review them
          </Link>
        </div>
      )}

      <div className="mt-5 space-y-2">
        {results.map((r) => (
          <div
            key={r.id}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div
              className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg text-sm font-extrabold ${
                r.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}
            >
              {formatPct(r.scorePct)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{r.label}</p>
              <p className="text-xs text-slate-500">
                {formatDate(r.dateISO)} · {r.correct}/{r.total} · {formatDuration(r.durationSec)}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {MODE_LABEL[r.mode]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
      <p className="text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  );
}
