// Quiz engine: question selection and scoring.

import type {
  Level,
  TopicId,
  Question,
  QuestionView,
  QuizConfig,
  AnswerRecord,
  AttemptResult,
} from '../types';
import { PASSING_PCT } from '../types';
import { QUESTIONS } from '../data/questions';
import { getProfileName, getSeenIds, setSeenIds } from './storage';

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

export function poolFor(level: Level, topicIds: TopicId[]): Question[] {
  let pool = QUESTIONS.filter((q) => q.levels.includes(level));
  if (topicIds.length > 0) {
    pool = pool.filter((q) => topicIds.includes(q.topic));
  }
  return pool;
}

export function countAvailable(level: Level, topicIds: TopicId[]): number {
  return poolFor(level, topicIds).length;
}

/**
 * Pick `count` questions from `pool`, preferring ones not seen recently so
 * repeated sessions cycle through the bank before showing the same item again.
 * Read-only: call commitSeen() when a session starts to record what was shown.
 */
export function pickFresh(pool: Question[], count: number): Question[] {
  const n = Math.min(count, pool.length);
  if (n <= 0) return [];
  const seen = new Set(getSeenIds());
  const unseen = pool.filter((q) => !seen.has(q.id));
  if (unseen.length >= n) {
    return shuffle(unseen).slice(0, n);
  }
  // Not enough fresh questions left: take all remaining unseen, then top up
  // from the already-seen ones.
  const fill = shuffle(pool.filter((q) => seen.has(q.id))).slice(
    0,
    n - unseen.length,
  );
  return shuffle([...unseen, ...fill]);
}

export function selectQuestions(config: QuizConfig): Question[] {
  // Review mode: use the explicit set as-is (no rotation).
  if (config.questionIds && config.questionIds.length > 0) {
    const pool = config.questionIds
      .map((id) => getQuestionById(id))
      .filter((q): q is Question => Boolean(q));
    const shuffled = shuffle(pool);
    return shuffled.slice(0, Math.min(config.count, shuffled.length));
  }
  // Practice / mock: rotate through unseen questions first.
  const pool = poolFor(config.level, config.topicIds);
  return pickFresh(pool, config.count);
}

/**
 * Record the questions shown in a session so future sessions favor fresh ones.
 * When the whole pool has been seen, the rotation resets (keeping only the most
 * recent set so it is not immediately repeated). Skipped for review mode.
 */
export function commitSeen(config: QuizConfig, shownIds: string[]): void {
  if (config.questionIds && config.questionIds.length > 0) return;
  const poolIds = poolFor(config.level, config.topicIds).map((q) => q.id);
  const seen = new Set(getSeenIds());
  for (const id of shownIds) seen.add(id);
  if (poolIds.length > 0 && poolIds.every((id) => seen.has(id))) {
    setSeenIds([...shownIds]);
  } else {
    setSeenIds([...seen]);
  }
}

/**
 * Shuffle each question's answer choices so the correct option is not always in
 * the same position. Returns view objects with the answerIndex remapped to the
 * shuffled order. Different for each person/session.
 */
export function prepareQuestions(questions: Question[]): QuestionView[] {
  return questions.map((q) => {
    const order = shuffle(q.choices.map((_, i) => i));
    return {
      id: q.id,
      topic: q.topic,
      passage: q.passage,
      question: q.question,
      choices: order.map((i) => q.choices[i]),
      answerIndex: order.indexOf(q.answerIndex),
      explanation: q.explanation,
    };
  });
}

export function buildResult(
  config: QuizConfig,
  questions: QuestionView[],
  chosen: Record<string, number | null>,
  durationSec: number,
): AttemptResult {
  const answers: AnswerRecord[] = questions.map((q) => {
    const chosenIndex = chosen[q.id] ?? null;
    return {
      questionId: q.id,
      chosenIndex,
      correct: chosenIndex === q.answerIndex,
      choices: q.choices,
      answerIndex: q.answerIndex,
    };
  });
  const correct = answers.filter((a) => a.correct).length;
  const total = questions.length;
  const scorePct = total > 0 ? (correct / total) * 100 : 0;
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    mode: config.mode,
    level: config.level,
    label: config.label,
    userName: getProfileName() || undefined,
    topicIds: config.topicIds,
    total,
    correct,
    scorePct,
    passed: scorePct >= PASSING_PCT,
    dateISO: new Date().toISOString(),
    durationSec,
    answers,
  };
}
