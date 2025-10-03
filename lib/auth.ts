import { cookies } from 'next/headers';
import { supabase } from './supabase';
import * as crypto from 'crypto';

export async function hashPassword(password: string): Promise<string> {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash === hashedPassword;
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session) {
    return null;
  }

  try {
    const sessionData = JSON.parse(session.value);

    const { data: admin } = await supabase
      .from('admins')
      .select('id, email, name, role')
      .eq('id', sessionData.adminId)
      .maybeSingle();

    return admin;
  } catch {
    return null;
  }
}

export async function setSession(adminId: string) {
  const cookieStore = await cookies();
  const sessionData = JSON.stringify({ adminId, timestamp: Date.now() });

  cookieStore.set('admin_session', sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}
