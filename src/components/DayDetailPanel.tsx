"use client";

import React, { useState } from "react";
import ConfirmationModal from './ui/confirmartion/ConfirmationModal';
import { X, Pencil, Clock, Calendar as CalendarIcon, Ban } from "lucide-react";

interface Event {
  id: string;
  title: string;
  start: string;
}

interface DayDetailPanelProps {
  day: Date;
  availabilityForDay: string[];
  eventsForDay: Event[];
  onClose: () => void;
  onEdit: () => void;
  onBlockDay: (day: Date) => void;
}

export const DayDetailPanel: React.FC<DayDetailPanelProps> = ({
  day,
  availabilityForDay,
  eventsForDay,
  onClose,
  onEdit,
  onBlockDay,
}) => {
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPastDay = day < today;

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(day);
  
  const handleConfirmBlock = () => {
    onBlockDay(day);
    setConfirmModalOpen(false);
  };

  return (
    <>
      <div className="h-full w-96 flex-shrink-0 bg-white shadow-interface border-l border-gray-200 z-20 flex flex-col p-6 rounded-tr-2xl rounded-br-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Detalhes do Dia</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        <p className="text-md text-gray-600 mb-6 capitalize">{formattedDate}</p>

        <div className="flex-grow overflow-y-auto">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
              <CalendarIcon size={16} className="mr-2"/>Consultas Agendadas
            </h3>
            {eventsForDay.length > 0 ? (
              <ul className="space-y-2">
                {eventsForDay.map(event => (
                  <li key={event.id} className="bg-blue-50 p-3 rounded-md text-sm">
                    <p className="font-medium text-blue-800">{new Date(event.start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-blue-700">{event.title}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                Nenhuma consulta agendada para este dia.
              </p>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
              <Clock size={16} className="mr-2"/>Horários Disponíveis
            </h3>
            {availabilityForDay.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availabilityForDay.sort().map(time => (
                  <span key={time} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {time}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                Nenhum horário disponível para este dia.
              </p>
            )}
          </div>
        </div>

        {!isPastDay && (
          <div className="mt-auto pt-4 border-t border-gray-200 flex flex-col gap-3">
            <button 
              onClick={onEdit}
              className="w-full inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editar Horários
            </button>
            
            <button 
              onClick={() => setConfirmModalOpen(true)}
              className="w-full inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100"
            >
              <Ban className="w-4 h-4 mr-2" />
              Bloquear Dia
            </button>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        title="Confirmar Bloqueio"
        description="Tem certeza que deseja bloquear este dia? Todos os horários disponíveis serão removidos."
        onConfirm={handleConfirmBlock}
        onCancel={() => setConfirmModalOpen(false)}
      />
    </>
  );
};