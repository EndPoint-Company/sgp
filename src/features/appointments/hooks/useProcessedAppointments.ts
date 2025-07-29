// src/features/appointments/hooks/useProcessedAppointments.ts

import { useState, useEffect, useCallback } from 'react';
import type { ProcessedConsulta, Consulta, User } from '../types';
import { getConsultasByPsicologoId, getConsultasByAlunoId } from '../services/appointmentService';
import { mapApiDataToConsulta } from '../mappers/appointmentMappers';
import { useUserData } from '../../../contexts/UserDataProvider';

/**
 * Hook customizado para buscar e processar as consultas para exibição na UI.
 */
export function useProcessedAppointments(userId: string, userRole: 'aluno' | 'psicologo') {
  const [consultas, setConsultas] = useState<ProcessedConsulta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { findPsicologoById, findAlunoById } = useUserData();

  const fetchData = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);

      let apiResponse: Consulta[] = [];
      if (userRole === 'psicologo') {
        apiResponse = await getConsultasByPsicologoId(userId);
      } else {
        apiResponse = await getConsultasByAlunoId(userId);
      }
      
      const mappedConsultas = apiResponse.map(mapApiDataToConsulta);
      const processedData = mappedConsultas.map(c => 
          processConsultaForUI(c, userRole, findPsicologoById, findAlunoById)
      );

      setConsultas(processedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Falha ao buscar agendamentos.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, userRole, findPsicologoById, findAlunoById]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { consultas, isLoading, error, refetch: fetchData };
}


function processConsultaForUI(
  consulta: Consulta,
  userRole: 'aluno' | 'psicologo',
  findPsicologoById: (id: string) => User,
  findAlunoById: (id: string) => User
): ProcessedConsulta {
  
  let participant: User;
  if (userRole === 'psicologo') {
    participant = findAlunoById(consulta.alunoId);
  } else {
    participant = findPsicologoById(consulta.psicologoId);
  }

  // --- LÓGICA DE FORMATAÇÃO ATUALIZADA ---
  const startDate = new Date(consulta.inicio);

  // Formata a data para: "quinta-feira, 31 de julho de 2025"
  let formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(startDate);

  // Capitaliza a primeira letra do dia da semana.
  formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // Formata a hora de início.
  const startTime = startDate.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
  
  // ATUALIZADO: A formatação agora mostra apenas a hora de início.
  const formattedTime = startTime;

  return {
    ...consulta,
    participantName: participant?.nome || 'Desconhecido',
    participantAvatarUrl: participant?.avatarUrl,
    date: formattedDate,
    time: formattedTime,
  };
}
