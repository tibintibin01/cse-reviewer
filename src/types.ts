// Core domain types for the CSC Reviewer app.

export type Level = 'professional' | 'subprofessional' | 'treasury';

export type TopicId =
  | 'numerical'
  | 'analytical'
  | 'english'
  | 'filipino'
  | 'clerical'
  | 'general'
  | 'tr-lgc'
  | 'tr-rpt'
  | 'tr-rev'
  | 'tr-cash';

export interface Topic {
  id: TopicId;
  name: string;
  shortName: string;
  description: string;
  /** Which exam levels include this topic. */
  levels: Level[];
  /** Tailwind color token used for accents (e.g. "blue", "emerald"). */
  color: string;
}

export interface Question {
  id: string;
  topic: TopicId;
  /** Levels this question is appropriate for. */
  levels: Level[];
  /** Optional passage shown above the question (reading comprehension). */
  passage?: string;
  question: string;
  choices: string[];
  /** Index into `choices` of the correct answer. */
  answerIndex: number;
  explanation: string;
}

/** A question as presented in a session; `choices` may be shuffled. */
export interface QuestionView {
  id: string;
  topic: TopicId;
  passage?: string;
  question: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
}

export type QuizMode = 'practice' | 'mock' | 'review';

export interface QuizConfig {
  mode: QuizMode;
  level: Level;
  /** Topics to draw questions from. Empty means "all topics for the level". */
  topicIds: TopicId[];
  /** Explicit list of question ids (used by review mode). */
  questionIds?: string[];
  /** Number of questions to include. */
  count: number;
  /** Time limit in seconds (mock exams). Undefined means untimed. */
  timeLimitSec?: number;
  /** Show correct/incorrect immediately after each answer (practice). */
  immediateFeedback: boolean;
  /** Human friendly label for the results screen / history. */
  label: string;
}

export interface AnswerRecord {
  questionId: string;
  chosenIndex: number | null;
  correct: boolean;
  /** Choices exactly as shown (shuffled), so review matches what was seen. */
  choices: string[];
  /** Index of the correct choice within `choices`. */
  answerIndex: number;
}

export interface AttemptResult {
  id: string;
  mode: QuizMode;
  level: Level;
  label: string;
  userName?: string;
  topicIds: TopicId[];
  total: number;
  correct: number;
  scorePct: number;
  passed: boolean;
  dateISO: string;
  durationSec: number;
  answers: AnswerRecord[];
}

/** Passing score for the CSE-PPT. */
export const PASSING_PCT = 80;
