import { getExhibitions } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';

function getDaysDifference(start: Date, end: Date): number {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

export default async function CalendarPage() {
  const exhibitions = await getExhibitions(true);

  // Sort exhibitions by start date
  const sortedExhibitions = [...exhibitions].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const exhibitionsByMonth = sortedExhibitions.reduce((acc, exhibition) => {
    const month = new Date(exhibition.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(exhibition);
    return acc;
  }, {} as Record<string, typeof exhibitions>);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <PageHeader title="Calendar" subtitle="Exhibition schedule" />

      <div className="space-y-24">
        {Object.entries(exhibitionsByMonth).map(([month, monthExhibitions]) => {
          const [monthName, year] = month.split(' ');
          return (
          <div key={month}>
            <div className="flex items-baseline justify-between mb-12">
              <h2 className="text-3xl font-bold">{monthName}</h2>
              <div className="text-3xl font-bold">{year}</div>
            </div>
            <div className="space-y-16">
              {monthExhibitions.map(exhibition => {
                const startDate = new Date(exhibition.startDate);
                const endDate = new Date(exhibition.endDate);
                const duration = getDaysDifference(startDate, endDate);
                const isOngoing = startDate <= new Date() && endDate >= new Date();

                return (
                  <a
                    key={exhibition.id}
                    href={`/exhibitions/${exhibition.id}`}
                    className="block group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-6">
                        <div className="flex-shrink-0 w-24">
                          <div className="text-sm font-semibold uppercase tracking-wide">
                            {startDate.toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                          <div className="text-4xl font-bold mt-1">
                            {startDate.getDate()}
                          </div>
                          {duration > 1 && (
                            <div className="text-xs text-[var(--color-muted-gray)] mt-2">
                              {duration} {duration === 1 ? 'day' : 'days'}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-2xl font-semibold mb-3 group-hover:underline">
                            {exhibition.title}
                          </h3>
                          <div className="space-y-1">
                            <div className="text-sm text-[var(--color-muted-gray)]">
                              {startDate.toLocaleDateString('en-US', { 
                                weekday: 'long',
                                month: 'long', 
                                day: 'numeric',
                                year: startDate.getFullYear() !== endDate.getFullYear() ? 'numeric' : undefined
                              })}
                              {duration > 1 && (
                                <> – {endDate.toLocaleDateString('en-US', { 
                                  weekday: duration <= 7 ? 'long' : undefined,
                                  month: 'long', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}</>
                              )}
                            </div>
                            <div className="text-sm text-[var(--color-muted-gray)]">
                              {exhibition.location}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
          );
        })}
      </div>

      {exhibitions.length === 0 && (
        <div className="py-24">
          <p className="text-[var(--color-muted-gray)]">No exhibitions scheduled.</p>
        </div>
      )}
    </div>
  );
}

