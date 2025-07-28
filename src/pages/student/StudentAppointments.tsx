import React, { useState, useEffect, useMemo } from 'react';

// 1. Hooks, serviços e provedores de contexto
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useUserData } from '../../features/auth/contexts/UserDataProvider';
import { getConsultasByAlunoId, updateConsultaStatus } from '../../features/appointments/services/appointmentService';

// 2. Layouts e Componentes de UI
import StudentLayout from '../../layouts/StudentLayout';
import AppointmentsManager from '../../features/appointments/components/AppointmentsManager';

// 3. Tipos e Funções Auxiliares
import type { Consulta, ProcessedConsulta } from '../../features/appointments/types';
import { formatAppointmentDate } from '../../utils/dataHelpers';

export default function StudentAppointmentsPage() {
  // --- LÓGICA E ESTADO ---
  const { user, isLoading: isAuthLoading } = useAuth();
  const { findPsicologoById, isLoading: isUserDataLoading } = useUserData();
  
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Efeito para buscar os dados das consultas do aluno
  useEffect(() => {
    if (!isAuthLoading && user?.uid) {
      setIsDataLoading(true);
      getConsultasByAlunoId(user.uid)
        .then(setConsultas)
        .catch(() => setError('Não foi possível carregar os seus agendamentos.'))
        .finally(() => setIsDataLoading(false));
    }
  }, [user, isAuthLoading]);

  // Função para o aluno cancelar uma consulta
  // ALTERADO: A assinatura da função agora corresponde à prop esperada pelo AppointmentsManager
  const handleUpdateStatus = async (consultaId: string, newStatus: 'confirmada' | 'cancelada') => {
    // Adiciona uma verificação para garantir que o aluno só pode cancelar
    if (newStatus !== 'cancelada' || !user?.uid) {
      return;
    }

    try {
      await updateConsultaStatus(consultaId, newStatus);
      // Atualiza o estado local para uma resposta de UI instantânea
      setConsultas(prev => prev.map(c => c.id === consultaId ? { ...c, status: newStatus } : c));
    } catch (err) {
      console.error("Erro ao cancelar consulta:", err);
      setError("Não foi possível cancelar a consulta. Tente novamente.");
    }
  };

  // Processa os dados brutos (Consulta) para o formato que o AppointmentsManager espera (ProcessedConsulta)
  const processedConsultas = useMemo((): ProcessedConsulta[] => {
    if (!Array.isArray(consultas)) return [];
    
    return consultas.map(item => {
      const psicologo = findPsicologoById(item.psicologoId);
      const schedule = formatAppointmentDate(item.horario);
      return {
        ...item,
        participantName: psicologo.nome,
        participantAvatarUrl: psicologo.avatarUrl,
        ...schedule,
      };
    });
  }, [consultas, findPsicologoById]);

  // --- RENDERIZAÇÃO ---
  return (
    <StudentLayout>
      <AppointmentsManager
        consultas={processedConsultas}
        userRole="student"
        // Combina todos os estados de carregamento
        isLoading={isAuthLoading || isUserDataLoading || isDataLoading}
        error={error}
        onUpdateStatus={handleUpdateStatus}
      />
    </StudentLayout>
  );
}