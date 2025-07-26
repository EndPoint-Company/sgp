'use client';

import React, { useState } from 'react';
import { ContinuousCalendar } from "../../../components/ContinuousCalendar"; 
import { mockFirebaseData } from '../data/mockApi';
import { CalendarCheck, X, Check, ArrowRightLeft } from 'lucide-react';
import { DayDetailPanel } from '../../../components/DayDetailPanel';

type SelectionMode = 'single' | 'interval';
type IntervalPhase = 'none' | 'selecting-start' | 'selecting-end';

export default function Schedule() {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [pendingSelectedDays, setPendingSelectedDays] = useState<Date[]>([]);
  const [isTimePanelOpen, setIsTimePanelOpen] = useState(false);

const [selectionType, setSelectionType] = useState<SelectionMode>('single');
  const [intervalPhase, setIntervalPhase] = useState<IntervalPhase>('none');
  const [startDate, setStartDate] = useState<Date | null>(null);

   const [availability, setAvailability] = useState<Record<string, string[]>>({});

const userRole = 'psicologo' as const;
const currentUserId = "CRsiWje2vKiLsr5fCpxW"; 

const userEvents = mockFirebaseData.filter(event => 
    event.psicologoId === currentUserId
  );

  

const handlePendingDaySelect = (day: Date) => {
    if (selectionType === 'single') {
      const existingIndex = pendingSelectedDays.findIndex(d => d.getTime() === day.getTime());
      if (existingIndex > -1) {
        setPendingSelectedDays(pendingSelectedDays.filter((_, index) => index !== existingIndex));
      } else {
        setPendingSelectedDays([...pendingSelectedDays, day]);
      }
    } else if (selectionType === 'interval') {
      if (intervalPhase === 'selecting-start') {
        setStartDate(day);
        setPendingSelectedDays([day]);
        setIntervalPhase('selecting-end');
      } else if (intervalPhase === 'selecting-end' && startDate) {
        const start = startDate.getTime();
        const end = day.getTime();
        const newSelectedDays: Date[] = [];
        const minDate = new Date(Math.min(start, end));
        const maxDate = new Date(Math.max(start, end));

        for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
          newSelectedDays.push(new Date(d));
        }
        setPendingSelectedDays(newSelectedDays);
        setIntervalPhase('none');
      }
    }
  };

  const handleEnterSelectionMode = () => {
    setIsSelectionMode(true);
    setSelectionType('single');
  };

  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setPendingSelectedDays([]);
    setStartDate(null);
    setIntervalPhase('none');
  }

  const toggleSelectionType = () => {
    if (selectionType === 'single') {
      setSelectionType('interval');
      setIntervalPhase('selecting-start');
    } else {
      setSelectionType('single');
      setIntervalPhase('none');
    }
    setPendingSelectedDays([]);
    setStartDate(null);
  };

 const handleSaveSelection = () => {
    if (pendingSelectedDays.length === 0) return;
    setIsTimePanelOpen(true);
    setIsSelectionMode(false); 
  };

const handleFinalSave = (newlyAddedAvailability: Record<string, string[]>) => {
    console.log("Disponibilidade final salva:", newlyAddedAvailability);

     setAvailability(prev => ({ ...prev, ...newlyAddedAvailability }));

    setPendingSelectedDays([]); 
    setIsTimePanelOpen(false); 
  };

  const getInstructionText = () => {
    if (selectionType === 'interval') {
      if (intervalPhase === 'selecting-start') return 'Selecione o dia de início';
      if (intervalPhase === 'selecting-end') return 'Selecione o dia de fim';
    }
    return `${pendingSelectedDays.length} dias selecionados`;
  };

return (
    <div className="calendar-wrapper h-full w-full flex flex-col">

      <div className="flex-1 min-h-0">
        <ContinuousCalendar 
          events={userEvents}
          role={userRole}
          currentUserId={currentUserId}
          isSelectionMode={isSelectionMode}
          selectedPendingDays={pendingSelectedDays}
          onPendingDaySelect={handlePendingDaySelect}
          availability={availability}
        />
      </div>
      
      <div className="flex-shrink-0 bg-white p-4 border-t border-gray-200 flex justify-between items-center rounded-b-2xl">
        {isSelectionMode ? (
          <>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">{getInstructionText()}</span>
              <button 
                onClick={toggleSelectionType} 
                className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-white text-gray-800 border border-gray-300 text-sm font-medium hover:bg-gray-50"
              >
                <ArrowRightLeft size={14} className="mr-2" />
                {selectionType === 'single' ? 'Selecionar Intervalo' : 'Selecionar um a um'}
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
  );
}
    