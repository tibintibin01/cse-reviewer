import type { Difficulty, QuestionView } from '../types';
import { difficultyOf } from '../data/difficulty';

interface Props {
  question: QuestionView;
  index: number;
  total: number;
  selectedIndex: number | null;
  onSelect: (choiceIndex: number) => void;
  /** When true, correctness and the explanation are shown. */
  revealed: boolean;
  disabled?: boolean;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function QuestionCard({
  question,
  index,
  total,
  selectedIndex,
  onSelect,
  revealed,
  disabled,
}: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Question {index + 1} of {total}
        </span>
        <DifficultyBadge id={question.id} />
      </div>

      {question.passage && (
        <p className="mb-3 rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
          {question.passage}
        </p>
      )}

      <p className="mb-4 text-base font-medium text-slate-900">{question.question}</p>

      <div className="space-y-2">
        {question.choices.map((choice, i) => {
          const isSelected = selectedIndex === i;
          const isCorrect = i === question.answerIndex;

          let cls =
            'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50';
          if (revealed) {
            if (isCorrect) cls = 'border-emerald-400 bg-emerald-50';
            else if (isSelected) cls = 'border-rose-400 bg-rose-50';
            else cls = 'border-slate-200 bg-white opacity-70';
          } else if (isSelected) {
            cls = 'border-blue-500 bg-blue-50 ring-1 ring-blue-500';
          }

          return (
            <button
              key={i}
              type="button"
              disabled={disabled || revealed}
              onClick={() => onSelect(i)}
              className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition disabled:cursor-default ${cls}`}
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-xs font-semibold text-slate-600">
                {LETTERS[i] ?? i + 1}
              </span>
              <span className="text-sm text-slate-800">{choice}</span>
              {revealed && isCorrect && (
                <span className="ml-auto font-bold text-emerald-600">Correct</span>
              )}
              {revealed && isSelected && !isCorrect && (
                <span className="ml-auto font-bold text-rose-600">Your answer</span>
              )}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Explanation: </span>
          {question.explanation}
        </div>
      )}
    </div>
  );
}

const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  easy: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-rose-100 text-rose-700',
};

function DifficultyBadge({ id }: { id: string }) {
  const d = difficultyOf(id);
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${DIFFICULTY_STYLE[d]}`}
    >
      {d}
    </span>
  );
}
