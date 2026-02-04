'use client';

import { useState } from 'react';
import { User } from '@/lib/types';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { Button } from '@/shared/ui/Button';

interface ArtistProfileFormProps {
  user: User;
}

export function ArtistProfileForm({ user }: ArtistProfileFormProps) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [contact, setContact] = useState(user.contact || '');
  const [website, setWebsite] = useState(user.socialLinks?.website || '');
  const [instagram, setInstagram] = useState(user.socialLinks?.instagram || '');
  const [twitter, setTwitter] = useState(user.socialLinks?.twitter || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          bio,
          contact,
          socialLinks: {
            website: website || undefined,
            instagram: instagram || undefined,
            twitter: twitter || undefined,
          },
        }),
      });

      const result = await response.json();
      
      if (result.success && result.user) {
        setSuccess(true);
        // Refresh the page to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (_err) {
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 border border-red-600 bg-red-50">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 border border-black bg-[var(--color-light-gray)]">
          <p className="text-sm">Profile updated successfully.</p>
        </div>
      )}

      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Textarea
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={6}
      />

      <Input
        label="Contact"
        type="email"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Social Links</h3>
        <Input
          label="Website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://"
        />
        <Input
          label="Instagram"
          type="text"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          placeholder="@username"
        />
        <Input
          label="Twitter"
          type="text"
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          placeholder="@username"
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}

