import React, { useState, useMemo } from "react";
import AppointmentCard from "../../components/AppointmentCard";
import {
  mockFirebaseData,
  getPsicologoData,
  formatAppointmentDate,
} from "../../psychologist/data/mockApi";
import type { Consulta } from "../../psychologist/services/apiService";
import { Plus, CalendarPlus } from "lucide-react";
import { Modal } from "../../../components/ui/Modal";
import { AppointmentRequestFlow } from "./components/AppointmentRequestFlow";

const ID_ALUNO_LOGADO = "mu3Mo6I0eSSD3aWZdYte";

export default function StudentHomePage() {
  const [consultas, setConsultas] = useState<Consulta[]>(mockFirebaseData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancelAppointment = (consultaId: string) => {
    setConsultas((prevConsultas) =>
      prevConsultas.map((c) =>
        c.id === consultaId ? { ...c, status: "cancelada" } : c
      )
    );
    alert("Seu atendimento foi cancelado.");
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

    setConsultas((prevConsultas) => [...prevConsultas, novaConsulta]);
  };

  const { upcomingAppointments, pendingRequests } = useMemo(() => {
    const studentConsultas = consultas.filter(
      (c) => c.pacienteId === ID_ALUNO_LOGADO
    );
    const processed = studentConsultas
      .map((item) => {
        const psicologoData = getPsicologoData(item.psicologoId);
        if (!psicologoData) return null;
        return {
          ...item,
          ...psicologoData,
          ...formatAppointmentDate(item.horario),
        };
      })
      .filter(Boolean) as (Consulta & {
      name: string;
      avatarUrl: string;
      date: string;
      time: string;
    })[];
    return {
      upcomingAppointments: processed.filter(
        (item) => item.status === "confirmada"
      ),
      pendingRequests: processed.filter(
        (item) => item.status === "aguardando aprovacao"
      ),
    };
  }, [consultas]);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AppointmentRequestFlow
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleCreateRequest}
        />
      </Modal>

      <div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Próximos Atendimentos</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar solicitação
          </button>
        </div>

        <div className="flex gap-4 flex-wrap mb-10">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                name={appt.name}
                role="Psicólogo(a)"
                date={appt.date}
                time={appt.time}
                status="Confirmada"
                avatarUrl={appt.avatarUrl}
                onCancel={() => handleCancelAppointment(appt.id)}
              />
            ))
          ) : (
            <p className="text-gray-500">Nenhum atendimento agendado.</p>
          )}
        </div>

        <h2 className="text-xl font-bold mb-4">Solicitações</h2>
        <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((req) => (
              <AppointmentCard
                key={req.id}
                name={req.name}
                role="Psicólogo(a)"
                date={req.date}
                time={req.time}
                status="Pendente"
                avatarUrl={req.avatarUrl}
              />
            ))
          ) : (
            <div className="w-full flex flex-col items-center justify-center text-center bg-white border-2 border-dashed border-gray-300 rounded-xl p-8">
              <h3 className="text-lg font-medium text-gray-800">
                Nenhuma solicitação
              </h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                Você não possui solicitações de agendamento pendentes.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar solicitação
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
