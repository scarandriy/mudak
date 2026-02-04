import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--color-light-gray)] text-black',
    success: 'bg-black text-white',
    warning: 'bg-[var(--color-muted-gray)] text-white',
    error: 'bg-red-600 text-white',
  };

  return (
    <span className={`inline-block px-3 py-1 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

