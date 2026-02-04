import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
  children: ReactNode;
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const baseStyles = 'px-6 py-3 text-sm font-medium transition-colors';
  
  const variants = {
    primary: 'bg-black text-white hover:bg-[#333]',
    secondary: 'bg-transparent border border-black text-black hover:bg-black hover:text-white',
    text: 'bg-transparent text-black hover:underline',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

