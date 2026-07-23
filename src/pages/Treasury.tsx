import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { QuizConfig, TopicId } from '../types';
import { getTopic, topicsForLevel } from '../data/topics';
import { countAvailable } from '../lib/quiz';
import { colorStyle } from '../lib/ui';

const COUNT_OPTIONS = [5, 10, 15, 20];

export default function Treasury() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<TopicId[]>([]);
  const [count, setCount] = useState(10);
  const [timed, setTimed] = useState(false);

  const topics = topicsForLevel('treasury');
  const available = countAvailable('treasury', selected);
  const effectiveCount = Math.min(count, Math.max(1, available));

  function toggleTopic(id: TopicId) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function start() {
    const label = timed
      ? 'Treasury Exam'
      : selected.length === 1
      ? `Treasury: ${getTopic(selected[0])?.shortName}`
      : 'Treasury Practice';

    const cfg: QuizConfig = {
      mode: timed ? 'mock' : 'practice',
      level: 'treasury',
      topicIds: selected,
      count: effectiveCount,
      timeLimitSec: timed ? effectiveCount * 60 : undefined,
      immediateFeedback: !timed,
      label,
    };
    navigate('/quiz', { state: { config: cfg } });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl bg-gradient-to-br from-indigo-700 to-blue-800 p-6 text-white shadow-lg">
        <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ring-white/25">
          Office Review
        </span>
        <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">Treasury Review</h1>
        <p className="mt-1 max-w-xl text-sm text-indigo-100">
          Job-knowledge practice for LGU municipal treasury staff, based on the Local
          Government Code and treasury operations. This is separate from the Civil
          Service Exam.
        </p>
      </div>

      {/* Topics */}
      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold text-slate-900">
          Topics{' '}
          <span className="font-normal text-slate-400">
            (leave blank for all areas)
          </span>
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {topics.map((t) => {
            const active = selected.includes(t.id);
            const style = colorStyle(t.color);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleTopic(t.id)}
                className={`rounded-lg border p-3 text-left transition ${
                  active
                    ? `${style.bgSoft} ${style.border}`
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                  <span className="text-sm font-semibold text-slate-900">{t.name}</span>
                  {active && (
                    <span className={`ml-auto text-xs font-bold ${style.text}`}>Selected</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-500">{t.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Count */}
      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold text-slate-900">
          Number of questions{' '}
          <span className="font-normal text-slate-400">({available} available)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {COUNT_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              disabled={n > available}
              onClick={() => setCount(n)}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                count === n && n <= available
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCount(available)}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              count >= available
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            All ({available})
          </button>
        </div>
      </div>

      {/* Timed toggle */}
      <div className="mt-6 flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Timed exam mode</p>
          <p className="text-xs text-slate-500">
            On: a countdown with feedback at the end. Off: practice with instant
            feedback and explanations.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={timed}
          onClick={() => setTimed((v) => !v)}
          className={`relative h-6 w-11 rounded-full transition ${
            timed ? 'bg-indigo-600' : 'bg-slate-300'
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
              timed ? 'left-[22px]' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      <button
        type="button"
        onClick={start}
        className="mt-6 w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
      >
        {timed ? 'Start timed exam' : 'Start practice'} ({effectiveCount} question
        {effectiveCount > 1 ? 's' : ''})
      </button>
    </div>
  );
}
