import 'server-only';
import { cookies } from 'next/headers';
import { User, UserRole } from '@/lib/types';
import { getUserById } from '@/lib/data/api';

export async function getServerUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;
    
    if (!userId) {
      return null;
    }
    
    return await getUserById(userId);
  } catch (error) {
    console.error('Error getting server user:', error);
    return null;
  }
}

export async function requireRole(role: UserRole): Promise<User> {
  const user = await getServerUser();
  if (!user || user.role !== role) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireAnyRole(roles: UserRole[]): Promise<User> {
  const user = await getServerUser();
  if (!user || !roles.includes(user.role)) {
    throw new Error('Unauthorized');
  }
  return user;
}

