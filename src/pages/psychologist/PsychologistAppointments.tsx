import React, { useState, useEffect, useMemo } from 'react';

// 1. Hooks, Serviços e Contexto
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useUserData } from '../../features/auth/contexts/UserDataProvider';
import { getConsultasByPsicologoId, updateConsultaStatus } from '../../features/appointments/services/appointmentService';

// 2. Layouts e Componentes de UI
import PsychologistLayout from '../../layouts/PsychologistLayout';
import AppointmentsManager from '../../features/appointments/components/AppointmentsManager';

// 3. Tipos e Funções Auxiliares
import type { Consulta, ProcessedConsulta } from '../../features/appointments/types';
import { formatAppointmentDate } from '../../utils/dataHelpers';

export default function PsychologistAppointmentsPage() {
  // --- LÓGICA E ESTADO ---
  const { user, isLoading: isAuthLoading } = useAuth();
  // Obtém a função de busca de alunos do nosso contexto
  const { findAlunoById, isLoading: isUserDataLoading } = useUserData();
  
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Efeito para buscar os dados das consultas
  useEffect(() => {
    if (!isAuthLoading && user?.uid) {
      setIsDataLoading(true);
      getConsultasByPsicologoId(user.uid)
        .then(setConsultas)
        .catch(() => setError('Não foi possível carregar os agendamentos.'))
        .finally(() => setIsDataLoading(false));
    }
  }, [user, isAuthLoading]);

  // Função para aceitar ou rejeitar uma solicitação
  const handleUpdateStatus = async (consultaId: string, newStatus: 'confirmada' | 'cancelada') => {
    if (user?.uid) {
      try {
        await updateConsultaStatus(consultaId, newStatus);
        // Atualiza o estado local para uma UI mais rápida, sem recarregar tudo
        setConsultas(prev => prev.map(c => c.id === consultaId ? { ...c, status: newStatus } : c));
      } catch (err) {
        console.error("Erro ao atualizar status:", err);
        setError("Não foi possível atualizar o status da consulta.");
      }
    }
  };

  // Processa os dados brutos para o formato que o AppointmentsManager espera
  const processedConsultas = useMemo((): ProcessedConsulta[] => {
    if (!Array.isArray(consultas)) return [];
    
    return consultas.map(item => {
      // ALTERADO: Usa a função findAlunoById do contexto em vez de getPacienteData
      const aluno = findAlunoById(item.alunoId);
      const schedule = formatAppointmentDate(item.horario);
      
      const participantName = (aluno).nome || 'Aluno Desconhecido';

      return {
        ...item,
        participantName: participantName,
        participantAvatarUrl: aluno.avatarUrl,
        ...schedule,
      };
    });
  }, [consultas, findAlunoById]);

  // --- RENDERIZAÇÃO ---
  return (
    <PsychologistLayout>
      <AppointmentsManager
        consultas={processedConsultas}
        userRole="psychologist"
        // Combina todos os estados de carregamento
        isLoading={isAuthLoading || isUserDataLoading || isDataLoading}
        error={error}
        onUpdateStatus={handleUpdateStatus}
      />
    </PsychologistLayout>
  );
}