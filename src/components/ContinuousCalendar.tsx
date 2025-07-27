"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Consulta } from "../features/psychologist/services/apiService";
import {
  getPacienteData,
  getPsicologoData,
  formatEventTime,
} from "../features/psychologist/data/mockApi";

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
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

interface ContinuousCalendarProps {
  onClick?: (_day: number, _month: number, _year: number) => void;
  showAddIconInDay?: boolean;
  onButtonClick?: () => void;
  events?: Consulta[];
  role: "aluno" | "psicologo";
  currentUserId: string;
  availability?: Record<string, string[]>;
  isSelectionMode?: boolean;
  selectedPendingDays?: Date[];
  onPendingDaySelect?: (date: Date) => void;
  onDayClick?: (date: Date) => void;
  viewingDay?: Date | null;
  className?: string;
}

export const ContinuousCalendar: React.FC<ContinuousCalendarProps> = ({
  onClick,
  showAddIconInDay = false,
  onButtonClick = () => {},
  events = [],
  role,
  currentUserId,
  availability = {},
  isSelectionMode = false,
  selectedPendingDays = [],
  onPendingDaySelect = () => {},
  onDayClick = () => {},
  viewingDay = null,
  className = "",
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const monthOptions = monthNames.map((month, index) => ({
    name: month,
    value: `${index}`,
  }));

  const scrollToDay = (
    monthIndex: number,
    dayIndex: number,
    center = true,
    instant = false
  ) => {
    const targetDayIndex = dayRefs.current.findIndex(
      (ref) =>
        ref &&
        ref.getAttribute("data-month") === `${monthIndex}` &&
        ref.getAttribute("data-day") === `${dayIndex}`
    );
    const targetElement = dayRefs.current[targetDayIndex];

    if (targetDayIndex !== -1 && targetElement) {
      const container = document.querySelector(".calendar-container");
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = targetElement.getBoundingClientRect();

        let offset;
        if (center) {
          const is2xl = window.matchMedia("(min-width: 1536px)").matches;
          const offsetFactor = is2xl ? 3 : 2.5;
          offset =
            elementRect.top -
            containerRect.top -
            containerRect.height / offsetFactor +
            elementRect.height / 2;
        } else {
          offset = elementRect.top - containerRect.top;
        }

        container.scrollTo({
          top: container.scrollTop + offset,
          behavior: instant ? "auto" : "smooth",
        });
      }
    }
  };

  const handlePrevYear = () => setYear((prevYear) => prevYear - 1);
  const handleNextYear = () => setYear((prevYear) => prevYear + 1);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const monthIndex = parseInt(event.target.value, 10);
    setSelectedMonth(monthIndex);
    scrollToDay(monthIndex, 1);
  };

  const handleTodayClick = () => {
    setYear(today.getFullYear());
    scrollToDay(today.getMonth(), today.getDate());
  };

  const handleDayClick = (day: number, month: number, year: number) => {
    if (!onClick) {
      return;
    }
    if (month < 0) {
      onClick(day, 11, year - 1);
    } else {
      onClick(day, month, year);
    }
  };

  const eventsByDate = useMemo(() => {
    const grouped: { [key: string]: Consulta[] } = {};
    events.forEach((event) => {
      const eventDate = new Date(event.horario);
      const key = `${eventDate.getFullYear()}-${String(
        eventDate.getMonth() + 1
      ).padStart(2, "0")}-${String(eventDate.getDate()).padStart(2, "0")}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(event);
    });
    return grouped;
  }, [events]);

  const generateCalendar = useMemo(() => {
    const calendarDays = (() => {
      const days = [];
      const startDayOfWeek = new Date(year, 0, 1).getDay();
      for (let i = 0; i < startDayOfWeek; i++) {
        const prevYear = new Date(year, 0, 0);
        const day = prevYear.getDate() - startDayOfWeek + 1 + i;
        days.push({ month: -1, day });
      }
      for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          days.push({ month, day });
        }
      }
      const lastWeekDayCount = days.length % 7;
      if (lastWeekDayCount > 0) {
        const extraDaysNeeded = 7 - lastWeekDayCount;
        for (let day = 1; day <= extraDaysNeeded; day++) {
          days.push({ month: 12, day });
        }
      }
      return days;
    })();

    const calendarWeeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      calendarWeeks.push(calendarDays.slice(i, i + 7));
    }

    return calendarWeeks.map((week, weekIndex) => (
      <div className="flex w-full" key={`week-${weekIndex}`}>
        {week.map(({ month, day }, dayIndex) => {
          const index = weekIndex * 7 + dayIndex;
          const currentDate = new Date(year, month, day);
          currentDate.setHours(0, 0, 0, 0);

          const isPast = currentDate < today;
          const isWeekend =
            currentDate.getDay() === 0 || currentDate.getDay() === 6;
          const dateKey = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;
          const hasEvents = (eventsByDate[dateKey] || []).length > 0;
          const isPermanentlyDisabled = (isPast || isWeekend) && !hasEvents;
          const isAvailable =
            availability[dateKey] && availability[dateKey].length > 0;
          const isPending = selectedPendingDays.some(
            (d) => d.getTime() === currentDate.getTime()
          );

          // NOVO: Verifica se o dia atual é o que está sendo visualizado na sidebar
          const isViewing = viewingDay
            ? viewingDay.getTime() === currentDate.getTime()
            : false;

          // NOVO: O dia deve ser destacado se estiver pendente OU sendo visualizado
          const isHighlighted = isPending || isViewing;

          const isToday = currentDate.getTime() === today.getTime();
          const isNewMonth = day === 1;

          const isClickable =
            (!isSelectionMode && (isAvailable || hasEvents)) ||
            (isSelectionMode && !isPast && !isWeekend && !isAvailable);

          return (
            <div
              key={`${month}-${day}`}
              ref={(el) => {
                if (el) dayRefs.current[index] = el;
              }}
              data-month={month}
              data-day={day}
              onClick={() => {
                if (!isClickable) return;

                if (isSelectionMode) {
                  onPendingDaySelect(currentDate);
                } else {
                  onDayClick(currentDate);
                }
              }}
              className={`
      relative group aspect-square -m-px w-full grow font-medium 
      transition-all border-2
      transition-colors
      sm:size-16 lg:size-28 2xl:size-28


      ${isHighlighted ? "border-blue-500 z-40" : "border-slate-200"}
      ${isClickable ? "cursor-pointer hover:z-30" : ""}
      
      ${
        isSelectionMode && isClickable
          ? "hover:border-blue-400 hover:bg-blue-50"
          : ""
      }
      
      ${
        isPending
          ? "bg-blue-50 z-40"
          : isPermanentlyDisabled
          ? "bg-slate-50 pointer-events-none"
          : hasEvents && isPast
          ? "bg-slate-50"
          : isAvailable
          ? "bg-blue-50"
          : "bg-white"
      }
    `}
            >
              <span
                className={`absolute left-1 top-1 flex size-5 items-center justify-center rounded-full text-xs sm:size-6 sm:text-sm lg:left-2 lg:top-2 lg:size-8 lg:text-base ${
                  isToday ? "bg-blue-500 font-semibold text-white" : ""
                } ${
                  month < 0 || isPermanentlyDisabled
                    ? "text-slate-400"
                    : "text-slate-800"
                }`}
              >
                {day}
              </span>

              {isNewMonth && month >= 0 && month < 12 && (
                <span className="absolute bottom-0.5 left-0 w-full truncate px-1.5 text-sm font-semibold text-slate-300 sm:bottom-0 sm:text-lg lg:bottom-2.5 lg:left-3.5 lg:-mb-1 lg:w-fit lg:px-0 lg:text-xl 2xl:mb-[-4px] 2xl:text-2xl">
                  {monthNames[month]}
                </span>
              )}

              <div className="absolute inset-x-0 top-7 bottom-0 overflow-y-auto custom-scrollbar px-1 pt-1 sm:top-8 lg:top-12">
                <div className="flex flex-col gap-1">
                  {(eventsByDate[dateKey] || []).map((event) => {
                    const personToShow =
                      role === "aluno"
                        ? getPsicologoData(event.psicologoId)
                        : getPacienteData(event.pacienteId);
                    return (
                      <div
                        key={event.id}
                        className="flex items-center rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-800 whitespace-nowrap"
                      >
                        <span className="font-semibold">
                          {formatEventTime(event.horario)}
                        </span>
                        <span className="ml-1 truncate">
                          {personToShow?.name || "..."}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    ));
  }, [
    year,
    availability,
    eventsByDate,
    isSelectionMode,
    selectedPendingDays,
    role,
    onClick,
    onPendingDaySelect,
    onDayClick,
    viewingDay
  ]);

  useEffect(() => {
    scrollToDay(today.getMonth(), today.getDate(), true, true);
    const calendarContainer = document.querySelector(".calendar-container");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const month = parseInt(
              entry.target.getAttribute("data-month")!,
              10
            );
            if (!isNaN(month) && month >= 0 && month < 12) {
              setSelectedMonth(month);
            }
          }
        });
      },
      {
        root: calendarContainer,
        rootMargin: "-75% 0px -25% 0px",
        threshold: 0,
      }
    );

    dayRefs.current.forEach((ref) => {
      if (ref && ref.getAttribute("data-day") === "15") {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`no-scrollbar calendar-container h-full overflow-y-auto bg-white 
      pb-10 text-slate-800 shadow-interface rounded-tl-2xl ${className}`}
    >
      <div className="sticky -top-px z-50 w-full bg-white px-5 pt-7 sm:px-8 sm:pt-8">
        <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Select
              name="month"
              value={`${selectedMonth}`}
              options={monthOptions}
              onChange={handleMonthChange}
            />
            <button
              onClick={handleTodayClick}
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 lg:px-5 lg:py-2.5"
            >
              Hoje
            </button>
          </div>
          <div className="flex w-fit items-center justify-between">
            <button
              onClick={handlePrevYear}
              className="rounded-full border border-slate-300 p-1 transition-colors hover:bg-slate-100 sm:p-2"
            >
              <svg
                className="size-5 text-slate-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m15 19-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="min-w-16 text-center text-lg font-semibold sm:min-w-20 sm:text-xl">
              {year}
            </h1>
            <button
              onClick={handleNextYear}
              className="rounded-full border border-slate-300 p-1 transition-colors hover:bg-slate-100 sm:p-2"
            >
              <svg
                className="size-5 text-slate-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m9 5 7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="grid w-full grid-cols-7 justify-between text-slate-500">
          {daysOfWeek.map((day, index) => (
            <div
              key={index}
              className="w-full border-b border-slate-200 py-2 text-center font-semibold"
            >
              {day}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full px-5 pt-4 sm:px-8 sm:pt-6">{generateCalendar}</div>
    </div>
  );
};

export interface SelectProps {
  name: string;
  value: string;
  label?: string;
  options: { name: string; value: string }[];
  onChange: (_event: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

export const Select = ({
  name,
  value,
  label,
  options = [],
  onChange,
  className,
}: SelectProps) => (
  <div className={`relative ${className}`}>
    {label && (
      <label htmlFor={name} className="mb-2 block font-medium text-slate-800">
        {label}
      </label>
    )}
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`
        w-full cursor-pointer rounded-lg border border-gray-300 bg-white 
        py-2 pl-3 pr-10 text-sm font-medium text-gray-900 
        hover:bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200
        sm:rounded-xl sm:py-2.5 sm:pl-4 sm:pr-12 
        appearance-none 
      `}
      required
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>

    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4">
      <svg
        className="size-5 text-slate-500"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  </div>
);
