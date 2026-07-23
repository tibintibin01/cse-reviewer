import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import type {
  AttemptResult,
  Difficulty,
  QuestionView,
  QuizConfig,
  TopicId,
} from '../types';
import { PASSING_PCT } from '../types';
import { getQuestionById } from '../lib/quiz';
import { getTopic } from '../data/topics';
import { formatDuration, formatPct } from '../lib/format';
import QuestionCard from '../components/QuestionCard';

interface LocationState {
  result?: AttemptResult;
  unlockedTier?: Difficulty;
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = (location.state as LocationState | null)?.result;
  const unlockedTier = (location.state as LocationState | null)?.unlockedTier;

  if (!result) {
    return <Navigate to="/" replace />;
  }

  const wrongIds = result.answers.filter((a) => !a.correct).map((a) => a.questionId);

  // Per-topic breakdown.
  const byTopic = new Map<TopicId, { correct: number; total: number }>();
  for (const a of result.answers) {
    const q = getQuestionById(a.questionId);
    if (!q) continue;
    const entry = byTopic.get(q.topic) ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (a.correct) entry.correct += 1;
    byTopic.set(q.topic, entry);
  }

  function reviewMistakes() {
    if (wrongIds.length === 0) return;
    const cfg: QuizConfig = {
      mode: 'review',
      level: result!.level,
      topicIds: [],
      questionIds: wrongIds,
      count: wrongIds.length,
      immediateFeedback: true,
      label: 'Reviewing missed questions',
    };
    navigate('/quiz', { state: { config: cfg } });
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Score hero */}
      <div
        className={`rounded-2xl border p-6 text-center shadow-sm ${
          result.passed
            ? 'border-emerald-200 bg-emerald-50'
            : 'border-rose-200 bg-rose-50'
        }`}
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {result.label}
        </p>
        {result.userName && (
          <p className="mt-0.5 text-xs text-slate-500">Taken by {result.userName}</p>
        )}
        <p
          className={`my-2 text-5xl font-extrabold ${
            result.passed ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {formatPct(result.scorePct)}
        </p>
        <p className="text-sm text-slate-600">
          {result.correct} correct out of {result.total}
        </p>
        <div className="mt-3 flex items-center justify-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              result.passed
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            {result.passed ? 'PASSED' : 'DID NOT PASS'}
          </span>
          <span className="text-xs text-slate-500">
            Passing score: {PASSING_PCT}% · Time: {formatDuration(result.durationSec)}
          </span>
        </div>
      </div>

      {/* Progression unlock */}
      {unlockedTier && (
        <div className="mt-4 rounded-2xl border border-indigo-300 bg-indigo-50 p-4 text-center">
          <p className="text-sm font-extrabold text-indigo-700">New level unlocked!</p>
          <p className="mt-0.5 text-xs text-slate-600">
            You cleared this tier and unlocked the{' '}
            <span className="font-semibold capitalize">{unlockedTier}</span> Treasury
            level. Open Treasury to take it on.
          </p>
        </div>
      )}

      {/* Per-topic breakdown */}
      {byTopic.size > 0 && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-bold text-slate-900">Breakdown by topic</h2>
          <ul className="space-y-2">
            {Array.from(byTopic.entries()).map(([topicId, s]) => {
              const topic = getTopic(topicId);
              const pct = s.total > 0 ? (s.correct / s.total) * 100 : 0;
              return (
                <li key={topicId} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 text-sm text-slate-700">
                    {topic?.shortName ?? topicId}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right text-sm font-medium text-slate-600">
                    {s.correct}/{s.total}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-2">
        {wrongIds.length > 0 && (
          <button
            type="button"
            onClick={reviewMistakes}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Review my {wrongIds.length} mistake{wrongIds.length > 1 ? 's' : ''}
          </button>
        )}
        <Link
          to="/practice"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          New practice set
        </Link>
        <Link
          to="/"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Home
        </Link>
      </div>

      {/* Full review */}
      <h2 className="mb-3 mt-8 text-lg font-bold text-slate-900">Answer review</h2>
      <div className="space-y-4">
        {result.answers.map((a, i) => {
          const q = getQuestionById(a.questionId);
          if (!q) return null;
          const view: QuestionView = {
            id: a.questionId,
            topic: q.topic,
            passage: q.passage,
            question: q.question,
            choices: a.choices ?? q.choices,
            answerIndex: a.answerIndex ?? q.answerIndex,
            explanation: q.explanation,
          };
          return (
            <QuestionCard
              key={a.questionId}
              question={view}
              index={i}
              total={result.total}
              selectedIndex={a.chosenIndex}
              onSelect={() => {}}
              revealed
              disabled
            />
          );
        })}
      </div>
    </div>
  );
}
