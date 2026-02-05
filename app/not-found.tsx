import Link from 'next/link';
import { PageHeader } from '@/shared/components/PageHeader';
import { Button } from '@/shared/ui/Button';

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <PageHeader title="404" subtitle="Page not found" />
      <div className="mt-8">
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </div>
  );
}

