import React, { useState, useEffect } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import ScheduleManager from '../../features/schedule/components/ScheduleManager';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { getConsultasByAlunoId } from '../../features/appointments/services/appointmentService';
import type { Consulta } from '../../features/appointments/types';

// No futuro, você precisará de uma função para buscar a disponibilidade do psicólogo
// import { getAvailabilityByPsicologoId } from '../../features/schedule/services/scheduleService';

// Dados mockados de disponibilidade para o aluno ver
const mockPsicologoAvailability: Record<string, string[]> = {
  "2025-07-28": ["09:00", "10:00", "11:00", "14:00"],
  "2025-07-29": ["09:00", "11:00", "15:00", "16:00"],
};

export default function StudentSchedulePage() {
  // --- LÓGICA E ESTADO ---
  const { user, isLoading: isAuthLoading } = useAuth();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  // O aluno vê a disponibilidade, mas não a edita
  const [availability] = useState<Record<string, string[]>>(mockPsicologoAvailability);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Efeito para buscar os dados das consultas
  useEffect(() => {
    if (!isAuthLoading && user?.uid) {
      setIsDataLoading(true);
      getConsultasByAlunoId(user.uid)
        .then(setConsultas)
        .catch(() => setError('Não foi possível carregar os dados da agenda.'))
        .finally(() => setIsDataLoading(false));
    }
  }, [user, isAuthLoading]);

  // --- RENDERIZAÇÃO ---
  const isLoading = isAuthLoading || isDataLoading;

  return (
    <StudentLayout>
      <div className="h-full w-full relative">
        {isLoading && <p>Carregando agenda...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && user && (
          <ScheduleManager
            userRole="student"
            currentUserId={user.uid}
            consultas={consultas}
            availability={availability}
            // O aluno não pode definir a disponibilidade, então passamos uma função vazia
            setAvailability={() => {}}
            onShowToast={() => {}}
          />
        )}
      </div>
    </StudentLayout>
  );
}
