import React, { useState, useMemo } from "react";
import RequestCard from "./RequestCard";
import AppointmentCard from "./AppointmentCard";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  LayoutGrid,
  List,
  CalendarDays,
  RefreshCw,
  X,
  Check,
  Search,
  Plus,
} from "lucide-react";
import type { ProcessedConsulta } from "../types";

// Props que o componente recebe
interface AppointmentsManagerProps {
  consultas: ProcessedConsulta[];
  userRole: "student" | "psychologist";
  isLoading: boolean;
  error: string | null;
  onUpdateStatus: (id: string, status: "confirmada" | "cancelada") => void;
}

export default function AppointmentsManager({
  consultas,
  userRole,
  isLoading,
  error,
  onUpdateStatus,
}: AppointmentsManagerProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>(
    userRole === "psychologist" ? "solicitacoes" : "agendados"
  );

  // Mapeia as abas para os status das consultas
  const tabStatusMap: Record<string, string> = {
    agendados: "confirmada",
    solicitacoes: "aguardando aprovacao",
    cancelados: "cancelada",
  };

  // Filtra os dados com base na aba ativa e na busca
  const filteredData = useMemo(() => {
    if (!Array.isArray(consultas)) return [];

    const now = new Date();
    return consultas
      .filter((item) => {
        if (activeTab === "passados") {
          return new Date(item.horario) < now && item.status !== 'cancelada';
        }
        if (activeTab === "solicitacoes") {
            return item.status.toLowerCase().includes("aguardando");
        }
        return item.status === tabStatusMap[activeTab];
      })
      .filter((item) =>
        item.participantName.toLowerCase().includes(search.toLowerCase())
      );
  }, [activeTab, search, consultas]);

  // Renderiza o estado de carregamento
  if (isLoading) {
    return <div className="text-center p-8 text-gray-500">A carregar agendamentos...</div>;
  }

  // Renderiza o estado de erro
  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }
  
  // Define as abas visíveis
  const tabs = [
      { id: "solicitacoes", label: "Solicitações", icon: RefreshCw },
      { id: "agendados", label: "Agendados", icon: Check },
      { id: "cancelados", label: "Cancelados", icon: X },
      { id: "passados", label: "Passados", icon: CalendarDays },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Agendamentos</h1>

      {/* Abas */}
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

      {/* Pesquisa e filtros */}
      <div className="flex flex-wrap md:flex-nowrap md:items-center justify-between gap-4 mb-6">
        <Input
          icon={<Search className="w-4 h-4 text-gray-400" />}
          placeholder={`Pesquisar por nome do ${
            userRole === "psychologist" ? "paciente" : "psicólogo"
          }`}
          className="max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-sm px-3 text-gray-500">
            Recentes
          </Button>
          <Button variant="outline" className="text-sm px-3">
            <Plus className="w-4 h-4 text-gray-400 mr-1" />
            <span className="text-gray-500">Próximos</span>
          </Button>
          <Button variant="ghost" size="icon">
            <LayoutGrid className="w-5 h-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon">
            <List className="w-5 h-5 text-gray-500" />
          </Button>
        </div>
      </div>

      {/* Lista de consultas */}
      <div className="flex gap-4 flex-wrap">
        {filteredData.length > 0 ? (
          filteredData.map((item) =>
            activeTab === "solicitacoes" && userRole === "psychologist" ? (
              <RequestCard
                key={item.id}
                name={item.participantName}
                role="Paciente"
                date={item.date}
                time={item.time}
                avatarUrl={item.participantAvatarUrl}
                onAccept={() => onUpdateStatus(item.id, "confirmada")}
                onReject={() => onUpdateStatus(item.id, "cancelada")}
              />
            ) : (
              <AppointmentCard
                key={item.id}
                name={item.participantName}
                role={userRole === 'student' ? 'Psicólogo(a)' : 'Paciente'}
                date={item.date}
                time={item.time}
                status={item.status}
                avatarUrl={item.participantAvatarUrl || ""}
                onCancel={
                  activeTab === "agendados"
                    ? () => onUpdateStatus(item.id, "cancelada")
                    : undefined
                }
              />
            )
          )
        ) : (
          <div className="w-full text-center py-8">
            <p className="text-gray-500">
              Nenhum item encontrado nesta categoria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}