import { useState, useEffect } from 'react';
import { Briefcase, Mail, Lock, Loader2, AlertCircle, Info, Copy, Check, UserPlus } from 'lucide-react';
import { getSetupStatus } from '../api/auth';

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState(null); // null until loaded, 'setup' | 'signin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);

  useEffect(() => {
    getSetupStatus()
      .then(({ setup_complete, demo }) => {
        setMode(setup_complete ? 'signin' : 'setup');
        setIsDemo(!!demo);
      })
      .catch(() => {
        setMode('signin');
      })
      .finally(() => setCheckingSetup(false));
  }, []);

  function copyToClipboard(text, field) {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 1500);
  }

  function validate() {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const authMode = mode === 'setup' ? 'signup' : 'signin';
      await onLogin(email, password, authMode);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (checkingSetup) {
    return (
      <div className="bg-dots flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isSetup = mode === 'setup';

  return (
    <div className="bg-dots flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo + Subtitle */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <Briefcase className="h-9 w-9 text-primary" strokeWidth={2} />
            <span className="text-2xl font-bold tracking-tight text-foreground">
              Job Application Tracker
            </span>
          </div>

          {/* Subtitle with highlighter + hand-drawn arrow */}
          <p className="mt-3 text-sm font-medium text-slate-400">
            Track your job applications, from{' '}
            <span className="inline-flex items-center whitespace-nowrap">
              <span className="highlight-blue font-hand text-lg font-semibold text-blue-600">
                applied
              </span>
              <span className="arrow-hand">
                <svg viewBox="0 0 80 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 8c6-2 12-1 18-1s12 1 18 0 12-2 18-1 12 2 17 1"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="4 3"
                  />
                  <path
                    d="M68 3l7 4.5-7 4"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="highlight-green font-hand text-lg font-semibold text-green-600">
                offer
              </span>
            </span>
          </p>

          {/* Self-host CTA — only show in demo mode */}
          {isDemo && (
            <>
              <p className="mt-3 text-xs text-slate-400">
                Like what you see? Self-host it for yourself.
              </p>
              <a
                href="https://github.com/hugopradops/job-tracking-crud"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-default hover:border-slate-300 hover:text-foreground"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                View on GitHub
              </a>
            </>
          )}
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* Setup banner */}
          {isSetup && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3.5">
              <UserPlus className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">Welcome! Create your account</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  This is your first time running JobLog. Set up your personal account below.
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="min-h-[44px] w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-slate-400 transition-default hover:border-slate-300 focus:border-primary focus:ring-0"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  autoComplete={isSetup ? 'new-password' : 'current-password'}
                  className="min-h-[44px] w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-slate-400 transition-default hover:border-slate-300 focus:border-primary focus:ring-0"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-default hover:bg-blue-700 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSetup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Demo account callout — only show in demo mode on sign in */}
          {!isSetup && isDemo && (
            <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3.5">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
                <Info className="h-4 w-4" />
                Want to explore? Use the demo account:
              </div>
              <div className="space-y-2 pl-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  Email:{' '}
                  <button
                    type="button"
                    onClick={() => copyToClipboard('demo@demo.ca', 'email')}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 font-mono text-xs font-semibold text-foreground transition-default hover:border-primary hover:bg-blue-50"
                  >
                    demo@demo.ca
                    {copied === 'email' ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3 text-slate-400" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  Password:{' '}
                  <button
                    type="button"
                    onClick={() => copyToClipboard('password', 'password')}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 font-mono text-xs font-semibold text-foreground transition-default hover:border-primary hover:bg-blue-50"
                  >
                    password
                    {copied === 'password' ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
