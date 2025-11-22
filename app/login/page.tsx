import LoginClient from './LoginClient';

interface LoginPageProps {
  searchParams?: {
    mode?: string;
    [key: string]: string | string[] | undefined;
  };
}

// GAIA Level 3 – Multi-user & Permissions
// Version 4.3 · Auth Fix
//
// /login page wrapper
// -------------------
// Reads ?mode=signup or ?mode=signin from the URL and passes it down
// to LoginClient as initialMode. This fixes cases where you navigate
// from other parts of GAIA using links like:
//   - /login?mode=signup   → open directly on "Create account"
//   - /login?mode=signin   → open directly on "Sign in"

export default function LoginPage({ searchParams }: LoginPageProps) {
  const modeParam = typeof searchParams?.mode === 'string' ? searchParams!.mode : undefined;
  const initialMode = modeParam === 'signup' ? 'signup' : 'signin';

  return <LoginClient initialMode={initialMode} />;
}
