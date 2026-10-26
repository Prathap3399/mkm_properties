import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/session';

export const instant = false;

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Admin portal directly focuses on projects view and documents management
  redirect('/admin/projects');
}
