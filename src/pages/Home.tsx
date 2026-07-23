import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  getMistakeIds,
  getProfileName,
  getResults,
  getTreasuryPassed,
} from '../lib/storage';
import { formatPct } from '../lib/format';

interface FeatureCard {
  to: string;
  title: string;
  desc: string;
  tile: string;
  icon: ReactNode;
}

const cards: FeatureCard[] = [
  {
    to: '/practice',
    title: 'Practice by Topic',
    desc: 'Drill one skill at a time with instant feedback.',
    tile: 'from-blue-500 to-blue-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/mock',
    title: 'Timed Mock Exam',
    desc: 'Simulate exam day with a countdown and a fresh set.',
    tile: 'from-violet-500 to-violet-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2 2M9 2h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/review',
    title: 'Review Mistakes',
    desc: 'Turn every wrong answer into a win.',
    tile: 'from-amber-500 to-orange-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/history',
    title: 'History & Progress',
    desc: 'Watch your scores climb over time.',
    tile: 'from-emerald-500 to-teal-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 15l3-3 3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Home() {
  const results = getResults();
  const attempts = results.length;
  const best = attempts ? Math.max(...results.map((r) => r.scorePct)) : 0;
  const mistakes = getMistakeIds().length;
  const name = getProfileName();

  const treasuryResults = results.filter((r) => r.level === 'treasury');
  const trAttempts = treasuryResults.length;
  const trBest = trAttempts
    ? Math.max(...treasuryResults.map((r) => r.scorePct))
    : 0;
  const brutalCleared = getTreasuryPassed().includes('brutal');

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 p-6 shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/4 h-52 w-52 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="relative">
          {name && (
            <p className="text-sm font-semibold text-yellow-300">Hi, {name}! Kaya mo &rsquo;to.</p>
          )}
          <h1 className="mt-1 text-2xl font-extrabold leading-tight text-white sm:text-4xl">
            Ready to ace the Civil Service Exam?
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-100">
            Every practice set gets you closer to passing. Pick a mode below and start
            building your streak, the passing score is 80%.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              to="/practice"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-blue-700 shadow-md transition hover:bg-blue-50"
            >
              Start practicing
            </Link>
            <Link
              to="/mock"
              className="rounded-xl bg-white/15 px-5 py-2.5 text-sm font-bold text-white ring-1 ring-white/30 transition hover:bg-white/25"
            >
              Take a mock exam
            </Link>
          </div>
        </div>
      </section>

      {/* Brutal cleared trophy */}
      {brutalCleared && (
        <section className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-100 to-yellow-50 p-4 shadow-sm">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <path d="M8 21h8M12 17v4" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M7 4h10v4a5 5 0 0 1-10 0V4Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-extrabold text-amber-800">
              Brutal Treasury Cleared
            </p>
            <p className="text-xs text-amber-700">
              You survived the boss level. Respect.
            </p>
          </div>
        </section>
      )}

      {/* Quick stats */}
      <section className="mt-5 grid grid-cols-3 gap-3">
        <Stat label="Attempts" value={String(attempts)} />
        <Stat label="Best score" value={attempts ? formatPct(best) : '--'} />
        <Stat label="To review" value={String(mistakes)} />
      </section>

      {/* Feature cards */}
      <section className="mt-5 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${c.tile} text-white shadow`}
              >
                {c.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">{c.title}</h2>
                  {c.to === '/review' && mistakes > 0 && (
                    <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">
                      {mistakes}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-600">{c.desc}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-blue-600 group-hover:underline">
                  Open &rarr;
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Office Review (separate track from the CSE) */}
      <section className="mt-8">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
          Office Review
        </h2>
        <Link
          to="/treasury"
          className="group block overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6"
              >
                <path
                  d="M3 21h18M4 10h16M5 10V6l7-3 7 3v4M9 10v11M15 10v11"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900">Treasury Review</h3>
              <p className="mt-1 text-sm text-slate-600">
                Job-knowledge practice for LGU municipal treasury staff. Not part of the
                Civil Service Exam.
              </p>
              {trAttempts > 0 && (
                <p className="mt-2 text-xs font-semibold text-indigo-700">
                  {trAttempts} treasury attempt{trAttempts > 1 ? 's' : ''} &middot; Best{' '}
                  {formatPct(trBest)}
                </p>
              )}
              <span className="mt-3 inline-block text-sm font-semibold text-indigo-600 group-hover:underline">
                Open &rarr;
              </span>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
      <p className="text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  );
}
