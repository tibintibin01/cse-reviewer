import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Level, QuizConfig, TopicId } from '../types';
import { getTopic, topicsForLevel } from '../data/topics';
import { countAvailable } from '../lib/quiz';
import { colorStyle } from '../lib/ui';

const COUNT_OPTIONS = [5, 10, 15, 20];

export default function Practice() {
  const navigate = useNavigate();
  const [level, setLevel] = useState<Level>('professional');
  const [selected, setSelected] = useState<TopicId[]>([]);
  const [count, setCount] = useState(10);
  const [immediate, setImmediate] = useState(true);

  const topics = topicsForLevel(level);
  const available = countAvailable(level, selected);
  const effectiveCount = Math.min(count, Math.max(1, available));

  function changeLevel(next: Level) {
    setLevel(next);
    setSelected((prev) =>
      prev.filter((id) => topicsForLevel(next).some((t) => t.id === id)),
    );
  }

  function toggleTopic(id: TopicId) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function start() {
    const label =
      selected.length === 1
        ? `Practice: ${getTopic(selected[0])?.name}`
        : selected.length === 0
        ? 'Practice: All topics'
        : `Practice: ${selected.length} topics`;

    const cfg: QuizConfig = {
      mode: 'practice',
      level,
      topicIds: selected,
      count: effectiveCount,
      immediateFeedback: immediate,
      label,
    };
    navigate('/quiz', { state: { config: cfg } });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-extrabold text-slate-900">Practice by Topic</h1>
      <p className="mt-1 text-sm text-slate-600">
        Choose a level and topics. Leave topics unselected to practice across all of them.
      </p>

      {/* Level */}
      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold text-slate-900">Level</p>
        <div className="inline-flex rounded-lg border border-slate-300 bg-white p-1">
          <LevelButton
            active={level === 'professional'}
            onClick={() => changeLevel('professional')}
          >
            Professional
          </LevelButton>
          <LevelButton
            active={level === 'subprofessional'}
            onClick={() => changeLevel('subprofessional')}
          >
            Sub-Professional
          </LevelButton>
        </div>
      </div>

      {/* Topics */}
      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold text-slate-900">Topics</p>
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
                  ? 'border-blue-600 bg-blue-600 text-white'
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
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            All ({available})
          </button>
        </div>
      </div>

      {/* Immediate feedback */}
      <div className="mt-6 flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Immediate feedback</p>
          <p className="text-xs text-slate-500">
            Show the correct answer and explanation right after you answer.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={immediate}
          onClick={() => setImmediate((v) => !v)}
          className={`relative h-6 w-11 rounded-full transition ${
            immediate ? 'bg-blue-600' : 'bg-slate-300'
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
              immediate ? 'left-[22px]' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      <button
        type="button"
        onClick={start}
        className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
      >
        Start practice ({effectiveCount} question{effectiveCount > 1 ? 's' : ''})
      </button>
    </div>
  );
}

function LevelButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-4 py-1.5 text-sm font-semibold transition ${
        active ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  );
}
