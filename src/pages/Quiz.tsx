import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import type { QuizConfig } from '../types';
import { buildResult, commitSeen, prepareQuestions, selectQuestions } from '../lib/quiz';
import { saveResult, updateMistakes } from '../lib/storage';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import Timer from '../components/Timer';

interface LocationState {
  config?: QuizConfig;
}

export default function Quiz() {
  const location = useLocation();
  const config = (location.state as LocationState | null)?.config;

  // Guard: a quiz must be started from a setup page that supplies a config.
  if (!config) {
    return <Navigate to="/" replace />;
  }
  return <QuizRunner config={config} />;
}

function QuizRunner({ config }: { config: QuizConfig }) {
  const navigate = useNavigate();
  const [questions] = useState(() => prepareQuestions(selectQuestions(config)));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [startedAt] = useState(() => Date.now());
  const [secondsLeft, setSecondsLeft] = useState(config.timeLimitSec ?? 0);

  const submittedRef = useRef(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const immediate = config.immediateFeedback;
  const total = questions.length;

  const handleSubmit = useCallback(
    (auto = false) => {
      if (submittedRef.current) return;
      const latest = answersRef.current;
      if (!auto) {
        const answered = questions.filter((q) => latest[q.id] != null).length;
        const unanswered = questions.length - answered;
        if (
          unanswered > 0 &&
          !window.confirm(
            `You have ${unanswered} unanswered question(s). Submit anyway?`,
          )
        ) {
          return;
        }
      }
      submittedRef.current = true;
      const durationSec = Math.round((Date.now() - startedAt) / 1000);
      const result = buildResult(config, questions, latest, durationSec);
      saveResult(result);
      updateMistakes(result.answers);
      navigate('/results', { state: { result }, replace: true });
    },
    [config, navigate, questions, startedAt],
  );

  // Countdown tick (timed mocks only).
  useEffect(() => {
    if (!config.timeLimitSec) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [config.timeLimitSec]);

  // Auto-submit when the clock runs out.
  useEffect(() => {
    if (config.timeLimitSec && secondsLeft === 0) {
      handleSubmit(true);
    }
  }, [secondsLeft, config.timeLimitSec, handleSubmit]);

  // Advance the rotation once, when this session starts, so repeated mocks and
  // practice sets serve fresh questions.
  useEffect(() => {
    commitSeen(config, questions.map((q) => q.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (total === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="mb-2 text-xl font-bold text-slate-900">No questions available</h1>
        <p className="mb-6 text-sm text-slate-600">
          There are no questions matching this selection yet. Try different topics or add more to the question bank.
        </p>
        <Link
          to="/"
          className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const q = questions[current];
  const selectedIndex = answers[q.id] ?? null;
  const revealed = immediate && answers[q.id] != null;
  const answeredCount = questions.filter((qq) => answers[qq.id] != null).length;
  const isLast = current === total - 1;

  function handleSelect(choiceIndex: number) {
    if (submittedRef.current) return;
    if (immediate && answers[q.id] != null) return; // lock after answering
    setAnswers((prev) => ({ ...prev, [q.id]: choiceIndex }));
  }

  function goTo(i: number) {
    setCurrent(Math.max(0, Math.min(total - 1, i)));
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Top bar */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{config.label}</p>
          <p className="text-xs text-slate-500">
            {answeredCount} of {total} answered
          </p>
        </div>
        {config.timeLimitSec ? (
          <Timer secondsLeft={secondsLeft} />
        ) : (
          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
            Question {current + 1}/{total}
          </span>
        )}
      </div>

      <div className="mb-4">
        <ProgressBar current={current + 1} total={total} />
      </div>

      <QuestionCard
        question={q}
        index={current}
        total={total}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
        revealed={revealed}
      />

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <div className="flex items-center gap-2">
          {!immediate && (
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Submit
            </button>
          )}
          {isLast ? (
            immediate ? (
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Finish
              </button>
            ) : null
          ) : (
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* Question navigator */}
      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Jump to question
        </p>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((qq, i) => {
            const done = answers[qq.id] != null;
            const isCurrent = i === current;
            return (
              <button
                key={qq.id}
                type="button"
                onClick={() => goTo(i)}
                className={`h-8 w-8 rounded-md text-xs font-semibold transition ${
                  isCurrent
                    ? 'bg-blue-600 text-white'
                    : done
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link to="/" className="text-xs font-medium text-slate-400 hover:text-slate-600">
          Quit without saving
        </Link>
      </div>
    </div>
  );
}
