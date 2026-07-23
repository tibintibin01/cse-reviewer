import type { Difficulty } from '../types';

// Difficulty is assigned per question id. HARD is reserved for genuinely tough
// items (multi-step math, advanced vocabulary/grammar, non-trivial logic).
// EASY is basic recall / one-step items. Everything else is MEDIUM.
//
// Keeping this in one place makes the tagging easy to audit and adjust: to bump
// a question up or down, just move its id between the sets below.

const HARD = new Set<string>([
  // Numerical (multi-step, rates, mixtures, probability, tough series)
  'num-53', 'num-54', 'num-55', 'num-56', 'num-57', 'num-58', 'num-59', 'num-60',
  'num-61', 'num-62', 'num-63', 'num-64', 'num-65', 'num-66', 'num-67', 'num-68',
  'num-69',
  // English (advanced vocab, parallelism, modifiers, inference, subjunctive)
  'eng-7', 'eng-8', 'eng-9', 'eng-10', 'eng-11', 'eng-12', 'eng-13', 'eng-14',
  'eng-15', 'eng-16', 'eng-17', 'eng-18', 'eng-19', 'eng-20', 'eng-21', 'eng-22',
  'eng-23',
  // Analytical / logic (syllogism validity, ordering, coding, tough series)
  'ana-49', 'ana-50', 'ana-51', 'ana-52', 'ana-53', 'ana-54', 'ana-55', 'ana-56',
  'ana-57', 'ana-58', 'ana-59', 'ana-60', 'ana-61', 'ana-62', 'ana-63', 'ana-64',
  'ana-65',
]);

const EASY = new Set<string>([
  // Numerical: single-step arithmetic / direct recall
  'num-2', 'num-5', 'num-8', 'num-9', 'num-16', 'num-19', 'num-25', 'num-26',
  'num-32', 'num-33', 'num-35', 'num-42', 'num-43', 'num-45', 'num-46', 'num-48',
  'num-49', 'num-51', 'num-52',
  // English: basic synonym/antonym/spelling/preposition
  'ver-1', 'ver-2', 'ver-4', 'ver-7', 'ver-23', 'ver-24', 'ver-25', 'ver-33',
  'eng-1', 'eng-2', 'eng-3', 'eng-6',
  // Filipino: basic vocabulary/spelling
  'fil-1', 'fil-2', 'fil-5', 'fil-9', 'fil-11', 'fil-13', 'ver-9', 'ver-19', 'ver-35',
  // Clerical: basic spelling / simple comparison
  'cle-4', 'cle-9', 'cle-13', 'cle-21', 'cle-25', 'cle-29', 'cle-33', 'cle-36', 'cle-40',
  // General: direct recall
  'gen-1', 'gen-6', 'gen-7', 'gen-12', 'gen-36', 'gen-37', 'gen-40',
  // Analytical: basic analogies / odd-one-out
  'ana-1', 'ana-4', 'ana-8', 'ana-12',
  // Treasury: direct recall
  'tlg-1', 'trv-2',
]);

export function difficultyOf(id: string): Difficulty {
  if (HARD.has(id)) return 'hard';
  if (EASY.has(id)) return 'easy';
  return 'medium';
}
