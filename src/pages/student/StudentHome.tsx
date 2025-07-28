import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import {
  getConsultasByAlunoId,
  updateConsultaStatus,
  createConsulta,
} from "../../features/appointments/services/appointmentService";
import { formatAppointmentDate } from "../../utils/dataHelpers";
import { AppointmentsSection } from "../../features/home/components/AppointmentsSection";
import type { Consulta } from "../../features/appointments/types";
import { Button } from "../../components/ui/button";
import { Modal } from "../../components/ui/Modal";
import { Plus } from "lucide-react";
import { AppointmentRequestFlow } from "../../features/appointments/components/AppointmentRequestFlow";
import StudentLayout from "../../layouts/StudentLayout";
import { WelcomeBanner } from "../../features/home/components/WelcomeBanner";

// Importa o hook do nosso provedor de contexto
import { useUserData } from "../../contexts/UserDataProvider";
import type { Psicologo } from "../../contexts/UserDataProvider";

// ID fixo para o psicólogo, conforme solicitado
const FIXED_PSICOLOGO_ID = "KVPBp1zK9KX1xZGvF54bxNHD10r2";

export default function StudentHomePage() {
  // Hooks de autenticação e estado do componente
  const { user, isLoading: isAuthLoading } = useAuth();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [isConsultasLoading, setIsConsultasLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Usa o contexto para obter a lista de psicólogos e a função de busca
  const {
    psicologos,
    findPsicologoById,
    isLoading: isUserDataLoading,
  } = useUserData();

  // Estado para o psicólogo alvo e o modal
  const [targetPsicologo, setTargetPsicologo] = useState<Psicologo | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Efeito para buscar as CONSULTAS do aluno
  useEffect(() => {
    if (user?.uid) {
      setIsConsultasLoading(true);
      getConsultasByAlunoId(user.uid)
        .then(setConsultas)
        .catch((err) => {
          console.error("Erro ao carregar consultas:", err);
          setError("Não foi possível carregar seus atendimentos.");
        })
        .finally(() => setIsConsultasLoading(false));
    }
  }, [user]);

  // Efeito para definir o psicólogo alvo para o agendamento.
  useEffect(() => {
    if (psicologos.length > 0) {
      const psicologoAlvo = findPsicologoById(FIXED_PSICOLOGO_ID);

      if (psicologoAlvo.nome !== "Psicólogo Desconhecido") {
        setTargetPsicologo(psicologoAlvo);
      } else {
        console.error(
          `Psicólogo fixo com ID "${FIXED_PSICOLOGO_ID}" não foi encontrado.`
        );
        setError(
          "O psicólogo configurado para agendamento não foi encontrado."
        );
      }
    }
  }, [psicologos, findPsicologoById]);

  const handleCancelAppointment = async (consultaId: string) => {
    if (!user?.uid) return;
    try {
      await updateConsultaStatus(consultaId, "cancelada");
      const updated = await getConsultasByAlunoId(user.uid);
      setConsultas(updated);
    } catch (err) {
      console.error("Falha ao cancelar consulta:", err);
      setError("Não foi possível cancelar o agendamento.");
    }
  };

  const handleCreateRequest = async (data: Omit<Consulta, "id">) => {
    if (!user?.uid) return;
    setIsCreating(true);
    setError(null);
    try {
      await createConsulta({
        alunoId: user.uid,
        psicologoId: data.psicologoId,
        horario: data.horario,
        status: "aguardando_aprovacao",
      });
      const updated = await getConsultasByAlunoId(user.uid);
      setConsultas(updated);
      setIsModalOpen(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao agendar consulta";
      setError(message);
    } finally {
      setIsCreating(false);
    }
  };

  // O useMemo agora usa a função 'findPsicologoById' do contexto.
  const { upcomingAppointments, pendingRequests } = useMemo(() => {
    const processed = consultas.map((consulta) => {
      const psicologo = findPsicologoById(consulta.psicologoId);
      const schedule = formatAppointmentDate(consulta.horario);
      return {
        ...consulta,
        participantName: psicologo.nome,
        participantAvatarUrl: psicologo.avatarUrl || "",
        ...schedule,
      };
    });

    return {
      upcomingAppointments: processed.filter(
        (item) => item.status === "confirmada"
      ),
      // MODIFICADO: Condição do filtro agora é mais flexível
      pendingRequests: processed.filter((item) =>
        item.status.toLowerCase().includes("aguardando")
      ),
    };
  }, [consultas, findPsicologoById]);

  // O estado de carregamento agora combina todos os carregamentos
  if (isAuthLoading || isUserDataLoading || isConsultasLoading) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-64">
          <p>Carregando...</p>
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
          <button
            className="mt-2 text-red-700 underline"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <WelcomeBanner userName={user?.displayName || user?.email || "Aluno"} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isCreating && setIsModalOpen(false)}
      >
        {targetPsicologo && (
          <AppointmentRequestFlow
            onConfirm={handleCreateRequest}
            onClose={() => !isCreating && setIsModalOpen(false)}
            alunoId={user?.uid || ""}
            psicologoId={targetPsicologo.id}
            psicologoNome={targetPsicologo.nome}
          />
        )}
      </Modal>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Meus Atendimentos</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isCreating || !targetPsicologo}
          title={
            !targetPsicologo
              ? "Nenhum psicólogo disponível"
              : "Agendar nova consulta"
          }
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Solicitação
        </Button>
      </div>

      <div className="space-y-8">
        <AppointmentsSection
          title="Solicitações Pendentes"
          appointments={pendingRequests}
          emptyMessage="Nenhuma solicitação pendente no momento."
          cardType="appointment"
          userRole="student"
        />
        <AppointmentsSection
          title="Próximos Atendimentos"
          appointments={upcomingAppointments}
          emptyMessage="Você não possui atendimentos agendados."
          cardType="appointment"
          userRole="student"
          onCancel={handleCancelAppointment}
        />
      </div>
    </StudentLayout>
  );
}
