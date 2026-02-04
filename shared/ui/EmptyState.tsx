import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-[var(--color-muted-gray)] mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

