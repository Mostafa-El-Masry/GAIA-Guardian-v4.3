'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const LOCAL_CURRENT_USER_ID_KEY = 'gaia_current_user_id_v1';

type Mode = 'signin' | 'signup';

interface LoginClientProps {
  className?: string;
  initialMode?: Mode;
}

// GAIA Level 3 – Multi-user & Permissions
// Version 4.3 · Auth Fix
//
// LoginClient
// -----------
// Combined Sign-in / Create-account / Guest entry UI.
// - "Create one" switches to signup mode on the same page.
// - "Sign in" switches back.
// - initialMode is controlled by the /login route via searchParams.mode
//   so links like /login?mode=signup open directly on the create form.
//
// Signup uses Supabase email+password signUp (with name in metadata).
// "Continue as guest" creates a GAIA internal user with role "guest"
// via /api/users, with all permissions = false, and marks it as
// the active user in localStorage.

const LoginClient: React.FC<LoginClientProps> = ({
  className = '',
  initialMode = 'signin',
}) => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [mode, setMode] = useState<Mode>(initialMode);

  // If searchParams.mode changes (via the page wrapper), keep in sync.
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const resetMessages = () => {
    setError(null);
    setInfo(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        throw signInError;
      }
      router.refresh();
      router.push('/');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });
      if (signUpError) {
        throw signUpError;
      }

      // Keep GAIA internal users table in sync (best-effort).
      try {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            displayName: name.trim(),
            email: email.trim(),
            role: 'member',
            permissions: {
              canViewGalleryPrivate: true,
              canViewWealth: true,
              canViewHealth: true,
              canViewGuardian: true,
            },
          }),
        });
      } catch {
        // ignore
      }

      if (data?.user?.id) {
        setInfo(
          'Account created. If email confirmation is required, please check your inbox for a verification email.'
        );
      } else {
        setInfo(
          'Sign-up request sent. If email confirmation is enabled, you should receive an email shortly.'
        );
      }
      // After creating account, go back to sign-in mode.
      setMode('signin');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsGuest = async () => {
    resetMessages();
    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: 'Guest',
          email: null,
          role: 'guest',
          permissions: {
            canViewGalleryPrivate: false,
            canViewWealth: false,
            canViewHealth: false,
            canViewGuardian: false,
          },
        }),
      });

      const data = (await res.json().catch(() => ({}))) as any;
      if (!data.ok || !data.user) {
        throw new Error(data.error || 'Failed to create guest user.');
      }

      const guestId = String(data.user.id);
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(LOCAL_CURRENT_USER_ID_KEY, guestId);
        }
      } catch {
        // ignore
      }

      router.push('/');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to continue as guest.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`min-h-screen flex items-center justify-center px-4 py-8 ${className}`}>
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-black/60 p-6 text-[11px] text-zinc-200 shadow-xl">
        {/* Header */}
        <header className="mb-4 space-y-1 text-center">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-50">
            Welcome to GAIA
          </h1>
          <p className="text-[12px] text-zinc-400">
            {mode === 'signin'
              ? 'Sign in to continue your journey.'
              : 'Create a new GAIA account.'}
          </p>
        </header>

        {error && (
          <p className="mb-2 rounded-md border border-red-500/40 bg-red-950/40 px-2 py-1 text-[11px] text-red-200">
            {error}
          </p>
        )}
        {info && (
          <p className="mb-2 rounded-md border border-emerald-500/40 bg-emerald-950/40 px-2 py-1 text-[11px] text-emerald-200">
            {info}
          </p>
        )}

        {/* FORM */}
        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-3">
            <div className="space-y-1">
              <label className="block text-[10px] text-zinc-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-black/70 px-2 py-1.5 text-[11px] text-zinc-100 outline-none focus:border-emerald-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-zinc-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-black/70 px-2 py-1.5 text-[11px] text-zinc-100 outline-none focus:border-emerald-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-md border border-emerald-600 bg-emerald-600 px-3 py-1.5 text-[11px] font-medium text-emerald-50 hover:bg-emerald-500 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div className="space-y-1">
              <label className="block text-[10px] text-zinc-400">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-black/70 px-2 py-1.5 text-[11px] text-zinc-100 outline-none focus:border-emerald-500"
                placeholder="Your name"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-zinc-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-black/70 px-2 py-1.5 text-[11px] text-zinc-100 outline-none focus:border-emerald-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-zinc-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-black/70 px-2 py-1.5 text-[11px] text-zinc-100 outline-none focus:border-emerald-500"
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-zinc-400">
                Confirm password
              </label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-black/70 px-2 py-1.5 text-[11px] text-zinc-100 outline-none focus:border-emerald-500"
                placeholder="Repeat your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-md border border-emerald-600 bg-emerald-600 px-3 py-1.5 text-[11px] font-medium text-emerald-50 hover:bg-emerald-500 disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        )}

        {/* Footer: mode switch + guest */}
        <div className="mt-4 space-y-2 text-center text-[11px] text-zinc-400">
          {mode === 'signin' ? (
            <p>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  resetMessages();
                  setMode('signup');
                }}
                className="text-emerald-300 hover:text-emerald-200"
              >
                Create one
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  resetMessages();
                  setMode('signin');
                }}
                className="text-emerald-300 hover:text-emerald-200"
              >
                Sign in
              </button>
            </p>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={handleContinueAsGuest}
              disabled={loading}
              className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-1.5 text-[11px] text-zinc-200 hover:bg-zinc-800 disabled:opacity-60"
            >
              Continue as guest
            </button>
            <p className="mt-1 text-[10px] text-zinc-500">
              Guests can view the intro page only. Other sections will stay locked
              according to permissions.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginClient;
