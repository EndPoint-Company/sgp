// src/features/psychologist/home/components/AppointmentCard.tsx
import React from 'react';

type AppointmentCardProps = {
  name: string;
  date: string;
  time: string;
  status: 'Confirmado' | 'Pendente';
  avatarUrl: string; // Adicionei uma prop para a URL do avatar
};

export default function AppointmentCard({ name, date, time, status, avatarUrl }: AppointmentCardProps) {
  // Ajustei as cores para ficarem mais suaves, como na imagem
  const statusColor = status === 'Confirmado' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-yellow-100 text-yellow-800';

  return (
    // Container principal com bordas mais arredondadas e espaçamento ajustado
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm w-full max-w-xs">

      {/* Seção Superior: Horário e Status */}
      <div className="flex justify-between items-center">
        <span className="text-base text-gray-600">{time}</span>
        <span className={`text-sm font-semibold px-3 py-1 rounded-md ${statusColor}`}>
          {status}
        </span>
      </div>

      {/* Data: Texto grande e em negrito */}
      <div className="mt-3">
        <h3 className="text-2xl font-bold text-gray-900">{date}</h3>
      </div>

      {/* Informações do Paciente: Avatar e Nome */}
      <div className="flex items-center gap-3 mt-4">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={avatarUrl}
          alt={`Foto de ${name}`}
        />
        <span className="text-lg text-gray-700">{name}</span>
      </div>
      
      <hr className="my-4 border-gray-300" />

      {/* Botões de Ação */}
      <div className="mt-6 flex justify-between items-center">
        <button className="text-blue-600 font-semibold text-base hover:underline">
          Ver mais
        </button>
        {status === 'Confirmado' && (
          // Botão de cancelar com estilo de borda, fundo e sombra
          <button className="bg-white border border-gray-300 rounded-lg px-6 py-2 shadow-sm text-gray-800 font-semibold text-base hover:bg-gray-50">
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}