import React from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}
export function Button({
  variant = 'default',
  size = 'default',
  children,
  className,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50';
  const variantStyles = {
    default: 'bg-[#1a1230] hover:bg-[#241a38] text-white',
    primary: 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-md hover:shadow-lg shadow-purple-500/20',
    ghost: 'bg-transparent hover:bg-purple-500/10 text-gray-300 hover:text-white'
  };
  const sizeStyles = {
    default: 'h-10 px-4 py-2 rounded-lg text-sm',
    sm: 'h-8 px-3 py-1 rounded-md text-xs',
    lg: 'h-12 px-6 py-3 rounded-lg text-base',
    icon: 'h-10 w-10 rounded-full'
  };
  return <button className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `} {...props}>
      {children}
    </button>;
}