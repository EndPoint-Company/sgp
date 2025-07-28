import React, { useState, useEffect, useRef } from 'react';
import PsychologistLayout from '../../layouts/PsychologistLayout';
import ScheduleManager from '../../features/schedule/components/ScheduleManager';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { getConsultasByPsicologoId } from '../../features/appointments/services/appointmentService';
import type { Consulta } from '../../features/appointments/types';
import { Toast } from '../../components/Toast';

export default function PsychologistSchedulePage() {
  // --- LÓGICA E ESTADO ---
  const { user, isLoading: isAuthLoading } = useAuth();
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

  // Função para exibir o toast de notificação
  const showToast = (message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ isVisible: true, message });
    toastTimerRef.current = setTimeout(() => {
      setToast({ isVisible: false, message: '' });
    }, 3000);
  };

  // --- RENDERIZAÇÃO ---
  const isLoading = isAuthLoading || isDataLoading;

  return (
    <PsychologistLayout>
      <div className="h-full w-full relative">
        {isLoading && <p>Carregando agenda...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && user && (
          <ScheduleManager
            userRole="psychologist"
            currentUserId={user.uid}
            consultas={consultas}
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
