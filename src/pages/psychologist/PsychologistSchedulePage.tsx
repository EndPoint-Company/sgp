// src/pages/psychologist/PsychologistSchedulePage.tsx

import React, { useState, useEffect, useMemo, useRef } from 'react';
import PsychologistLayout from '../../layouts/PsychologistLayout';
import ScheduleManager from '../../features/schedule/components/ScheduleManager';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useUserData, type Aluno } from '../../contexts/UserDataProvider';
import { getConsultasByPsicologoId } from '../../features/appointments/services/appointmentService';
// ATUALIZADO: Importando a função 'createHorario' no singular.
import { getHorariosByPsicologoId, createHorario, deleteHorario } from '../../features/horarios/services/horarioService';
import type { HorarioDisponivel, NewHorario } from '../../features/horarios/services/horarioService';
import type { Consulta } from '../../features/appointments/types';
import { Toast } from '../../components/ui/Toast';

export type ProcessedEvent = Consulta & {
  participantName: string;
};

type AlunoComNomesPossiveis = Aluno & {
  name?: string;
  displayName?: string;
};

export default function PsychologistSchedulePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { findAlunoById, isLoading: isUserDataLoading } = useUserData();
  
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState({ isVisible: false, message: '' });
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async (userId: string) => {
    setIsDataLoading(true);
    try {
      const [consultasData, horariosData] = await Promise.all([
        getConsultasByPsicologoId(userId),
        getHorariosByPsicologoId(userId)
      ]);
      setConsultas(consultasData);
      setHorarios(horariosData);
    } catch {
      setError('Não foi possível carregar os dados da agenda.');
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && user?.uid) {
      fetchData(user.uid);
    }
  }, [user, isAuthLoading]);

  const handleSaveAvailability = async (newlyAddedAvailability: Record<string, string[]>) => {
    if (!user?.uid) return;
    
    const novosHorarios: NewHorario[] = [];
    Object.entries(newlyAddedAvailability).forEach(([date, times]) => {
      times.forEach(time => {
        const [hour, minute] = time.split(':');
        const startDate = new Date(`${date}T00:00:00.000Z`);
        startDate.setUTCHours(Number(hour), Number(minute));
        
        const endDate = new Date(startDate);
        endDate.setUTCHours(startDate.getUTCHours() + 1);

        novosHorarios.push({
          psicologoId: user.uid,
          inicio: startDate.toISOString(),
          fim: endDate.toISOString(),
        });
      });
    });

    try {
      // ATUALIZADO: Faz um loop e envia uma requisição para cada novo horário.
      await Promise.all(novosHorarios.map(horario => createHorario(horario)));
      showToast("Disponibilidade salva com sucesso!");
      fetchData(user.uid);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Erro desconhecido.");
    }
  };

  const handleBlockDay = async (dayToBlock: Date) => {
    const dateKey = dayToBlock.toISOString().split("T")[0];
    const slotsToDelete = horarios.filter(h => h.inicio.startsWith(dateKey) && h.status === 'disponivel');

    if (slotsToDelete.length === 0) {
      showToast("Este dia não possui horários disponíveis para bloquear.");
      return;
    }

    try {
      await Promise.all(slotsToDelete.map(slot => deleteHorario(slot.id)));
      showToast("Dia bloqueado com sucesso!");
      fetchData(user!.uid);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Erro ao bloquear o dia.");
    }
  };

  const processedConsultas = useMemo((): ProcessedEvent[] => {
    if (!Array.isArray(consultas)) return [];
    return consultas.map(item => {
      const aluno = findAlunoById(item.alunoId) as AlunoComNomesPossiveis;
      const participantName = aluno.nome || aluno.name || aluno.displayName || 'Desconhecido';
      return { ...item, participantName };
    });
  }, [consultas, findAlunoById]);

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

  const showToast = (message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ isVisible: true, message });
    toastTimerRef.current = setTimeout(() => {
      setToast({ isVisible: false, message: '' });
    }, 3000);
  };

  const isLoading = isAuthLoading || isDataLoading || isUserDataLoading;

  return (
    <PsychologistLayout>
      <div className="h-full w-full relative">
        {isLoading && <p className="text-center p-8">A carregar agenda...</p>}
        {error && <p className="text-center p-8 text-red-500">{error}</p>}
        {!isLoading && !error && user && (
          <ScheduleManager
            userRole="psicologo"
            currentUserId={user.uid}
            consultas={processedConsultas}
            availability={availabilityRecord}
            onSaveAvailability={handleSaveAvailability}
            onBlockDay={handleBlockDay}
          />
        )}
        <Toast message={toast.message} isVisible={toast.isVisible} />
      </div>
    </PsychologistLayout>
  );
}
