// src/components/DayDetailPanel.tsx

import React from "react";
import { X, Clock } from "lucide-react";
import type { Consulta } from "../features/psychologist/services/appointmentService.ts";

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

interface DayDetailPanelProps {
  selectedDate: Date | null;
  availability: string[];
  events: Consulta[];
  onClose: () => void;
  onSetAvailabilityClick: (date: Date) => void;
}

export const DayDetailPanel: React.FC<DayDetailPanelProps> = ({
  selectedDate,
  availability,
  events,
  onClose,
  onSetAvailabilityClick,
}) => {
  if (!selectedDate) return null;

  const formattedDate = `${selectedDate.getDate()} de ${
    monthNames[selectedDate.getMonth()]
  }, ${selectedDate.getFullYear()}`;

  const hasAvailability = availability && availability.length > 0;
  const hasEvents = events && events.length > 0;

  return (
    <div className="w-full md:w-80 lg:w-96 border-l border-gray-200 bg-white flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-800">{formattedDate}</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {hasEvents && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">
              Consultas Agendadas
            </h4>
            <div className="flex flex-col space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="text-sm p-2 rounded-md bg-blue-50 text-blue-800"
                >
                  {event.horario} - Paciente X
                </div>
              ))}
            </div>
          </div>
        )}

        {hasAvailability && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">
              Horários Disponíveis
            </h4>
            <div className="flex flex-wrap gap-2">
              {availability.map((time) => (
                <div
                  key={time}
                  className="text-sm font-semibold py-1 px-2.5 rounded-full bg-gray-100 text-gray-700"
                >
                  {time}
                </div>
              ))}
            </div>
          </div>
        )}

        {!hasAvailability && !hasEvents && (
          <div className="text-center py-10">
            <Clock size={40} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">
              Nenhum horário disponível para este dia.
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => onSetAvailabilityClick(selectedDate)}
          className="w-full h-10 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          {hasAvailability ? "Editar Horários" : "Disponibilizar Horários"}
        </button>
      </div>
    </div>
  );
};
