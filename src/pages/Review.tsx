import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { QuizConfig, TopicId } from '../types';
import { clearMistakes, getMistakeIds } from '../lib/storage';
import { getQuestionById } from '../lib/quiz';
import { getTopic } from '../data/topics';
import { colorStyle } from '../lib/ui';

export default function Review() {
  const navigate = useNavigate();
  const [ids, setIds] = useState<string[]>(() => getMistakeIds());

  const groups = new Map<TopicId, number>();
  for (const id of ids) {
    const q = getQuestionById(id);
    if (!q) continue;
    groups.set(q.topic, (groups.get(q.topic) ?? 0) + 1);
  }

  function start() {
    if (ids.length === 0) return;
    const cfg: QuizConfig = {
      mode: 'review',
      level: 'professional',
      topicIds: [],
      questionIds: ids,
      count: ids.length,
      immediateFeedback: true,
      label: 'Review: missed questions',
    };
    navigate('/quiz', { state: { config: cfg } });
  }

  function clear() {
    if (window.confirm('Clear all saved mistakes? This cannot be undone.')) {
      clearMistakes();
      setIds([]);
    }
  }

  if (ids.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="mb-2 text-xl font-bold text-slate-900">Nothing to review yet</h1>
        <p className="mb-6 text-sm text-slate-600">
          When you answer a question incorrectly, it lands here so you can practice it
          again. Answer it correctly later and it drops off the list.
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
      <h1 className="text-2xl font-extrabold text-slate-900">Review Mistakes</h1>
      <p className="mt-1 text-sm text-slate-600">
        You have {ids.length} question{ids.length > 1 ? 's' : ''} to review. Answering
        one correctly removes it from this list.
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-sm font-bold text-slate-900">By topic</p>
        <ul className="space-y-2">
          {Array.from(groups.entries()).map(([topicId, n]) => {
            const topic = getTopic(topicId);
            const style = colorStyle(topic?.color ?? 'blue');
            return (
              <li key={topicId} className="flex items-center gap-2 text-sm">
                <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                <span className="text-slate-700">{topic?.name ?? topicId}</span>
                <span className="ml-auto font-semibold text-slate-500">{n}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={start}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
        >
          Review all {ids.length}
        </button>
        <button
          type="button"
          onClick={clear}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Clear list
        </button>
      </div>
    </div>
  );
}
