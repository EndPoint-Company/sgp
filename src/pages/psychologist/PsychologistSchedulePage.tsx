import React, { useState, useEffect, useMemo, useRef } from 'react';
import PsychologistLayout from '../../layouts/PsychologistLayout';
import ScheduleManager from '../../features/schedule/components/ScheduleManager';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useUserData, type Aluno } from '../../contexts/UserDataProvider';
import { getConsultasByPsicologoId } from '../../features/appointments/services/appointmentService';
import type { Consulta } from '../../features/appointments/types';
import { Toast } from '../../components/ui/Toast';

// Define um tipo para a consulta após ser processada com o nome do participante
export type ProcessedEvent = Consulta & {
  participantName: string;
};

// Define um tipo mais flexível para o objeto Aluno
type AlunoComNomesPossiveis = Aluno & {
  name?: string;
  displayName?: string;
};

export default function PsychologistSchedulePage() {
  // --- LÓGICA E ESTADO ---
  const { user, isLoading: isAuthLoading } = useAuth();
  const { findAlunoById, isLoading: isUserDataLoading } = useUserData();
  
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState({ isVisible: false, message: '' });
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Efeito para buscar os dados das consultas
  useEffect(() => {
    if (!isAuthLoading && user?.uid) {
      setIsDataLoading(true);
      getConsultasByPsicologoId(user.uid)
        .then(setConsultas)
        .catch(() => setError('Não foi possível carregar os dados da agenda.'))
        .finally(() => setIsDataLoading(false));
    }
  }, [user, isAuthLoading]);

  // Processa as consultas para incluir o nome do aluno
  const processedConsultas = useMemo((): ProcessedEvent[] => {
    if (!Array.isArray(consultas)) return [];
    
    return consultas.map(item => {
      const aluno = findAlunoById(item.alunoId) as AlunoComNomesPossiveis;
      const participantName = aluno.nome || aluno.name || aluno.displayName || 'Desconhecido';
      
      return {
        ...item,
        participantName: participantName, 
      };
    });
  }, [consultas, findAlunoById]);

  // Função para exibir o toast de notificação
  const showToast = (message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ isVisible: true, message });
    toastTimerRef.current = setTimeout(() => {
      setToast({ isVisible: false, message: '' });
    }, 3000);
  };

  // --- RENDERIZAÇÃO ---
  const isLoading = isAuthLoading || isDataLoading || isUserDataLoading;

  return (
    <PsychologistLayout>
      <div className="h-full w-full relative">
        {isLoading && <p className="text-center p-8">A carregar agenda...</p>}
        {error && <p className="text-center p-8 text-red-500">{error}</p>}
        {!isLoading && !error && user && (
          <ScheduleManager
            userRole="psychologist"
            currentUserId={user.uid}
            consultas={processedConsultas} // Passa os dados já processados
            availability={availability}
            setAvailability={setAvailability}
            onShowToast={showToast}
          />
        )}
        <Toast message={toast.message} isVisible={toast.isVisible} />
      </div>
    </PsychologistLayout>
  );
}
