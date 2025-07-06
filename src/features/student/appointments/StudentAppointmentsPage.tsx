import React, { useState, useMemo } from "react";
import AppointmentCard from "../../components/AppointmentCard"; 
import { Input } from "../../../components/ui/input";
import { CalendarDays, RefreshCw, X, Check, Search } from "lucide-react";
import {
  mockFirebaseData,
  getPsicologoData, 
  formatAppointmentDate,
} from "../../psychologist/data/mockApi"; 
import type { Consulta } from "../../psychologist/services/apiService";

const ID_ALUNO_LOGADO = "mu3Mo6I0eSSD3aWZdYte";

export default function StudentAppointmentsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"agendados" | "solicitacoes" | "cancelados" | "passados">("agendados");
  const [consultas, setConsultas] = useState<Consulta[]>(mockFirebaseData);

  const handleCancelAppointment = (consultaId: string) => {
    setConsultas((prevConsultas) =>
      prevConsultas.map((c) =>
        c.id === consultaId ? { ...c, status: "cancelada" } : c
      )
    );
    alert("Seu atendimento foi cancelado.");
  };

  const processedData = useMemo(() => {
    return consultas
      .filter(c => c.pacienteId === ID_ALUNO_LOGADO)
      .map((item) => {
        const psicologo = getPsicologoData(item.psicologoId);
        const schedule = formatAppointmentDate(item.horario);
        return { ...item, ...psicologo, ...schedule };
      });
  }, [consultas]);

  const filteredData = useMemo(() => {
    const tabStatusMap: { [key: string]: string } = {
      agendados: "confirmada",
      solicitacoes: "aguardando aprovacao",
      cancelados: "cancelada",
    };
    const now = new Date();
    return processedData
      .filter((item) => {
        if (activeTab === "passados") {
          return new Date(item.horario) < now && item.status === "passada";
        }
        return item.status === tabStatusMap[activeTab];
      })
      .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  }, [activeTab, search, processedData]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Meus Atendimentos</h1>

      <div className="flex items-center gap-6 border-b border-gray-200 mb-6 text-sm">
        <button onClick={() => setActiveTab("agendados")} className={`flex items-center gap-1.5 pb-3 ${activeTab === "agendados" ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-500"}`}>
          <Check className="w-4 h-4" /> Agendados
        </button>
        <button onClick={() => setActiveTab("solicitacoes")} className={`flex items-center gap-1.5 pb-3 ${activeTab === "solicitacoes" ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-500"}`}>
          <RefreshCw className="w-4 h-4" /> Solicitações
        </button>
        <button onClick={() => setActiveTab("cancelados")} className={`flex items-center gap-1.5 pb-3 ${activeTab === "cancelados" ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-500"}`}>
          <X className="w-4 h-4" /> Cancelados
        </button>
        <button onClick={() => setActiveTab("passados")} className={`flex items-center gap-1.5 pb-3 ${activeTab === "passados" ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-500"}`}>
          <CalendarDays className="w-4 h-4" /> Passados
        </button>
      </div>

      <div className="mb-6">
        <Input
          icon={<Search className="w-4 h-4 text-gray-400" />}
          placeholder="Pesquisar por nome do psicólogo..." 
          className="max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-4 flex-wrap">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <AppointmentCard
              key={item.id}
              name={item.name}
              role="Psicólogo(a)"
              date={item.date}
              time={item.time}
              status={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              avatarUrl={item.avatarUrl}
              onCancel={item.status === 'confirmada' ? () => handleCancelAppointment(item.id) : undefined}
            />
          ))
        ) : (
          <div className="w-full text-center py-10">
            <p className="text-gray-500">Nenhum atendimento encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
}