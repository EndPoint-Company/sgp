import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ptBR } from "date-fns/locale";

const getAvailableTimes = (date: Date): string[] => {
  return [
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];
};

export function AppointmentRequestFlow({ onClose }: { onClose: () => void }) {
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
    console.log({
      date: selectedDate,
      time: selectedTime,
      description: description,
    });
    setStep("success");
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
        <div className="flex flex-col sm:flex-row sm:gap-8">
          <div className="flex items-start justify-center h-[360px]">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDaySelect}
              locale={ptBR}
              disabled={{ before: new Date() }}
            />
          </div>

          <div className="w-full sm:w-48 flex flex-col h-[360px] mt-4 sm:mt-0 sm:border-l border-gray-300 sm:pl-8">
            <h3 className="font-semibold text-gray-700 mb-4 flex-shrink-0">
              {selectedDate ? `Horários disponíveis` : "Selecione um dia"}
            </h3>

            <div className="flex-1 flex flex-col min-h-0">
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
                <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
                  Aguardando seleção...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {step === "description" && (
        <div>
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
      )}

      {step === "success" && (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-green-600">
            Solicitação Enviada com Sucesso!
          </h3>
          <p className="text-gray-600 mt-2">
            O psicólogo irá analisar seu pedido. Você será notificado.
          </p>
          <button
            onClick={onClose}
            className="mt-6 h-10 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}
