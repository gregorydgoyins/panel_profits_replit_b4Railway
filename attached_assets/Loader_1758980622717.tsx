import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  label?: string;
}

export function Loader({ size = 'medium', color = 'indigo', label = 'Loading...' }: LoaderProps) {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-10 w-10 border-3',
    large: 'h-16 w-16 border-4'
  };

  const colorClasses = {
    indigo: 'border-indigo-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
    blue: 'border-blue-500'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div 
        className={`animate-spin rounded-full ${sizeClasses[size]} border-t-transparent ${colorClasses[color as keyof typeof colorClasses]}`}
        role="status"
        aria-label="Loading"
      />
      {label && (
        <p className="mt-4 text-gray-400">{label}</p>
      )}
    </div>
  );
}