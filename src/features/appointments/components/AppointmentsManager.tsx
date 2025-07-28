// src/features/appointments/components/AppointmentsManager.tsx

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
import type { ConsultaStatus } from "../../../features/appointments/types";

interface ProcessedConsulta {
  id: string;
  participantName: string;
  participantAvatarUrl?: string;
  date: string;
  time: string;
  status: ConsultaStatus;
  horario: string;
}

interface AppointmentsManagerProps {
  consultas?: ProcessedConsulta[]; // <- agora permite undefined
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
  const [activeTab, setActiveTab] = useState<
    "agendados" | "solicitacoes" | "cancelados" | "passados"
  >(userRole === "psychologist" ? "solicitacoes" : "agendados");

  const tabStatusMap: Record<
    "agendados" | "solicitacoes" | "cancelados",
    ConsultaStatus
  > = {
    agendados: "confirmada",
    solicitacoes: "aguardando_aprovacao",
    cancelados: "cancelada",
  };

  // useMemo deve ser chamado sempre, antes de qualquer return condicional
  const filteredData = useMemo(() => {
    if (!consultas) return [];
    const now = new Date();

    return consultas
      .filter((item) => {
        if (activeTab === "passados") {
          return new Date(item.horario) < now && item.status !== "cancelada";
        }
        return item.status === tabStatusMap[activeTab];
      })
      .filter((item) =>
        item.participantName.toLowerCase().includes(search.toLowerCase())
      );
  }, [activeTab, search, consultas]);

  // ✅ Proteção contra undefined
  if (isLoading) return <div>Carregando consultas...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!consultas) return <div>Nenhuma consulta carregada.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Agendamentos</h1>

      {/* Abas */}
      <div className="flex items-center gap-6 border-b border-gray-200 mb-4 text-sm">
        {userRole === "psychologist" && (
          <button
            onClick={() => setActiveTab("solicitacoes")}
            className={`flex items-center gap-1 pb-2 ${
              activeTab === "solicitacoes"
                ? "text-blue-600 font-medium border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
          >
            <RefreshCw className="w-4 h-4" /> Solicitações
          </button>
        )}
        <button
          onClick={() => setActiveTab("agendados")}
          className={`flex items-center gap-1 pb-2 ${
            activeTab === "agendados"
              ? "text-black font-medium border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
        >
          <Check className="w-4 h-4" /> Agendados
        </button>
        <button
          onClick={() => setActiveTab("cancelados")}
          className={`flex items-center gap-1 pb-2 ${
            activeTab === "cancelados"
              ? "text-black font-medium border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
        >
          <X className="w-4 h-4" /> Cancelados
        </button>
        <button
          onClick={() => setActiveTab("passados")}
          className={`flex items-center gap-1 pb-2 ${
            activeTab === "passados"
              ? "text-black font-medium border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
        >
          <CalendarDays className="w-4 h-4" /> Passados
        </button>
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
          filteredData.map((item) => {
            const avatar = item.participantAvatarUrl || "";

            if (activeTab === "solicitacoes" && userRole === "psychologist") {
              return (
                <RequestCard
                  key={item.id}
                  name={item.participantName}
                  role="Paciente"
                  avatarUrl={avatar}
                  date={item.date}
                  time={item.time}
                  onAccept={() => onUpdateStatus(item.id, "confirmada")}
                  onReject={() => onUpdateStatus(item.id, "cancelada")}
                />
              );
            }

            return (
              <AppointmentCard
                key={item.id}
                name={item.participantName}
                role={userRole === "psychologist" ? "Paciente" : "Psicólogo"}
                date={item.date}
                time={item.time}
                status={item.status}
                avatarUrl={avatar}
                onCancel={
                  userRole === "student" || activeTab === "agendados"
                    ? () => onUpdateStatus(item.id, "cancelada")
                    : undefined
                }
              />
            );
          })
        ) : (
          <p className="text-gray-500 w-full">
            Nenhum item encontrado nesta categoria.
          </p>
        )}
      </div>
    </div>
  );
}
