"use client";

import React, { useState } from "react";
import ConfirmationModal from './ui/confirmartion/ConfirmationModal';
import { X, Pencil, Clock, Calendar as CalendarIcon, Ban } from "lucide-react";

interface Event {
  id: string;
  title: string;
  start: string;
  status: 'aguardando aprovacao' | 'confirmada' | 'cancelada' | 'passada';
}

interface DayDetailPanelProps {
  day: Date;
  availabilityForDay: string[];
  eventsForDay: Event[];
  onClose: () => void;
  onEdit?: () => void;
  onBlockDay?: (day: Date) => void;
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
    // Só chama onBlockDay se ela existir
    if (onBlockDay) {
      onBlockDay(day);
    }
    setConfirmModalOpen(false);
  };

  const getStatusChip = (status: Event['status']) => {
    const styles = {
      confirmada: 'bg-green-100 text-green-800',
      'aguardando aprovacao': 'bg-yellow-100 text-yellow-800',
      cancelada: 'bg-red-100 text-red-800',
      passada: 'bg-gray-100 text-gray-800'
    };
    const text = {
      confirmada: 'Confirmada',
      'aguardando aprovacao': 'Pendente',
      cancelada: 'Cancelada',
      passada: 'Realizada'
    }
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{text[status]}</span>;
  }


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
                  <li key={event.id} className="bg-slate-50 p-3 rounded-md text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium text-gray-600">{new Date(event.start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                      {getStatusChip(event.status)}
                    </div>
                    <p className="text-gray-700 font-medium">{event.title}</p>
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
        
        {!isPastDay && onEdit && onBlockDay && (
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
              className="w-full inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-700"
            >
              <Ban className="w-4 h-4 mr-2" />
              Bloquear Dia
            </button>
          </div>
        )}
      </div>

      {onBlockDay && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          title="Confirmar Bloqueio"
          description="Tem certeza que deseja bloquear este dia? Todos os horários disponíveis serão removidos."
          onConfirm={handleConfirmBlock}
          onCancel={() => setConfirmModalOpen(false)}
        />
      )}
    </>
  );
};