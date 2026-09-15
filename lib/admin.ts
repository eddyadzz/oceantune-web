import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role: 'ADMIN' | 'EDITOR';
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
  };
}

/** Returns the authenticated user if they have at least the given role, else null. */
export async function requireAuth(role: 'ADMIN' | 'EDITOR' = 'EDITOR') {
  const user = await getSessionUser();
  if (!user) return null;
  if (role === 'ADMIN' && user.role !== 'ADMIN') return null;
  return user;
}