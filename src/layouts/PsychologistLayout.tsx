// src/layouts/PsychologistLayout.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function PsychologistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-white border-r px-4 py-6">
        <div className="mb-6 text-center">
          <img src="/avatar.png" alt="Avatar" className="w-16 h-16 rounded-full mx-auto" />
          <h2 className="text-lg font-semibold mt-2">Ester Ravette</h2>
          <span className="text-sm text-gray-500">Psicóloga</span>
        </div>
        <nav className="space-y-4">
          <Link to="/psychologist/home" className="block text-blue-600 font-medium">Início</Link>
          <Link to="/psychologist/appointments" className="block">Atendimentos</Link>
          <Link to="/psychologist/schedule" className="block">Agenda</Link>
          <Link to="/psychologist/settings" className="block">Ajustes</Link>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}