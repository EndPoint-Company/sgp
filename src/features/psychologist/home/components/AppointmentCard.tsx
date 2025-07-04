// src/features/psychologist/home/components/AppointmentCard.tsx
import React from 'react';

type AppointmentCardProps = {
  name: string;
  date: string;
  time: string;
  status: 'Confirmado' | 'Pendente';
};

export default function AppointmentCard({ name, date, time, status }: AppointmentCardProps) {
  const statusColor = status === 'Confirmado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';
  return (
    <div className="bg-white border rounded p-4 shadow-sm w-60">
      <div className="text-xs text-gray-500">{time}</div>
      <div className="text-sm font-bold mt-1">{date}</div>
      <div className="text-sm text-gray-700 mt-1">{name}</div>
      <div className={`text-xs px-2 py-1 mt-2 inline-block rounded ${statusColor}`}>{status}</div>
      <div className="mt-3 flex justify-between text-sm text-blue-600">
        <button>Ver mais</button>
        {status === 'Confirmado' && <button className="text-red-600">Cancelar</button>}
      </div>
    </div>
  );
}

