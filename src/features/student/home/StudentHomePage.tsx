import React, { useState, useMemo } from 'react';
import AppointmentCard from '../../components/AppintmentCard'; 
import { Button } from '../../../components/ui/button';
import { Plus } from 'lucide-react';
import { mockFirebaseData, getPsicologoData, formatAppointmentDate } from '../../psychologist/data/mockApi';
import type { Consulta } from '../../psychologist/services/apiService';
import { Modal } from '../../../components/ui/Modal'; // <-- Importe o Modal
import { AppointmentRequestFlow } from './components/AppointmentRequestFlow'; // <-- Importe o Fluxo

const ID_ALUNO_LOGADO = "mu3Mo6I0eSSD3aWZdYte";

export default function StudentHomePage() {
  const [consultas, setConsultas] = useState<Consulta[]>(mockFirebaseData);
  const [isModalOpen, setIsModalOpen] = useState(false); // <-- Estado para controlar o modal

  const handleCancelAppointment = (consultaId: string) => {
    setConsultas(prevConsultas =>
      prevConsultas.map(c =>
        c.id === consultaId ? { ...c, status: 'cancelada' } : c
      )
    );
    alert('Seu atendimento foi cancelado.');
  };

  const { upcomingAppointments, pendingRequests } = useMemo(() => {
    const studentConsultas = consultas.filter(c => c.pacienteId === ID_ALUNO_LOGADO);
    const processed = studentConsultas.map(item => ({
      ...item,
      ...getPsicologoData(item.psicologoId),
      ...formatAppointmentDate(item.horario),
    }));
    return {
      upcomingAppointments: processed.filter(item => item.status === 'confirmada'),
      pendingRequests: processed.filter(item => item.status === 'aguardando aprovacao'),
    };
  }, [consultas]);

  return (
    <>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Nova Solicitação de Atendimento"
      >
        <AppointmentRequestFlow onClose={() => setIsModalOpen(false)} />
      </Modal>

      <div>
        <h1 className="text-xl font-bold mb-4">Próximos Atendimentos</h1>
        <div className="flex gap-4 flex-wrap mb-10">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                name={appt.name}
                date={appt.date}
                time={appt.time}
                status="Confirmada"
                avatarUrl={appt.avatarUrl}
                onCancel={() => handleCancelAppointment(appt.id)}
              />
            ))
          ) : (
            <p className="text-gray-500">Nenhum atendimento agendado.</p>
          )}
        </div>

        <h1 className="text-xl font-bold mb-4">Solicitações</h1>
        <div className="flex flex-col items-center justify-center text-center bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 mt-4">
          {pendingRequests.length > 0 ? (
            <p>Você tem {pendingRequests.length} solicitações pendentes.</p>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-800">Nenhuma solicitação</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">Você não possui solicitações de agendamento pendentes.</p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar solicitação
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}