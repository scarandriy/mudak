import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { PageHeader } from '@/shared/components/PageHeader';

export default async function AdminPage() {
  try {
    await requireRole('admin');
  } catch {
    redirect('/login');
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <PageHeader title="Admin Dashboard" subtitle="System administration" />

      <div className="space-y-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">System Information</h3>
          <div className="space-y-2 text-sm">
            <p>Platform: Cultural Art & Exhibition Platform</p>
            <p>Version: 1.0.0</p>
            <p>Environment: Development</p>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Activity Logs</h3>
          <p className="text-sm text-[var(--color-muted-gray)]">No recent activity</p>
        </div>
      </div>
    </div>
  );
}

