// localStorage-backed persistence for attempt history and the mistake pool.

import type { AttemptResult, AnswerRecord, Difficulty } from '../types';

const RESULTS_KEY = 'csc_reviewer_results_v1';
const MISTAKES_KEY = 'csc_reviewer_mistakes_v1';

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota errors or private-mode restrictions.
  }
}

export function getResults(): AttemptResult[] {
  const list = readJSON<AttemptResult[]>(RESULTS_KEY, []);
  // Newest first.
  return [...list].sort((a, b) => b.dateISO.localeCompare(a.dateISO));
}

export function saveResult(result: AttemptResult): void {
  const list = readJSON<AttemptResult[]>(RESULTS_KEY, []);
  list.push(result);
  writeJSON(RESULTS_KEY, list);
}

export function clearResults(): void {
  writeJSON(RESULTS_KEY, []);
}

export function getMistakeIds(): string[] {
  return readJSON<string[]>(MISTAKES_KEY, []);
}

/**
 * Update the stored mistake set from a completed attempt.
 * Wrong answers are added; questions later answered correctly are removed.
 * Skipped (unanswered) questions are left unchanged.
 */
export function updateMistakes(answers: AnswerRecord[]): void {
  const set = new Set(getMistakeIds());
  for (const a of answers) {
    if (a.chosenIndex === null) continue;
    if (a.correct) set.delete(a.questionId);
    else set.add(a.questionId);
  }
  writeJSON(MISTAKES_KEY, Array.from(set));
}

export function clearMistakes(): void {
  writeJSON(MISTAKES_KEY, []);
}

// ---------------------------------------------------------------------------
// Rotation: track which questions have been shown so repeated sessions serve
// fresh items and cycle through the whole bank before repeating.

const SEEN_KEY = 'csc_reviewer_seen_v1';

export function getSeenIds(): string[] {
  return readJSON<string[]>(SEEN_KEY, []);
}

export function setSeenIds(ids: string[]): void {
  writeJSON(SEEN_KEY, ids);
}

export function clearSeen(): void {
  writeJSON(SEEN_KEY, []);
}

// ---------------------------------------------------------------------------
// Profile: a simple display name so each person's results are labeled. Stored
// per browser/device; no account or server involved.

const PROFILE_KEY = 'csc_reviewer_profile_v1';

export function getProfileName(): string {
  return readJSON<string>(PROFILE_KEY, '');
}

export function setProfileName(name: string): void {
  writeJSON(PROFILE_KEY, name.trim());
}

export function clearProfile(): void {
  writeJSON(PROFILE_KEY, '');
}

// ---------------------------------------------------------------------------
// Treasury progression: pass a difficulty tier (>= passing score) to unlock the
// next one. Stored per browser/device, like the rest of the progress.

const TREASURY_KEY = 'csc_reviewer_treasury_progress_v1';

export function getTreasuryPassed(): Difficulty[] {
  return readJSON<Difficulty[]>(TREASURY_KEY, []);
}

export function recordTreasuryPass(d: Difficulty): void {
  const set = new Set(getTreasuryPassed());
  set.add(d);
  writeJSON(TREASURY_KEY, Array.from(set));
}

export function clearTreasuryProgress(): void {
  writeJSON(TREASURY_KEY, []);
}

export function isTreasuryTierUnlocked(d: Difficulty): boolean {
  if (d === 'easy') return true;
  const passed = getTreasuryPassed();
  if (d === 'medium') return passed.includes('easy');
  if (d === 'hard') return passed.includes('medium');
  return passed.includes('hard'); // brutal
}

export function highestUnlockedTreasuryTier(): Difficulty {
  const passed = getTreasuryPassed();
  if (passed.includes('hard')) return 'brutal';
  if (passed.includes('medium')) return 'hard';
  if (passed.includes('easy')) return 'medium';
  return 'easy';
}

export function nextTreasuryTier(d: Difficulty): Difficulty | null {
  if (d === 'easy') return 'medium';
  if (d === 'medium') return 'hard';
  if (d === 'hard') return 'brutal';
  return null;
}
