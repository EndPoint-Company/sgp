import React, { useState, useEffect, useMemo } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import ScheduleManager from '../../features/schedule/components/ScheduleManager';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { getConsultasByAlunoId } from '../../features/appointments/services/appointmentService';
import type { Consulta } from '../../features/appointments/types';

// Dados mockados de disponibilidade do psicólogo
const mockPsicologoAvailability: Record<string, string[]> = {
  "2025-07-28": ["09:00", "10:00", "11:00", "14:00"],
  "2025-07-29": ["09:00", "11:00", "15:00", "16:00"],
};

// Define tipo estendido da consulta com nome do participante
type ProcessedConsulta = Consulta & {
  participantName: string;
};

export default function StudentSchedulePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Aluno apenas visualiza a disponibilidade
  const [availability] = useState<Record<string, string[]>>(mockPsicologoAvailability);

  // Carrega as consultas do aluno
  useEffect(() => {
    if (!isAuthLoading && user?.uid) {
      setIsDataLoading(true);
      getConsultasByAlunoId(user.uid)
        .then(setConsultas)
        .catch(() => setError('Não foi possível carregar os dados da agenda.'))
        .finally(() => setIsDataLoading(false));
    }
  }, [user, isAuthLoading]);

  // Processa as consultas para incluir o nome do psicólogo
  const processedConsultas: ProcessedConsulta[] = useMemo(() => {
    if (!Array.isArray(consultas)) return [];

    return consultas.map((consulta) => ({
      ...consulta,
      participantName: 'Seu psicólogo', // você pode buscar o nome real no futuro
    }));
  }, [consultas]);

  const isLoading = isAuthLoading || isDataLoading;

  return (
    <StudentLayout>
      <div className="h-full w-full relative">
        {isLoading && <p className="text-center p-8">Carregando agenda...</p>}
        {error && <p className="text-red-500 text-center p-8">{error}</p>}
        {!isLoading && !error && user && (
          <ScheduleManager
            userRole="student"
            currentUserId={user.uid}
            consultas={processedConsultas}
            availability={availability}
            setAvailability={() => {}} // Aluno não pode editar
            onShowToast={() => {}} // Aluno não usa toast
          />
        )}
      </div>
    </StudentLayout>
  );
}
