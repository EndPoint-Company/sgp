import React, { useState, useMemo } from "react";
import { ContinuousCalendar } from "../../../components/ui/calender/ContinuousCalendar";
import { TimeSelectionPanel } from "../../../components/ui/calender/TimeSelectionPanel";
import { DayDetailPanel } from "../../../components/ui/calender/DayDetailPanel";
import { CalendarCheck, X, Check, ArrowRightLeft } from "lucide-react";
import type { Consulta } from "../../appointments/types";

// Define um tipo para a consulta após ser processada com o nome do participante
type ProcessedConsulta = Consulta & {
  participantName: string;
};

// NOVO: Define o tipo de status que os componentes filhos esperam (com espaço)
type ChildComponentStatus = 'aguardando aprovacao' | 'confirmada' | 'cancelada' | 'passada';


// Props que o componente de gestão da agenda aceita,
interface ScheduleManagerProps {
  userRole: "student" | "psychologist";
  currentUserId: string;
  consultas: ProcessedConsulta[]; // Espera receber as consultas já processadas
  availability: Record<string, string[]>;
  setAvailability: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
  onShowToast: (message: string) => void;
}

export default function ScheduleManager({
  userRole,
  currentUserId,
  consultas,
  availability,
  setAvailability,
  onShowToast,
}: ScheduleManagerProps) {
  // --- ESTADO INTERNO DO COMPONENTE DE UI ---
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [pendingSelectedDays, setPendingSelectedDays] = useState<Date[]>([]);
  const [isTimePanelOpen, setIsTimePanelOpen] = useState(false);
  const [selectedDayForDetail, setSelectedDayForDetail] = useState<Date | null>(
    null
  );
  const [selectionType, setSelectionType] = useState<"single" | "interval">(
    "single"
  );
  const [intervalPhase, setIntervalPhase] = useState<
    "none" | "selecting-start" | "selecting-end"
  >("none");
  const [startDate, setStartDate] = useState<Date | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const formatDateKey = (date: Date) => date.toISOString().split("T")[0];

  // --- MANIPULADORES DE EVENTOS (HANDLERS) ---
  const handleDayClick = (day: Date) => {
    if (isSelectionMode) return;
    const dayKey = formatDateKey(day);
    const isAvailable = (availability[dayKey] || []).length > 0;
    const hasEvents = consultas.some(
      (event) => formatDateKey(new Date(event.horario)) === dayKey
    );
    if (isAvailable || hasEvents) {
      setSelectedDayForDetail(day);
    }
  };

  const handlePendingDaySelect = (day: Date) => {
    if (day < today) return;
    const dayKey = formatDateKey(day);
    if ((availability[dayKey] || []).length > 0) return;

    if (selectionType === "single") {
      const existingIndex = pendingSelectedDays.findIndex(
        (d) => d.getTime() === day.getTime()
      );
      if (existingIndex > -1) {
        setPendingSelectedDays(
          pendingSelectedDays.filter((_, index) => index !== existingIndex)
        );
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

        for (
          let d = new Date(minDate);
          d <= maxDate;
          d.setDate(d.getDate() + 1)
        ) {
          const dayOfWeek = d.getDay();
          const currentDayKey = formatDateKey(d);
          const isAlreadyAvailable =
            (availability[currentDayKey] || []).length > 0;
          if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isAlreadyAvailable) {
            newSelectedDays.push(new Date(d));
          }
        }
        setPendingSelectedDays(newSelectedDays);
        setIntervalPhase("none");
      }
    }
  };

  const handleFinalSave = (
    newlyAddedAvailability: Record<string, string[]>
  ) => {
    const firstDayKey =
      pendingSelectedDays.length > 0
        ? formatDateKey(pendingSelectedDays[0])
        : null;
    const isEditMode = firstDayKey
      ? (availability[firstDayKey] || []).length > 0
      : false;

    setAvailability((prev) => ({ ...prev, ...newlyAddedAvailability }));
    setPendingSelectedDays([]);
    setIsTimePanelOpen(false);

    if (isEditMode && firstDayKey) {
      const editedDay = new Date(firstDayKey + "T12:00:00");
      setSelectedDayForDetail(editedDay);
      onShowToast("Horários atualizados!");
    } else {
      onShowToast("Novos horários disponibilizados!");
    }
  };

  const handleBlockDay = (dayToBlock: Date) => {
    const dayKey = formatDateKey(dayToBlock);
    setAvailability((prev) => ({ ...prev, [dayKey]: [] }));
    setSelectedDayForDetail(null);
    onShowToast("Dia bloqueado com sucesso!");
  };

  const handleEditDay = () => {
    if (!selectedDayForDetail) return;
    setPendingSelectedDays([selectedDayForDetail]);
    setSelectedDayForDetail(null);
    setIsTimePanelOpen(true);
  };

  const handleCloseTimePanel = () => {
    setIsTimePanelOpen(false);
    setPendingSelectedDays([]);
    setStartDate(null);
    setIntervalPhase("none");
  };

  const getInstructionText = () => {
    if (selectionType === "interval") {
      if (intervalPhase === "selecting-start")
        return "Selecione o dia de início";
      if (intervalPhase === "selecting-end") return "Selecione o dia de fim";
    }
    return `${pendingSelectedDays.length} dias selecionados`;
  };

  const isSidebarOpen = isTimePanelOpen || !!selectedDayForDetail;
  
  const calendarRole = userRole === 'student' ? 'aluno' : 'psicologo';

  // Transforma os dados para o formato que os componentes filhos esperam
  const calendarEvents = useMemo(() => {
    return consultas.map(c => ({
      ...c,
      pacienteId: c.alunoId, 
      // CORRIGIDO: Converte o status para o tipo esperado, sem usar 'any'
      status: c.status,
    }));
  }, [consultas]);

  const detailPanelEvents = useMemo(() => {
    if (!selectedDayForDetail) return [];
    return consultas
      .filter(c => formatDateKey(new Date(c.horario)) === formatDateKey(selectedDayForDetail))
      .map(c => ({
        ...c,
        title: `Consulta com ${c.participantName}`,
        start: c.horario,
        // CORRIGIDO: Converte o status para o tipo esperado, sem usar 'any'
        status: (c.status === 'concluida' ? 'passada' : c.status.replace('_', ' ')) as ChildComponentStatus,
      }));
  }, [consultas, selectedDayForDetail]);

  return (
    <div className="relative h-full w-full flex flex-row overflow-hidden rounded-2xl">
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <div className="flex-1 min-h-0">
          <ContinuousCalendar
            role={calendarRole}
            events={calendarEvents}
            availability={availability}
            isSelectionMode={isSelectionMode}
            selectedPendingDays={pendingSelectedDays}
            viewingDay={selectedDayForDetail}
            onDayClick={handleDayClick}
            onPendingDaySelect={handlePendingDaySelect}
            className={isSidebarOpen ? "rounded-tr-none" : "rounded-tr-2xl"}
            currentUserId={currentUserId}
          />
        </div>

        {userRole === "psychologist" && (
          <div
            className={`flex-shrink-0 bg-white p-4 border-t border-gray-200 flex justify-between items-center rounded-bl-2xl ${
              isSidebarOpen ? "rounded-br-none" : "rounded-br-2xl"
            }`}
          >
            {isSelectionMode ? (
              <>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600">
                    {getInstructionText()}
                  </span>
                  <button
                    onClick={() => {
                      setSelectionType((prev) =>
                        prev === "single" ? "interval" : "single"
                      );
                      setIntervalPhase("selecting-start");
                      setPendingSelectedDays([]);
                      setStartDate(null);
                    }}
                    className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-white text-gray-800 border border-gray-300 text-sm font-medium hover:bg-gray-50"
                  >
                    <ArrowRightLeft size={14} className="mr-2" />
                    {selectionType === "single"
                      ? "Selecionar Intervalo"
                      : "Selecionar um a um"}
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsSelectionMode(false);
                      setPendingSelectedDays([]);
                      setStartDate(null);
                      setIntervalPhase("none");
                    }}
                    className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-white text-gray-800 border border-gray-300 text-sm font-medium hover:bg-gray-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      if (pendingSelectedDays.length > 0)
                        setIsTimePanelOpen(true);
                      setIsSelectionMode(false);
                    }}
                    disabled={pendingSelectedDays.length === 0}
                    className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Próximo
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full flex justify-end">
                <button
                  onClick={() => setIsSelectionMode(true)}
                  className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                >
                  <CalendarCheck className="w-4 h-4 mr-2" />
                  Disponibilizar Datas
                </button>
              </div>
            )}
          </div>
        )}
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
          availabilityForDay={
            availability[formatDateKey(selectedDayForDetail)] || []
          }
          eventsForDay={detailPanelEvents}
          onClose={() => setSelectedDayForDetail(null)}
          onEdit={handleEditDay}
          onBlockDay={handleBlockDay}
        />
      )}
    </div>
  );
}