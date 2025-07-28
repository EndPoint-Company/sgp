// /src/components/AvailabilityModal.tsx

"use client";

import React, { useState } from "react";
import { DayPicker, type SelectHandler } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";

// Horários que o psicólogo pode disponibilizar
const availableHours = [
  "08:00", "09:00", "10:00", "11:00",
  "13:30", "14:30", "15:30", "16:30",
];

interface AvailabilityModalProps {
  onClose: () => void;
  onSave: (availability: Record<string, string[]>) => void;
  initialAvailability?: Record<string, string[]>;
}

export function AvailabilityModal({ onClose, onSave, initialAvailability = {} }: AvailabilityModalProps) {
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);

  const [selectedTimes, setSelectedTimes] = useState<Record<string, Set<string>>>(() => {
    const initialState: Record<string, Set<string>> = {};
    for (const date in initialAvailability) {
      initialState[date] = new Set(initialAvailability[date]);
    }
    return initialState;
  });

 const handleDaySelect = (days: Date[] | undefined) => {
  setSelectedDays(days || []);
};

  const handleTimeToggle = (day: Date, time: string) => {
    const dateString = day.toISOString().split('T')[0];
    const newTimes = { ...selectedTimes };
    
    if (!newTimes[dateString]) {
      newTimes[dateString] = new Set();
    }

    if (newTimes[dateString].has(time)) {
      newTimes[dateString].delete(time);
    } else {
      newTimes[dateString].add(time);
    }
    
    setSelectedTimes(newTimes);
  };

  const handleSaveClick = () => {
    const availabilityToSave: Record<string, string[]> = {};
    for (const date in selectedTimes) {
      if (selectedTimes[date].size > 0) {
        availabilityToSave[date] = Array.from(selectedTimes[date]);
      }
    }
    onSave(availabilityToSave);
  };
  
  const dayPickerStyles = `
    .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: #eff6ff; }
    .rdp-day_selected { background-color: #2563eb !important; color: white !important; border-radius: 8px; }
    .rdp-button { border-radius: 8px; }
  `;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <style>{dayPickerStyles}</style>
      <div className="bg-white rounded-xl shadow-lg p-6 w-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Disponibilizar Horários</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex gap-8">
          <div className="flex items-start justify-center h-[300px]">
            <DayPicker
            mode="multiple"
            min={0}
            selected={selectedDays}
            onSelect={handleDaySelect}
            locale={ptBR}
            disabled={[
                { before: new Date() }, 
                (date) => date.getDay() === 0 || date.getDay() === 6 
            ]}
            />
        </div>
          
          <div className="w-48 border-l border-gray-200 pl-8">
            <h3 className="font-semibold text-gray-700 mb-4">Horários</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableHours.map(time => {
                const isSelected = selectedDays.some(day => 
                  selectedTimes[day.toISOString().split('T')[0]]?.has(time)
                );
                
                return (
                  <button
                    key={time}
                    disabled={selectedDays.length === 0}
                    onClick={() => selectedDays.forEach(day => handleTimeToggle(day, time))}
                    className={`p-2 rounded-md border text-sm transition-colors
                      ${isSelected ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 hover:bg-gray-100"}
                      ${selectedDays.length === 0 ? "disabled:bg-gray-200 disabled:cursor-not-allowed" : ""}
                    `}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="h-10 px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveClick}
            className="h-10 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}