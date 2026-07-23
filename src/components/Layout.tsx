import { Link, NavLink, Outlet } from 'react-router-dom';
import { clearProfile, getProfileName } from '../lib/storage';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/practice', label: 'Practice', end: false },
  { to: '/mock', label: 'Mock Exam', end: false },
  { to: '/review', label: 'Review Mistakes', end: false },
  { to: '/history', label: 'History', end: false },
  { to: '/treasury', label: 'Treasury', end: false },
];

function linkClass(isActive: boolean): string {
  return [
    'whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition',
    isActive
      ? 'bg-blue-600 text-white'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ');
}

export default function Layout() {
  const name = getProfileName();

  function switchUser() {
    if (
      window.confirm(
        'Switch to a different name? Your saved scores stay on this device.',
      )
    ) {
      clearProfile();
      window.location.reload();
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.svg" alt="" className="h-8 w-8" />
            <span className="text-lg font-bold text-slate-900">CSC Reviewer</span>
          </Link>
          {name && (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-slate-600 sm:inline">
                Hi, <span className="font-semibold text-slate-900">{name}</span>
              </span>
              <button
                type="button"
                onClick={switchUser}
                className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Switch
              </button>
            </div>
          )}
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => linkClass(isActive)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        For review practice only. Always confirm the exam coverage with official CSC announcements.
      </footer>
    </div>
  );
}
