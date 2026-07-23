import { useState, type FormEvent } from 'react';

const STATS: Array<[string, string]> = [
  ['200+', 'Questions'],
  ['5', 'Topics'],
  ['80%', 'To pass'],
];

export default function NameGate({
  onSubmit,
}: {
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState('');
  const trimmed = name.trim();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (trimmed.length < 2) return;
    onSubmit(trimmed);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 p-4">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-yellow-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-rose-500/30 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 top-8 h-40 w-40 rounded-full bg-sky-400/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <img src="/favicon.svg" alt="" className="h-10 w-10 drop-shadow" />
          <span className="text-lg font-bold text-white">CSC Reviewer</span>
        </div>

        {/* Hype heading */}
        <div className="text-center">
          <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white ring-1 ring-white/25">
            Civil Service Exam Reviewer
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Let&rsquo;s get you <span className="text-yellow-300">PASADO</span>.
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-blue-100">
            Practice smart, build your confidence, and walk into exam day ready to
            ace it. Your government career starts here.
          </p>
        </div>

        {/* Stat chips */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {STATS.map(([big, small]) => (
            <div
              key={small}
              className="rounded-xl bg-white/10 px-4 py-2 text-center ring-1 ring-white/20"
            >
              <div className="text-lg font-extrabold text-white">{big}</div>
              <div className="text-[10px] font-medium uppercase tracking-wide text-blue-100">
                {small}
              </div>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-2xl">
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-semibold text-slate-900"
            >
              What should we call you?
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              maxLength={40}
              placeholder="e.g., Juan Dela Cruz"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={trimmed.length < 2}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:from-blue-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Start reviewing
              <span aria-hidden="true">&rarr;</span>
            </button>
          </form>
          <p className="mt-3 text-center text-xs text-slate-400">
            Your progress is saved on this device. No sign-up needed.
          </p>
        </div>

        <p className="mt-5 text-center text-sm font-semibold text-blue-100">
          Kaya mo &rsquo;to! One step closer to your eligibility.
        </p>
      </div>
    </div>
  );
}
