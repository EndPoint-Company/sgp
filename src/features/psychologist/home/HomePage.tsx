// src/features/psychologist/home/HomePage.tsx
import React from 'react';
import AppointmentCard from './components/AppointmentCard';
import RequestCard from './components/RequestCard';


export default function HomePage() {
  const mockAppointments: { name: string; date: string; time: string; status: "Confirmado" | "Pendente" }[] = [
    { name: 'Marcos Vitor', date: 'Terça, 10 Maio 2025', time: '08:30 às 10:00', status: 'Confirmado' },
    { name: 'Marcos Vitor', date: 'Terça, 10 Maio 2025', time: '08:30 às 10:00', status: 'Confirmado' },
    { name: 'Marcos Vitor', date: 'Terça, 10 Maio 2025', time: '08:30 às 10:00', status: 'Confirmado' },
    { name: 'Marcos Vitor', date: 'Terça, 10 Maio 2025', time: '08:30 às 10:00', status: 'Confirmado' },
    { name: 'Marcos Vitor', date: 'Terça, 10 Maio 2025', time: '08:30 às 10:00', status: 'Confirmado' },

    { name: 'Marcos Vitor', date: 'Terça, 10 Maio 2025', time: '08:30 às 10:00', status: 'Confirmado' },
    { name: 'Marcos Vitor', date: 'Terça, 10 Maio 2025', time: '08:30 às 10:00', status: 'Confirmado' },
    { name: 'Marcos Vitor', date: 'Terça, 10 Maio 2025', time: '08:30 às 10:00', status: 'Confirmado' },

    { name: 'Marcos Vitor', date: 'Terça, 10 Maio 2025', time: '08:30 às 10:00', status: 'Confirmado' },
    { name: 'Marcos Vitor', date: 'Terça, 10 Maio 2025', time: '08:30 às 10:00', status: 'Confirmado' },
    
  ];

  const mockRequests = [
    { name: 'Marcos Vitor', date: 'Terça, 10 Maio 2025', time: '08:30 às 10:00' },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Próximos Atendimentos</h1>
      <div className="flex gap-4 flex-wrap mb-10">
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