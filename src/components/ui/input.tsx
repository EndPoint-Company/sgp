import React from 'react';

// 1. Defina que o componente pode receber um 'icon'
export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  // 2. Receba a prop 'icon'
  ({ className = '', icon, ...props }, ref) => {
    return (
      // 3. Crie um container para o ícone e o input
      <div className="relative flex items-center w-full">
        {icon && (
          // 4. Posicione o ícone à esquerda
          <span className="absolute left-3 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          // 5. Adicione padding à esquerda no input se houver um ícone
          className={`w-full border border-gray-300 rounded-md py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${icon ? 'pl-10 pr-3' : 'px-3'} ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';