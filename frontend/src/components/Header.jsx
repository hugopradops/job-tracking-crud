import { Briefcase, LogOut } from 'lucide-react';

export default function Header({ user, onLogout }) {
  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
        <Briefcase className="h-7 w-7 text-primary" strokeWidth={2} />
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Job Application Tracker
        </h1>

        {user && (
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm font-medium text-slate-500 sm:inline">
              {user.email}
            </span>
            <button
              onClick={onLogout}
              title="Log out"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-400 transition-default hover:bg-slate-100 hover:text-red-500"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
