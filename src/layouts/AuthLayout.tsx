import React from 'react';

type AuthLayoutProps = {
  children: React.ReactNode; 
  imageUrl: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right'; 
};

export function AuthLayout({
  children,
  imageUrl,
  imageAlt,
  imagePosition = 'left', 
}: AuthLayoutProps) {
  
  const ImageColumn = () => (
    <div className="hidden lg:flex flex-col justify-center w-3/5 p-4">
      <h1 className="text-2xl font-bold text-gray-800 px-8">
        Tecnologia a serviço do{" "}
        <span className="text-blue-600">cuidado</span>, da{" "}
        <span className="text-blue-600">organização</span> e do{" "}
        <span className="text-blue-600">bem-estar</span> universitário.
      </h1>
      <img
        src={imageUrl}
        alt={imageAlt}
        className="mt-5 w-full h-auto"
      />
    </div>
  );

  const FormColumn = () => (
    <div className="w-full lg:w-2/5 p-12 flex flex-col justify-center">
      {children}
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex w-full max-w-6xl overflow-hidden gap-x-20">
        {imagePosition === 'left' ? (
          <>
            <ImageColumn />
            <FormColumn />
          </>
        ) : (
          <>
            <FormColumn />
            <ImageColumn />
          </>
        )}
      </div>
    </div>
  );
}