import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ElementType;
};

export function Input({ icon: Icon, ...props }: InputProps) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        {...props}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
      />
    </div>
  );
}