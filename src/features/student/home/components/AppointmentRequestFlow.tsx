import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ptBR } from "date-fns/locale";
import { X, CalendarPlus, CheckCircle } from "lucide-react";

const getAvailableTimes = (date: Date): string[] => {
  return [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "13:30",
    "14:30",
    "15:30",
    "16:30",
  ];
};

type AppointmentRequestFlowProps = {
  onClose: () => void;
  onConfirm: (data: { date: Date; time: string; description: string }) => void;
};

export function AppointmentRequestFlow({
  onClose,
  onConfirm,
}: AppointmentRequestFlowProps) {
  const [step, setStep] = useState<"selection" | "description" | "success">(
    "selection"
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  const handleDaySelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setSelectedTime(null);
    setAvailableTimes(getAvailableTimes(date));
  };

  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      onConfirm({
        date: selectedDate,
        time: selectedTime,
        description: description,
      });
    }
    setStep("success");
  };

  const dayPickerStyles = `
    .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: #eff6ff; }
    .rdp-day_selected { background-color: #2563eb !important; color: white !important; border-radius: 8px; }
    .rdp-button { border-radius: 8px; }
    .rdp-head_cell { font-weight: 500; color: #6b7280; }
  `;

  const renderDefaultHeader = (title: string) => (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3 mr-4">
        <div className="bg-blue-100 p-2 rounded-full">
          <CalendarPlus className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 p-1 rounded-full"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <div>
      <style>{dayPickerStyles}</style>

      {step === "selection" && (
        <>
          {renderDefaultHeader("Nova Solicitação de Atendimento")}
          <div className="flex flex-col sm:flex-row sm:gap-8">
            <div className="flex items-start justify-center h-[360px]">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDaySelect}
                locale={ptBR}
                disabled={[
                  { before: new Date() },
                  (date: Date) => date.getDay() === 0 || date.getDay() === 6,
                ]}
              />
            </div>
            <div className="w-full sm:w-48 flex flex-col h-[360px] mt-4 sm:mt-0 sm:border-l border-gray-300 sm:pl-8">
              <h3 className="font-semibold text-gray-700 mb-4 flex-shrink-0">
                {selectedDate ? `Horários disponíveis` : "Selecione um dia"}
              </h3>
              <div
                className={`flex flex-1 min-h-0 ${
                  selectedDate ? "flex-col" : "items-center justify-center"
                }`}
              >
                {selectedDate ? (
                  <>
                    <div className="flex-1 overflow-y-auto pr-2">
                      <div className="grid grid-cols-3 sm:grid-cols-2 gap-2">
                        {availableTimes.map((time) => (
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
                        ))}
                      </div>
                    </div>
                    <div className="mt-auto pt-4 flex-shrink-0">
                      <button
                        onClick={() => setStep("description")}
                        disabled={!selectedTime}
                        className="w-full h-10 py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        Próximo
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">Aguardando seleção...</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {step === "description" && (
        <>
          {renderDefaultHeader("Nova Solicitação de Atendimento")}
          <div className="max-w-lg">
            <div className="mb-4">
              <p className="text-sm text-gray-600">Você está agendando para:</p>
              <p className="font-semibold">
                {selectedDate?.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                })}{" "}
                às {selectedTime}
              </p>
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Descreva o motivo da consulta (opcional)
            </p>
            <textarea
              placeholder="Ex: Gostaria de falar sobre ansiedade e provas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setStep("selection")}
                className="h-10 px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={handleSubmit}
                className="h-10 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Enviar Solicitação
              </button>
            </div>
          </div>
        </>
      )}

      {step === "success" && (
        <div className="max-w-sm">
          <div className=" flex items-center gap-3 mb-4">
            <div className="bg-green-100 text-green-600 p-2 rounded-full">
              <CheckCircle size={24} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Solicitação Enviada!
            </h2>
          </div>
          <p className="text-gray-600 mb-6 text-sm">
            O psicólogo irá analisar seu pedido de agendamento. Você será
            notificado sobre a confirmação.
          </p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="mt-2 h-10 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
