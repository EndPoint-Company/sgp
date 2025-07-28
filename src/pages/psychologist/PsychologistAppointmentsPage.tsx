import React, { useState, useEffect, useMemo } from 'react';

// 1. Hooks e Serviços (usando o alias @/)
import { useAuth } from '../../features/auth/hooks/useAuth';
import { getConsultasByPsicologoId, updateConsultaStatus } from '../../features/appointments/services/appointmentService';

// 2. Layouts e Componentes de Feature
import PsychologistLayout from '../../layouts/PsychologistLayout';
import AppointmentsManager from '../../features/appointments/components/AppointmentsManager';

// 3. Tipos e Funções Auxiliares
import type { Consulta, ProcessedConsulta } from '../../features/appointments/types';
import { getPacienteData, formatAppointmentDate } from '../../utils/dataHelpers';

export default function PsychologistAppointmentsPage() {
  // --- LÓGICA E ESTADO ---
  const { user, isLoading: isAuthLoading } = useAuth();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Efeito para buscar os dados das consultas
  useEffect(() => {
    if (!isAuthLoading && user?.uid) {
      setIsDataLoading(true);
      getConsultasByPsicologoId(user.uid)
        .then(setConsultas)
        .catch(() => setError('Não foi possível carregar os agendamentos.')) // <-- LÓGICA DE ERRO
        .finally(() => setIsDataLoading(false));
    } else if (!isAuthLoading && !user) {
      setIsDataLoading(false);
    }
  }, [user, isAuthLoading]);

  // Função para aceitar ou rejeitar uma solicitação
  const handleUpdateStatus = async (consultaId: string, newStatus: 'confirmada' | 'cancelada') => {
    if (user?.uid) {
      await updateConsultaStatus(consultaId, newStatus);
      await getConsultasByPsicologoId(user.uid).then(setConsultas);
    }
  };

  // Processa e separa os dados
  const processedConsultas = useMemo((): ProcessedConsulta[] => {
    // Adicionamos uma verificação para garantir que 'consultas' é um array
    if (!Array.isArray(consultas)) return [];
    
    return consultas.map(item => {
      const paciente = getPacienteData(item.alunoId);
      const schedule = formatAppointmentDate(item.horario);
      return {
        ...item,
        participantName: paciente.name,
        participantAvatarUrl: paciente.avatarUrl,
        ...schedule,
      };
    });
  }, [consultas]);

  // --- RENDERIZAÇÃO ---
  // A lógica de carregamento e erro é crucial aqui para evitar a tela branca
  if (isAuthLoading) {
    return (
      <PsychologistLayout>
        <p>Carregando autenticação...</p>
      </PsychologistLayout>
    );
  }

  return (
    <PsychologistLayout>
      <AppointmentsManager
        consultas={processedConsultas}
        userRole="psychologist"
        isLoading={isDataLoading} // Passa o estado de carregamento dos dados
        error={error}             // Passa a mensagem de erro
        onUpdateStatus={handleUpdateStatus}
      />
    </PsychologistLayout>
  );
}