import React, { useState, useMemo } from "react";
import AppointmentCard from "../../components/AppointmentCard";
import RequestCard from "../../components/RequestCard";
import {
  mockFirebaseData,
  getPacienteData,
  formatAppointmentDate,
} from "../data/mockApi";
// CORREÇÃO: Adicionada a palavra-chave 'type' para a importação da interface.
import type { Consulta } from "../services/apiService"; // Reutilizamos a tipagem

export default function HomePage() {
  const [consultas, setConsultas] = useState<Consulta[]>(mockFirebaseData);

  const handleUpdateRequest = (consultaId: string) => {
    setConsultas((prevConsultas) =>
      prevConsultas.filter((c) => c.id !== consultaId)
    );
    alert("Ação registrada! A lista foi atualizada.");
  };

  const { upcomingAppointments, pendingRequests } = useMemo(() => {
    const processed = consultas.map((item) => ({
      ...item,
      ...getPacienteData(item.pacienteId),
      ...formatAppointmentDate(item.horario),
    }));

    return {
      upcomingAppointments: processed.filter(
        (item) => item.status === "confirmada"
      ),
      pendingRequests: processed.filter(
        (item) => item.status === "aguardando aprovacao"
      ),
    };
  }, [consultas]); // O useMemo agora depende do estado local 'consultas'

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Próximos Atendimentos</h1>
      <div className="flex gap-4 flex-wrap mb-10">
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map((appt) => (
            <AppointmentCard
              key={appt.id}
              name={appt.name}
              role="Aluno(a)"
              date={appt.date}
              time={appt.time}
              status="Confirmada"
              avatarUrl={appt.avatarUrl}
            />
          ))
        ) : (
          <p className="text-gray-500">Nenhum atendimento agendado.</p>
        )}
      </div>

      <h1 className="text-xl font-bold mb-4">Solicitações</h1>
      <div className="flex gap-4 flex-wrap">
        {pendingRequests.length > 0 ? (
          pendingRequests.map((req) => (
            <RequestCard
              key={req.id}
              name={req.name}
              role="Aluno(a)"
              date={req.date}
              time={req.time}
              avatarUrl={req.avatarUrl}
              onAccept={() => handleUpdateRequest(req.id)}
              onReject={() => handleUpdateRequest(req.id)}
            />
          ))
        ) : (
          <p className="text-gray-500">Nenhuma nova solicitação.</p>
        )}
      </div>
    </div>
  );
}
