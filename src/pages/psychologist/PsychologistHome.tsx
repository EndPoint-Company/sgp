import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import {
  getConsultasByPsicologoId,
  updateConsultaStatus,
} from "../../features/appointments/services/appointmentService";
import { formatAppointmentDate } from "../../utils/dataHelpers";
import { AppointmentsSection } from "../../features/home/components/AppointmentsSection";
import PsychologistLayout from "../../layouts/PsychologistLayout";
import { WelcomeBanner } from "../../features/home/components/WelcomeBanner";
import type {
  Consulta,
  ProcessedConsulta,
} from "../../features/appointments/types";

// 1. Importe o hook e o tipo Aluno do nosso provedor de contexto
import { useUserData, type Aluno } from "../../contexts/UserDataProvider";

// NOVO: Define um tipo mais flexível para o objeto Aluno, que pode ter diferentes propriedades de nome
type AlunoComNomesPossiveis = Aluno & {
  name?: string;
  displayName?: string;
};

export default function PsychologistHomePage() {
  // --- ESTADO E HOOKS ---
  const { user, isLoading: isAuthLoading } = useAuth();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [isConsultasLoading, setIsConsultasLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Use o contexto para obter a função de busca de alunos
  const { findAlunoById, isLoading: isUserDataLoading } = useUserData();

  // --- LÓGICA DE DADOS ---
  // Efeito para buscar as consultas do psicólogo
  useEffect(() => {
    if (user?.uid) {
      setIsConsultasLoading(true);
      getConsultasByPsicologoId(user.uid)
        .then(setConsultas)
        .catch((err) => {
          console.error("Erro ao carregar consultas:", err);
          setError("Não foi possível carregar seus atendimentos.");
        })
        .finally(() => setIsConsultasLoading(false));
    }
  }, [user]);

  // Função para atualizar o status de uma consulta
  const handleUpdateStatus = async (
    id: string,
    status: "confirmada" | "cancelada"
  ) => {
    try {
      await updateConsultaStatus(id, status);
      // Atualiza o estado local para uma resposta de UI instantânea
      setConsultas((prevConsultas) =>
        prevConsultas.map((c) => (c.id === id ? { ...c, status } : c))
      );
    } catch (err) {
      console.error(`Erro ao atualizar status para ${status}:`, err);
      setError("Falha ao atualizar o status da consulta.");
    }
  };

  // 3. Processa os dados brutos para incluir o nome do aluno
  const { proximasConsultas, solicitacoesPendentes } = useMemo(() => {
    const processed: ProcessedConsulta[] = consultas.map((consulta) => {
      const aluno = findAlunoById(consulta.alunoId) as AlunoComNomesPossiveis;
      const horarioFormatado = formatAppointmentDate(consulta.horario);

      // ALTERADO: Acessa as propriedades de forma segura, sem usar 'any'
      const participantName =
        aluno.nome || aluno.name || aluno.displayName || "Aluno Desconhecido";

      return {
        ...consulta,
        participantName: participantName, // Adiciona o nome do aluno aqui
        participantAvatarUrl: aluno.avatarUrl || "",
        date: horarioFormatado.date,
        time: horarioFormatado.time,
      };
    });

    return {
      proximasConsultas: processed.filter((c) => c.status === "confirmada"),
      solicitacoesPendentes: processed.filter((c) =>
        c.status.toLowerCase().includes("aguardando")
      ),
    };
  }, [consultas, findAlunoById]);

  // --- RENDERIZAÇÃO ---
  if (isAuthLoading || isUserDataLoading || isConsultasLoading) {
    return (
      <PsychologistLayout>
        <div className="flex justify-center items-center h-64">
          <p>Carregando...</p>
        </div>
      </PsychologistLayout>
    );
  }

  if (error) {
    return (
      <PsychologistLayout>
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
          <button
            className="mt-2 text-red-700 underline"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      </PsychologistLayout>
    );
  }

  return (
    <PsychologistLayout>
      <WelcomeBanner
        userName={user?.displayName || user?.email || "Psicólogo"}
      />
      <div className="space-y-8">
        <AppointmentsSection
          title="Solicitações Pendentes"
          appointments={solicitacoesPendentes}
          emptyMessage="Nenhuma solicitação pendente no momento."
          cardType="request"
          userRole="psychologist"
          onAccept={(id) => handleUpdateStatus(id, "confirmada")}
          onReject={(id) => handleUpdateStatus(id, "cancelada")}
        />
        <AppointmentsSection
          title="Próximas Consultas"
          appointments={proximasConsultas}
          emptyMessage="Você não possui consultas agendadas."
          cardType="appointment"
          userRole="psychologist"
          onCancel={(id) => handleUpdateStatus(id, "cancelada")}
        />
      </div>
    </PsychologistLayout>
  );
}
