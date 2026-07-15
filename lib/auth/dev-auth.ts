import { isSupabaseConfigured } from '@/lib/supabase/env';
import { TEST_PROFILE, TEST_USER } from '@/lib/mock/data';
import { Profile } from '@/lib/types';

const STORAGE_KEY = 'dev-auth-session';

export const DEV_TEST_EMAIL = TEST_USER.email;
export const DEV_TEST_PASSWORD = 'password123';

export type DevSession = {
  user: { id: string; email: string };
  profile: Profile;
};

export function isDevAuthEnabled() {
  return !isSupabaseConfigured() || process.env.NEXT_PUBLIC_DEV_AUTH === 'true';
}

export function getDevSession(): DevSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DevSession) : null;
  } catch {
    return null;
  }
}

function saveDevSession(session: DevSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function signOutDevAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export function signInAsTestUser(): DevSession {
  const session = {
    user: { id: TEST_USER.id, email: TEST_USER.email },
    profile: TEST_PROFILE,
  };
  saveDevSession(session);
  return session;
}

export function signInWithDevAuth(
  email: string,
  password: string,
):
  | { success: true; session: DevSession }
  | { success: false; error: string } {
  if (email === DEV_TEST_EMAIL && password === DEV_TEST_PASSWORD) {
    return { success: true, session: signInAsTestUser() };
  }

  return {
    success: false,
    error: `For test login use ${DEV_TEST_EMAIL} / ${DEV_TEST_PASSWORD}`,
  };
}
