"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ContinuousCalendar } from "../../../components/ContinuousCalendar";
import { DayDetailPanel } from "../../../components/DayDetailPanel";
import { Modal } from "../../../components/ui/Modal"; 
import { AppointmentRequestFlow } from "../components/AppointmentRequestFlow";
import {
  mockFirebaseData,
  getPsicologoData,
} from "../../psychologist/data/mockApi";
import type { Consulta } from "../../psychologist/services/apiService";
import { CalendarPlus } from "lucide-react";

const formatDateKey = (date: Date) => date.toISOString().split("T")[0];

const ID_ALUNO_LOGADO = "mu3Mo6I0eSSD3aWZdYte"; 

export default function StudentSchedule() {
  const [selectedDayForDetail, setSelectedDayForDetail] = useState<Date | null>(null);
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [consultas, setConsultas] = useState<Consulta[]>(mockFirebaseData); 
  const [isRequestModalOpen, setRequestModalOpen] = useState(false);
  
  const [preselectedDate, setPreselectedDate] = useState<Date | null>(null);

  useEffect(() => {
    setAvailability({
      "2025-07-28": ["09:00", "10:00", "14:00"],
      "2025-07-30": ["11:00"],
      "2025-08-05": ["08:00", "09:00"],
    });
  }, []);

  const userRole = "aluno" as const;

 const userEvents = useMemo(() => 
    consultas.filter(c => c.pacienteId === ID_ALUNO_LOGADO), 
    [consultas]
  );
  
  const handleCreateRequest = (data: { date: Date; time: string; description: string; }) => {
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
    setRequestModalOpen(false); 
  };

  const handleDayClick = (day: Date) => {
    const dayKey = formatDateKey(day);
    const hasEvents = userEvents.some(event => formatDateKey(new Date(event.horario)) === dayKey);

    if (hasEvents) {
      setSelectedDayForDetail(day);
    } else {
      const isAvailable = (availability[dayKey] || []).length > 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isPast = day < today;

      if (isAvailable && !isPast) {
        handleOpenRequestModal(day);
      }
    }
  };
  
  const handleOpenRequestModal = (date?: Date) => {
    if (date) {
      setPreselectedDate(date);
    } else {
      setPreselectedDate(null);
    }
    setRequestModalOpen(true);
  };

  const availabilityForDay = selectedDayForDetail ? availability[formatDateKey(selectedDayForDetail)] || [] : [];

const eventsForDay = selectedDayForDetail
    ? userEvents
        .filter(c => formatDateKey(new Date(c.horario)) === formatDateKey(selectedDayForDetail))
        .map(c => {
          const psicologo = getPsicologoData(c.psicologoId);
          return { 
            id: c.id, 
            start: c.horario, 
            title: `Consulta com ${psicologo?.name || 'Psicólogo(a)'}`,
            status: c.status 
          };
        })
    : [];

  const isSidebarOpen = !!selectedDayForDetail;

  return (
    <>
      <Modal isOpen={isRequestModalOpen} onClose={() => setRequestModalOpen(false)}>
        <AppointmentRequestFlow
          onClose={() => setRequestModalOpen(false)}
          onConfirm={handleCreateRequest}
          initialDate={preselectedDate}
          availability={availability}
        />
      </Modal>

      <div className="relative h-full w-full flex flex-row overflow-hidden rounded-2xl">
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
          <div className="flex-1 min-h-0">
            <ContinuousCalendar
              role={userRole}
              currentUserId={ID_ALUNO_LOGADO}
              events={userEvents}
              availability={availability}
              onDayClick={handleDayClick}
              onAddClick={handleOpenRequestModal}
              className={isSidebarOpen ? "rounded-tr-none" : "rounded-tr-2xl"}
               viewingDay={selectedDayForDetail} 
            />
          </div>

          <div className={`flex-shrink-0 bg-white p-4 border-t border-gray-200 flex justify-end items-center rounded-bl-2xl ${isSidebarOpen ? "rounded-br-none" : "rounded-br-2xl"}`}>
            <button
              onClick={() => handleOpenRequestModal()}
              className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              <CalendarPlus className="w-4 h-4 mr-2" />
              Criar Solicitação
            </button>
          </div>
        </div>
        
        {selectedDayForDetail && (
          <DayDetailPanel
            day={selectedDayForDetail}
            availabilityForDay={availabilityForDay}
            eventsForDay={eventsForDay}
            onClose={() => setSelectedDayForDetail(null)}
          />
        )}
      </div>
    </>
  );
}