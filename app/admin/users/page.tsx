import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/admin';
import { UsersManager } from '@/components/admin/users-manager';

export default async function AdminUsersPage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') redirect('/admin');

  return <UsersManager currentUserId={user.id} />;
}