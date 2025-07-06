// src/features/psychologist/home/HomePage.tsx
import React from 'react';
import AppointmentCard from '../components/AppintmentCard';
import RequestCard from '../components/RequestCard';


export default function HomePage() {
  // Atualize a tipagem e os dados para incluir a 'avatarUrl'
  const mockAppointments: {
    name: string;
    date: string;
    time: string;
    status: 'Confirmado' | 'Pendente';
    avatarUrl: string; // <-- Propriedade adicionada na tipagem
  }[] = [
    {
      name: 'Marcos Vitor',
      date: 'Terça, 10 Maio 2025',
      time: '08:30 às 10:00',
      status: 'Confirmado',
      avatarUrl: 'https://i.pravatar.cc/40?u=marcos', // <-- Propriedade adicionada
    },
    {
      name: 'Juliana Martins',
      date: 'Quarta, 11 Maio 2025',
      time: '14:00 às 15:30',
      status: 'Confirmado',
      avatarUrl: 'https://i.pravatar.cc/40?u=juliana', // <-- Propriedade adicionada
    },
    {
      name: 'Juliana Martins',
      date: 'Quarta, 11 Maio 2025',
      time: '14:00 às 15:30',
      status: 'Confirmado',
      avatarUrl: 'https://i.pravatar.cc/40?u=juliana', // <-- Propriedade adicionada
    },
    {
      name: 'Juliana Martins',
      date: 'Quarta, 11 Maio 2025',
      time: '14:00 às 15:30',
      status: 'Confirmado',
      avatarUrl: 'https://i.pravatar.cc/40?u=juliana', // <-- Propriedade adicionada
    },
    {
      name: 'Juliana Martins',
      date: 'Quarta, 11 Maio 2025',
      time: '14:00 às 15:30',
      status: 'Confirmado',
      avatarUrl: 'https://i.pravatar.cc/40?u=juliana', // <-- Propriedade adicionada
    },

  ];

  const mockRequests = [
    { name: 'Carlos Andrade', date: 'Sexta, 13 Maio 2025', time: '09:00 às 10:00', avatarUrl: 'https://i.pravatar.cc/40?u=carlos' },
  ];


  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Próximos Atendimentos</h1>
      <div className="flex gap-4 flex-wrap mb-10">
        {/* Nenhuma mudança necessária aqui, pois o {...appt} já passa a nova prop */}
        {mockAppointments.map((appt, index) => (
          <AppointmentCard key={index} {...appt} />
        ))}
      </div>

      <h1 className="text-xl font-bold mb-4">Solicitações</h1>
      <div className="flex gap-4 flex-wrap">
        {mockRequests.map((req, index) => (
          <RequestCard
            key={index}
            {...req}
            onAccept={() => alert('Aceito')}
            onReject={() => alert('Recusado')}
          />
        ))}
      </div>
    </div>
  );
}