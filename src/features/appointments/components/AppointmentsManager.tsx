// src/features/appointments/components/AppointmentsManager.tsx

import React, { useState, useMemo } from "react";
import RequestCard from "./RequestCard";
import AppointmentCard from "./AppointmentCard";
import { Input } from "../../../components/ui/input";
import { CalendarDays, RefreshCw, X, Check } from "lucide-react";
import { useProcessedAppointments } from "../hooks/useProcessedAppointments";
import { updateConsultaStatus } from "../services/appointmentService";


interface AppointmentsManagerProps {
  userId: string;
  userRole: "aluno" | "psicologo";
}

export default function AppointmentsManager({ userId, userRole }: AppointmentsManagerProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>(
    userRole === "psicologo" ? "solicitacoes" : "agendados"
  );

  const { consultas, isLoading, error, refetch } = useProcessedAppointments(userId, userRole);

  const handleUpdateStatus = async (id: string, status: "confirmada" | "cancelada") => {
    try {
      await updateConsultaStatus(id, status);
      refetch(); // Recarrega os dados após a atualização.
    } catch (updateError) {
      console.error("Falha ao atualizar status:", updateError);
      // Opcional: Mostrar um erro para o usuário.
    }
  };

  const psychologistTabs = [
      { id: "solicitacoes", label: "Solicitações", icon: RefreshCw },
      { id: "agendados", label: "Agendados", icon: Check },
      { id: "cancelados", label: "Cancelados", icon: X },
      { id: "passados", label: "Passados", icon: CalendarDays },
  ];

  const studentTabs = [
      { id: "solicitacoes", label: "Solicitações", icon: RefreshCw },
      { id: "agendados", label: "Agendados", icon: Check },
      { id: "cancelados", label: "Cancelados", icon: X },
      { id: "passados", label: "Passados", icon: CalendarDays },
  ];

  const tabs = userRole === 'psicologo' ? psychologistTabs : studentTabs;

  const filteredData = useMemo(() => {
    if (!Array.isArray(consultas)) return [];
    
    const now = new Date();

    let dataToFilter = consultas;

    switch (activeTab) {
      case 'solicitacoes':
        dataToFilter = consultas.filter(item => item.status === 'aguardando aprovacao');
        break;
      case 'agendados':
        dataToFilter = consultas.filter(item => item.status === 'confirmada');
        break;
      case 'cancelados':
        dataToFilter = consultas.filter(item => item.status === 'cancelada');
        break;
      case 'passados':
        dataToFilter = consultas.filter(item => new Date(item.inicio) < now && item.status !== 'cancelada');
        break;
      default:
        dataToFilter = [];
        break;
    }

    if (search) {
      return dataToFilter.filter(item =>
        item.participantName.toLowerCase().includes(search.toLowerCase())
      );
    }

    return dataToFilter;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, search, consultas, userRole]);

  if (isLoading) {
    return <div className="text-center p-8 text-gray-500">A carregar agendamentos...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Agendamentos</h1>

      <div className="flex items-center gap-6 border-b border-gray-200 mb-4 text-sm">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 pb-2 transition-colors ${
              activeTab === id
                ? "text-blue-600 font-medium border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap md:flex-nowrap md:items-center justify-between gap-4 mb-6">
        <Input
          placeholder={`Pesquisar por nome do ${userRole === "psicologo" ? "aluno" : "psicólogo"}`}
          className="max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-4 flex-wrap">
        {filteredData.length > 0 ? (
          filteredData.map((item) =>
            // ATUALIZADO: O RequestCard só é renderizado para o psicólogo no separador de solicitações.
            activeTab === "solicitacoes" && userRole === "psicologo" ? (
              <RequestCard
                key={item.id}
                name={item.participantName}
                role={'Paciente'}
                date={item.date}
                time={item.time}
                avatarUrl={item.participantAvatarUrl}
                onAccept={() => handleUpdateStatus(item.id, "confirmada")}
                onReject={() => handleUpdateStatus(item.id, "cancelada")}
              />
            ) : (
              // Para todos os outros casos, incluindo as solicitações do aluno, renderiza o AppointmentCard.
              <AppointmentCard
                key={item.id}
                name={item.participantName}
                role={userRole === 'aluno' ? 'Psicólogo(a)' : 'Paciente'}
                date={item.date}
                time={item.time}
                status={item.status}
                avatarUrl={item.participantAvatarUrl || ""}
                // ATUALIZADO: O aluno pode cancelar tanto agendamentos como solicitações.
                onCancel={
                  (activeTab === "agendados" || (activeTab === "solicitacoes" && userRole === "aluno"))
                    ? () => handleUpdateStatus(item.id, "cancelada")
                    : undefined
                }
              />
            )
          )
        ) : (
          <div className="w-full text-center py-8">
            <p className="text-gray-500">Nenhum item encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
