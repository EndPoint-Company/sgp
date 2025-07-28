'use client';

import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ptBR } from "date-fns/locale";
import { CalendarPlus, CheckCircle } from "lucide-react";
import type { Consulta } from "../types";

// --- DADOS MOCKADOS DE DISPONIBILIDADE ---
// No futuro, estes dados devem vir da sua API para cada psicólogo
const mockAvailability: Record<string, string[]> = {
  "2025-07-28": ["09:00", "10:00", "11:00", "14:00"],
  "2025-07-29": ["09:00", "11:00", "15:00", "16:00"],
  "2025-07-31": ["10:00", "11:00", "14:00"],
  "2025-08-01": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  "2025-08-04": ["14:00", "15:00", "16:00"],
  "2025-08-05": ["09:00", "10:00", "13:00", "15:00"],
  "2025-08-06": ["08:00", "09:30", "11:00", "14:30"],
  "2025-08-07": ["10:00", "12:00", "15:00", "16:30"],
  "2025-08-08": ["09:00", "10:30", "14:00", "16:00"],
  "2025-08-09": ["08:00", "09:00", "13:00", "15:00"],
  "2025-08-10": ["09:00", "11:00", "13:30", "15:00", "16:30"],
  "2025-08-11": ["08:30", "10:00", "14:00", "15:30", "17:00"],
};
// --- FIM DOS DADOS MOCKADOS ---

const formatDateKey = (date: Date) => date.toISOString().split("T")[0];

interface AppointmentRequestFlowProps {
  onConfirm: (data: Omit<Consulta, 'id'>) => Promise<void>;
  onClose: () => void;
  alunoId: string;
  psicologoId: string;
  psicologoNome: string;
}

export function AppointmentRequestFlow({
  onConfirm,
  onClose,
  alunoId,
  psicologoId,
}: AppointmentRequestFlowProps) {
  const [step, setStep] = useState<"selection" | "success">("selection");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [month, setMonth] = useState<Date>(new Date());

  const handleDaySelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setMonth(date);
    setSelectedTime(null);
    const dayKey = formatDateKey(date);
    const timesForDay = mockAvailability[dayKey] || [];
    setAvailableTimes(timesForDay);
  };

  const handleSubmit = async () => {
    if (selectedDate && selectedTime) {
      setIsSubmitting(true);
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const finalDate = new Date(selectedDate);
      finalDate.setHours(hours, minutes);

      try {
        await onConfirm({
          alunoId: alunoId,
          psicologoId: psicologoId,
          horario: finalDate.toISOString(),
          status: 'aguardando_aprovacao'
        });
        setStep("success");
      } catch (error) {
        console.error("Erro ao confirmar agendamento:", error);
        // Opcional: Adicionar um estado de erro para mostrar ao usuário
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const dayPickerStyles = `
    .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: #eff6ff; }
    .rdp-day_selected { background-color: #2563eb !important; color: white !important; border-radius: 8px; }
    .rdp-button { border-radius: 8px; }
    .rdp-head_cell { font-weight: 500; color: #6b7280; }
  `;

  return (
    <div>
      <style>{dayPickerStyles}</style>

      {step === "selection" && (
        <>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 mr-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <CalendarPlus className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Nova Solicitação de Atendimento</h2>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-8">
            <div className="flex items-start justify-center h-[360px]">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDaySelect}
                month={month}
                onMonthChange={setMonth}
                locale={ptBR}
                disabled={[
                  { before: new Date() },
                  (date) => date.getDay() === 0 || date.getDay() === 6,
                  (date) => {
                    const dayKey = formatDateKey(date);
                    return !mockAvailability[dayKey] || mockAvailability[dayKey].length === 0;
                  }
                ]}
              />
            </div>
            <div className="w-full sm:w-48 flex flex-col h-[360px] mt-4 sm:mt-0 sm:border-l border-gray-200 sm:pl-8">
              <h3 className="font-semibold text-gray-700 mb-4 flex-shrink-0">
                {selectedDate ? `Horários disponíveis` : "Selecione um dia"}
              </h3>
              <div className="flex-1 min-h-0 overflow-y-auto pr-2">
                {selectedDate && (
                  <div className="grid grid-cols-3 sm:grid-cols-2 gap-2">
                    {availableTimes.length > 0 ? availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 rounded-md border text-sm transition-colors ${
                          selectedTime === time
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {time}
                      </button>
                    )) : <p className="col-span-full text-sm text-gray-500">Nenhum horário disponível.</p>}
                  </div>
                )}
              </div>
              <div className="mt-auto pt-4 flex-shrink-0">
                <button
                  onClick={handleSubmit}
                  disabled={!selectedTime || isSubmitting}
                  className="w-full h-10 py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {step === "success" && (
        <div className="max-w-sm text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 text-green-600 p-3 rounded-full">
              <CheckCircle size={32} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Solicitação Enviada!</h2>
          <p className="text-gray-600 my-4 text-sm">
            O psicólogo irá analisar seu pedido. Você será notificado sobre a confirmação em "Meus Atendimentos".
          </p>
          <button
            onClick={onClose}
            className="mt-2 h-10 px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Entendido
          </button>
        </div>
      )}
    </div>
  );
}