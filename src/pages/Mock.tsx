import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Level, QuizConfig } from '../types';
import { countAvailable } from '../lib/quiz';
import { formatDuration } from '../lib/format';

const OFFICIAL: Record<
  'professional' | 'subprofessional',
  { label: string; items: number; time: string; perItem: number }
> = {
  professional: {
    label: 'Professional',
    items: 170,
    time: '3 hours 10 minutes',
    perItem: 67,
  },
  subprofessional: {
    label: 'Sub-Professional',
    items: 165,
    time: '2 hours 40 minutes',
    perItem: 58,
  },
};

const LENGTH_OPTIONS = [25, 40, 60];

export default function Mock() {
  const navigate = useNavigate();
  const [level, setLevel] = useState<Level>('professional');
  const [length, setLength] = useState<number>(40);

  const info = OFFICIAL[level];
  const available = countAvailable(level, []);
  const effectiveCount = Math.min(length, available);
  const isFull = length >= available;
  const timeLimitSec = effectiveCount * info.perItem;

  function start() {
    const cfg: QuizConfig = {
      mode: 'mock',
      level,
      topicIds: [],
      count: effectiveCount,
      timeLimitSec,
      immediateFeedback: false,
      label: `Mock Exam (${info.label})`,
    };
    navigate('/quiz', { state: { config: cfg } });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-extrabold text-slate-900">Timed Mock Exam</h1>
      <p className="mt-1 text-sm text-slate-600">
        A timed simulation. No feedback is shown until you submit, and the exam
        auto-submits when the timer runs out.
      </p>

      {/* Level */}
      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold text-slate-900">Level</p>
        <div className="inline-flex rounded-lg border border-slate-300 bg-white p-1">
          <button
            type="button"
            onClick={() => setLevel('professional')}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold transition ${
              level === 'professional'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Professional
          </button>
          <button
            type="button"
            onClick={() => setLevel('subprofessional')}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold transition ${
              level === 'subprofessional'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Sub-Professional
          </button>
        </div>
      </div>

      {/* Length */}
      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold text-slate-900">
          Exam length{' '}
          <span className="font-normal text-slate-400">({available} in the bank)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {LENGTH_OPTIONS.map((n) => {
            const active = length === n && n < available;
            return (
              <button
                key={n}
                type="button"
                disabled={n > available}
                onClick={() => setLength(n)}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  active
                    ? 'border-violet-600 bg-violet-600 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {n} items
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setLength(available)}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              isFull
                ? 'border-violet-600 bg-violet-600 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Full ({available})
          </button>
        </div>
      </div>

      {/* Official reference */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-900">The actual CSE-PPT ({info.label})</p>
        <p className="mt-1">
          {info.items} items, to be finished in {info.time}. Passing score is 80%.
        </p>
      </div>

      {/* This mock */}
      <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50 p-5">
        <p className="text-sm font-semibold text-slate-900">This practice mock</p>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <p className="text-3xl font-extrabold text-violet-700">{effectiveCount}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Questions
            </p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-violet-700">
              {formatDuration(timeLimitSec)}
            </p>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Time limit
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Each mock pulls a fresh, random mix and holds back questions you have already
          seen until you have worked through the bank &mdash; so you can take a new one
          every day. Time scales to the real exam&rsquo;s per-item pace.
        </p>
      </div>

      <button
        type="button"
        onClick={start}
        className="mt-6 w-full rounded-lg bg-violet-600 px-5 py-3 text-sm font-bold text-white hover:bg-violet-700"
      >
        Start mock exam ({effectiveCount} items)
      </button>
    </div>
  );
}
