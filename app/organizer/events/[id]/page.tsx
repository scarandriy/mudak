import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { getExhibitionById, getRegistrationsByExhibition, getSponsorsByExhibition } from '@/lib/data/api';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/shared/components/PageHeader';
import { EventManagement } from '@/features/organizer/components/EventManagement';

export default async function EventManagementPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole('organizer');
  } catch {
    redirect('/login');
  }

  const { id } = await params;
  const [exhibition, registrations, sponsors] = await Promise.all([
    getExhibitionById(id),
    getRegistrationsByExhibition(id),
    getSponsorsByExhibition(id),
  ]);

  if (!exhibition) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <PageHeader title={exhibition.title} subtitle="Event Management" />

      <EventManagement
        exhibition={exhibition}
        registrations={registrations}
        sponsors={sponsors}
      />
    </div>
  );
}

