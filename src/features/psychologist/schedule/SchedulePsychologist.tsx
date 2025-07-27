"use client";

import React, { useRef, useState } from "react";
import { ContinuousCalendar } from "../../../components/ContinuousCalendar";
import { mockFirebaseData, getPacienteData } from "../data/mockApi"; 
import type { Consulta } from "../services/apiService"; 
import { CalendarCheck, X, Check, ArrowRightLeft } from "lucide-react";
import { TimeSelectionPanel } from "../../../components/TimeSelectionPanel";
import { DayDetailPanel } from "../../../components/DayDetailPanel";
import { Toast } from "../../../components/Toast";

type SelectionMode = "single" | "interval";
type IntervalPhase = "none" | "selecting-start" | "selecting-end";

const formatDateKey = (date: Date) => date.toISOString().split("T")[0];

const today = new Date();
today.setHours(0, 0, 0, 0);

export default function Schedule() {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [pendingSelectedDays, setPendingSelectedDays] = useState<Date[]>([]);
  const [isTimePanelOpen, setIsTimePanelOpen] = useState(false);
  const [selectedDayForDetail, setSelectedDayForDetail] = useState<Date | null>(null);
  const [selectionType, setSelectionType] = useState<SelectionMode>("single");
  const [intervalPhase, setIntervalPhase] = useState<IntervalPhase>("none");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [availability, setAvailability] = useState<Record<string, string[]>>({});

const [toast, setToast] = useState({ isVisible: false, message: '' });
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const userRole = "psicologo" as const;
  const currentUserId = "CRsiWje2vKiLsr5fCpxW";

  const userEvents: Consulta[] = mockFirebaseData.filter(
      (event) => event.psicologoId === currentUserId && event.status === 'confirmada'
  );

  const handleBlockDay = (dayToBlock: Date) => {
    const dayKey = formatDateKey(dayToBlock);

    setAvailability(prev => {
      const newAvailability = { ...prev };
      newAvailability[dayKey] = []; 
      return newAvailability;
    });

    setSelectedDayForDetail(null);
    
    showToast("Dia bloqueado com sucesso!");
  };
  
const showToast = (message: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ isVisible: true, message });
    toastTimerRef.current = setTimeout(() => {
      setToast({ isVisible: false, message: '' });
    }, 3000);
  };

const handleDayClick = (day: Date) => {
    if (isSelectionMode) return;

    const dayKey = formatDateKey(day);

    const isAvailable = (availability[dayKey] || []).length > 0;

    const hasEvents = userEvents.some(event => formatDateKey(new Date(event.horario)) === dayKey);

    if (isAvailable || hasEvents) {
        setSelectedDayForDetail(day);
    }
};
  
  const handleEditDay = () => {
    if (!selectedDayForDetail) return;
    
    setPendingSelectedDays([selectedDayForDetail]);
    setSelectedDayForDetail(null);
    setIsTimePanelOpen(true);
  };

  const handlePendingDaySelect = (day: Date) => {
     if (day < today) {
      return; 
    }

const dayKey = formatDateKey(day);
    if ((availability[dayKey] || []).length > 0) {
      return;
    }

    if (selectionType === "single") {
      const existingIndex = pendingSelectedDays.findIndex((d) => d.getTime() === day.getTime());
      if (existingIndex > -1) {
        setPendingSelectedDays(pendingSelectedDays.filter((_, index) => index !== existingIndex));
      } else {
        setPendingSelectedDays([...pendingSelectedDays, day]);
      }
    } else if (selectionType === "interval") {
      if (intervalPhase === "selecting-start") {
        setStartDate(day);
        setPendingSelectedDays([day]);
        setIntervalPhase("selecting-end");
      } else if (intervalPhase === "selecting-end" && startDate) {
        const start = startDate.getTime();
        const end = day.getTime();
        const newSelectedDays: Date[] = [];
        const minDate = new Date(Math.min(start, end));
        const maxDate = new Date(Math.max(start, end));
        
        for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
          const dayOfWeek = d.getDay();

          const currentDayKey = formatDateKey(d);
          const isAlreadyAvailable = (availability[currentDayKey] || []).length > 0;

          if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isAlreadyAvailable) {
            newSelectedDays.push(new Date(d));
          }
        }
        setPendingSelectedDays(newSelectedDays);
        setIntervalPhase("none");
      }
    }
  };

  const handleEnterSelectionMode = () => { setIsSelectionMode(true); setSelectionType("single"); };
  const handleCancelSelection = () => { setIsSelectionMode(false); setPendingSelectedDays([]); setStartDate(null); setIntervalPhase("none"); };
  const toggleSelectionType = () => {
    if (selectionType === "single") {
      setSelectionType("interval");
      setIntervalPhase("selecting-start");
    } else {
      setSelectionType("single");
      setIntervalPhase("none");
    }
    setPendingSelectedDays([]);
    setStartDate(null);
  };

  const handleSaveSelection = () => { if (pendingSelectedDays.length === 0) return; setIsTimePanelOpen(true); setIsSelectionMode(false); };

