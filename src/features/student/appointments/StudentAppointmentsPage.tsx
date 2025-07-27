import React, { useState, useMemo } from "react";
import AppointmentCard from "../../components/AppointmentCard";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Modal } from "../../../components/ui/Modal";
import { AppointmentRequestFlow } from "../components/AppointmentRequestFlow";
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
import {
  mockFirebaseData,
  getPsicologoData,
  formatAppointmentDate,
} from "../../psychologist/data/mockApi";
import type { Consulta } from "../../psychologist/services/apiService";

const ID_ALUNO_LOGADO = "mu3Mo6I0eSSD3aWZdYte";

export default function StudentAppointmentsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "agendados" | "solicitacoes" | "cancelados" | "passados"
  >("agendados");
  const [consultas, setConsultas] = useState<Consulta[]>(mockFirebaseData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancelAppointment = (consultaId: string) => {
    setConsultas((prev) =>
      prev.map((c) => (c.id === consultaId ? { ...c, status: "cancelada" } : c))
    );
  };

  const handleCreateRequest = (data: {
    date: Date;
    time: string;
    description: string;
  }) => {
    const [hours, minutes] = data.time.split(":");
    const newDate = new Date(data.date);
    newDate.setHours(parseInt(hours), parseInt(minutes));
    const novaConsulta: Consulta = {
      id: `new_${Math.random().toString(36).substr(2, 9)}`,
      pacienteId: ID_ALUNO_LOGADO,
      psicologoId: "CRsiWje2vKiLsr5fCpxW",
      horario: newDate.toISOString(),
      status: "aguardando aprovacao",
    };
    setConsultas((prev) => [...prev, novaConsulta]);
  };

  const listsByStatus = useMemo(() => {
    const studentConsultas = consultas.filter(
      (c) => c.pacienteId === ID_ALUNO_LOGADO
    );
    const processed = studentConsultas.map((item) => {
      const psicologo = getPsicologoData(item.psicologoId);
      const schedule = formatAppointmentDate(item.horario);
      const displayStatus =
        item.status === "aguardando aprovacao"
          ? "Pendente"
          : item.status.charAt(0).toUpperCase() + item.status.slice(1);

      return { ...item, ...psicologo, ...schedule, status: displayStatus };
    });

    const now = new Date();
    return {
      agendados: processed.filter((item) => item.status === "Confirmada"),
      solicitacoes: processed.filter((item) => item.status === "Pendente"),
      cancelados: processed.filter((item) => item.status === "Cancelada"),
      passados: processed.filter(
        (item) => new Date(item.horario) < now && item.status === "Passada"
      ),
    };
  }, [consultas]);

  const filteredData = useMemo(() => {
    const currentList = listsByStatus[activeTab] || [];
    if (!search) return currentList;
    return currentList.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [activeTab, search, listsByStatus]);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AppointmentRequestFlow
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleCreateRequest}
        />
      </Modal>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Meus Atendimentos</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Criar solicitação
          </Button>
        </div>

        <div className="flex items-center gap-6 border-b border-gray-200 mb-6 text-sm">
          <button
            onClick={() => setActiveTab("agendados")}
            className={`flex items-center gap-1.5 pb-3 ${
              activeTab === "agendados"
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            <Check className="w-4 h-4" /> Agendados
          </button>
          <button
            onClick={() => setActiveTab("solicitacoes")}
            className={`flex items-center gap-1.5 pb-3 ${
              activeTab === "solicitacoes"
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            <RefreshCw className="w-4 h-4" /> Solicitações
          </button>
          <button
            onClick={() => setActiveTab("cancelados")}
            className={`flex items-center gap-1.5 pb-3 ${
              activeTab === "cancelados"
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            <X className="w-4 h-4" /> Cancelados
          </button>
          <button
            onClick={() => setActiveTab("passados")}
            className={`flex items-center gap-1.5 pb-3 ${
              activeTab === "passados"
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            <CalendarDays className="w-4 h-4" /> Passados
          </button>
        </div>

        <div className="flex flex-wrap md:flex-nowrap md:items-center justify-between gap-4 mb-6">
          <Input
            icon={<Search className="w-4 h-4 text-gray-400" />}
            placeholder="Pesquisar por nome do psicólogo..."
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

        <div className="flex gap-4 flex-wrap">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <AppointmentCard
                key={item.id}
                name={item.name}
                role="Psicólogo(a)"
                date={item.date}
                time={item.time}
                status={item.status}
                avatarUrl={item.avatarUrl}
                onCancel={
                  item.status === "Confirmada"
                    ? () => handleCancelAppointment(item.id)
                    : undefined
                }
              />
            ))
          ) : (
            <div className="col-span-full text-center">
              <p className="text-gray-500">
                Nenhum atendimento encontrado nesta categoria.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
