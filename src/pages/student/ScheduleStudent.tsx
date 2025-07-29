// src/pages/student/StudentSchedulePage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import ScheduleManager from '../../features/schedule/components/ScheduleManager';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useUserData } from '../../contexts/UserDataProvider';
import { getConsultasByAlunoId } from '../../features/appointments/services/appointmentService';
// ATUALIZADO: Importando o serviço e os tipos de horários.
import { getHorariosByPsicologoId } from '../../features/horarios/services/horarioService';
import type { HorarioDisponivel } from '../../features/horarios/services/horarioService';
import type { Consulta } from '../../features/appointments/types';

// Define o tipo estendido da consulta com o nome do participante.
type ProcessedConsulta = Consulta & {
  participantName: string;
};

// ID Fixo do psicólogo para buscar a disponibilidade.
const FIXED_PSICOLOGO_ID = "KVPBp1zK9KX1xZGvF54bxNHD10r2";

export default function StudentSchedulePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { findPsicologoById, isLoading: isUserDataLoading } = useUserData();

  const [consultas, setConsultas] = useState<Consulta[]>([]);
  // ATUALIZADO: Estado para armazenar os horários reais da API.
  const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ATUALIZADO: Carrega tanto as consultas do aluno quanto os horários do psicólogo.
  useEffect(() => {
    if (!isAuthLoading && user?.uid) {
      setIsDataLoading(true);
      Promise.all([
        getConsultasByAlunoId(user.uid),
        getHorariosByPsicologoId(FIXED_PSICOLOGO_ID)
      ]).then(([consultasData, horariosData]) => {
        setConsultas(consultasData);
        setHorarios(horariosData);
      }).catch(() => {
        setError('Não foi possível carregar os dados da agenda.');
      }).finally(() => {
        setIsDataLoading(false);
      });
    }
  }, [user, isAuthLoading]);

  // ATUALIZADO: Processa as consultas para incluir o nome real do psicólogo.
  const processedConsultas: ProcessedConsulta[] = useMemo(() => {
    if (!Array.isArray(consultas)) return [];

    return consultas.map((consulta) => {
        const psicologo = findPsicologoById(consulta.psicologoId);
        return {
            ...consulta,
            participantName: psicologo.nome || 'Psicólogo',
        }
    });
  }, [consultas, findPsicologoById]);

  // ATUALIZADO: Transforma a lista de horários da API para o formato que o ScheduleManager espera.
  const availabilityRecord = useMemo((): Record<string, string[]> => {
    const record: Record<string, string[]> = {};
    horarios.forEach(h => {
      if (h.status === 'disponivel') {
        const dateKey = h.inicio.split('T')[0];
        const time = new Date(h.inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
        if (!record[dateKey]) {
          record[dateKey] = [];
        }
        record[dateKey].push(time);
      }
    });
    return record;
  }, [horarios]);

  const isLoading = isAuthLoading || isDataLoading || isUserDataLoading;

  return (
    <StudentLayout>
      <div className="h-full w-full relative">
        {isLoading && <p className="text-center p-8">Carregando agenda...</p>}
        {error && <p className="text-red-500 text-center p-8">{error}</p>}
        {!isLoading && !error && user && (
          <ScheduleManager
            userRole="aluno"
            currentUserId={user.uid}
            consultas={processedConsultas}
            availability={availabilityRecord}
            // Aluno não pode editar, então as funções de salvar/bloquear não são passadas.
          />
        )}
      </div>
    </StudentLayout>
  );
}
