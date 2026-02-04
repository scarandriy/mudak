import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  metadata?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, metadata, actions }: PageHeaderProps) {
  return (
    <div className="mb-12">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="mb-2">{title}</h1>
          {subtitle && (
            <p className="text-lg text-[var(--color-muted-gray)]">{subtitle}</p>
          )}
          {metadata && (
            <div className="mt-4 text-sm text-[var(--color-muted-gray)]">
              {metadata}
            </div>
          )}
        </div>
        {actions && <div className="flex gap-4">{actions}</div>}
      </div>
    </div>
  );
}