const handleFinalSave = (newlyAddedAvailability: Record<string, string[]>) => {
    const firstDayKey = pendingSelectedDays.length > 0 ? formatDateKey(pendingSelectedDays[0]) : null;
    const isEditMode = firstDayKey ? (availability[firstDayKey] || []).length > 0 : false;

    setAvailability((prev) => ({ ...prev, ...newlyAddedAvailability }));

    setPendingSelectedDays([]);
    setIsTimePanelOpen(false);

    if (isEditMode && firstDayKey) {
      const editedDay = new Date(firstDayKey + 'T12:00:00'); 
      setSelectedDayForDetail(editedDay);
      showToast("Horários atualizados!");
    } else {
      showToast("Novos horários disponibilizados!");
    }
};

const handleCloseTimePanel = () => {
    setIsTimePanelOpen(false); 
    setPendingSelectedDays([]);
    setStartDate(null);       
    setIntervalPhase("none");
  };

  const getInstructionText = () => {
    if (selectionType === "interval") {
      if (intervalPhase === "selecting-start") return "Selecione o dia de início";
      if (intervalPhase === "selecting-end") return "Selecione o dia de fim";
    }
    return `${pendingSelectedDays.length} dias selecionados`;
  };
  
  const availabilityForDay = selectedDayForDetail ? availability[formatDateKey(selectedDayForDetail)] || [] : [];
    
  const eventsForDay = selectedDayForDetail
    ? userEvents
        .filter(consulta => formatDateKey(new Date(consulta.horario)) === formatDateKey(selectedDayForDetail))
        .map(consulta => {
          const paciente = getPacienteData(consulta.pacienteId);
          return {
              id: consulta.id,
              start: consulta.horario, 
              title: `Consulta com ${paciente?.name || 'Paciente'}`,
              status: consulta.status as 'aguardando aprovacao' | 'confirmada' | 'cancelada' | 'passada'
          };
        })
    : [];

    const isSidebarOpen = isTimePanelOpen || !!selectedDayForDetail;

  return (
    <div className="relative h-full w-full flex flex-row overflow-hidden rounded-2xl">
      
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">

        <div className="flex-1 min-h-0">
          <ContinuousCalendar
            role="psicologo"

            events={userEvents}
            availability={availability}

            isSelectionMode={isSelectionMode}
            selectedPendingDays={pendingSelectedDays}
            viewingDay={selectedDayForDetail}

            onDayClick={handleDayClick}
            onPendingDaySelect={handlePendingDaySelect}

            className={isSidebarOpen ? "rounded-tr-none" : "rounded-tr-2xl"} currentUserId={""}          />
        </div>

        <div className={` flex-shrink-0 bg-white p-4 border-t border-gray-200 
          flex justify-between items-center rounded-bl-2xl
          ${isSidebarOpen ? "rounded-br-none" : "rounded-br-2xl"} `}>
           {isSelectionMode ? (
            <>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600">{getInstructionText()}</span>
                <button onClick={toggleSelectionType} className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-white text-gray-800 border border-gray-300 text-sm font-medium hover:bg-gray-50">
                  <ArrowRightLeft size={14} className="mr-2" />
                  {selectionType === "single" ? "Selecionar Intervalo" : "Selecionar um a um"}
                </button>
              </div>
              <div className="flex gap-3">
                <button onClick={handleCancelSelection} className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-white text-gray-800 border border-gray-300 text-sm font-medium hover:bg-gray-50">
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </button>
                <button onClick={handleSaveSelection} disabled={pendingSelectedDays.length === 0} className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300">
                  <Check className="w-4 h-4 mr-2" />
                  Próximo
                </button>
              </div>
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button onClick={handleEnterSelectionMode} className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
                <CalendarCheck className="w-4 h-4 mr-2" />
                Disponibilizar Datas
              </button>
            </div>
          )}
        </div>
      </div>

      {isTimePanelOpen && (
        <TimeSelectionPanel
          selectedDays={pendingSelectedDays}
          onClose={handleCloseTimePanel}
          onSave={handleFinalSave}
          initialAvailability={availability}
        />
      )}
      
      {selectedDayForDetail && (
        <DayDetailPanel
          day={selectedDayForDetail}
          availabilityForDay={availabilityForDay}
          eventsForDay={eventsForDay}
          onClose={() => setSelectedDayForDetail(null)}
          onEdit={handleEditDay}
          onBlockDay={handleBlockDay} 
        />
      )}

      <Toast message={toast.message} isVisible={toast.isVisible} />
    </div>
  );
}