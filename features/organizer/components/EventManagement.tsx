'use client';

import { Exhibition, Registration, Sponsor } from '@/lib/types';
import { Badge } from '@/shared/ui/Badge';
import { Divider } from '@/shared/ui/Divider';
import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

interface EventManagementProps {
  exhibition: Exhibition;
  registrations: Registration[];
  sponsors: Sponsor[];
}

export function EventManagement({ exhibition, registrations, sponsors }: EventManagementProps) {
  const [newSponsorName, setNewSponsorName] = useState('');
  const [capacity, setCapacity] = useState(exhibition.capacity?.toString() || '');

  const confirmedCount = registrations.length;

  const handleAddSponsor = () => {
    // Mock - in real app, this would call an API
    alert('Sponsor functionality not implemented in mock');
  };

  const handleUpdateCapacity = () => {
    // Mock - in real app, this would call an API
    alert('Capacity update not implemented in mock');
  };

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-xl font-semibold mb-6">Capacity</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1 max-w-xs">
            <Input
              label="Capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>
          <Button onClick={handleUpdateCapacity}>Update</Button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6">Registrations</h2>
        <div className="mb-4">
          <p className="text-sm text-[var(--color-muted-gray)]">
            Registered: {confirmedCount} / {exhibition.capacity || 'Unlimited'}
          </p>
        </div>
        <div className="space-y-2">
          {registrations.map(registration => (
            <div
              key={registration.id}
              className="p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{registration.userName}</p>
                <p className="text-sm text-[var(--color-muted-gray)]">
                  Registered: {new Date(registration.registeredAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="success">Registered</Badge>
                <Button variant="text" className="text-xs">
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section>
        <h2 className="text-xl font-semibold mb-6">Sponsors</h2>
        <div className="mb-4 space-y-2">
          {sponsors.map(sponsor => (
            <div
              key={sponsor.id}
              className="p-4 flex items-center justify-between"
            >
              <span className="text-sm">{sponsor.name}</span>
              <Button variant="text" className="text-xs">
                Remove
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <div className="flex-1 max-w-xs">
            <Input
              label="Sponsor Name"
              value={newSponsorName}
              onChange={(e) => setNewSponsorName(e.target.value)}
              placeholder="Enter sponsor name"
            />
          </div>
          <Button onClick={handleAddSponsor}>Add Sponsor</Button>
        </div>
      </section>
    </div>
  );
}

