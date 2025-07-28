// src/components/ContinuousCalendar.tsx

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Consulta } from "../features/psychologist/services/appointmentService.ts";
import {
  getPacienteData,
  getPsicologoData,
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
}

export const ContinuousCalendar: React.FC<ContinuousCalendarProps> = ({
  onClick,
  showAddIconInDay = false,
  onButtonClick = () => {},
  events = [],
  role,
  //currentUserId,
  availability = {},
  isSelectionMode = false,
  selectedPendingDays = [],
  onPendingDaySelect = () => {},
}) => {
  const today = new Date();
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const monthOptions = monthNames.map((month, index) => ({
    name: month,
    value: `${index}`,
  }));

  const scrollToDay = (monthIndex: number, dayIndex: number, center = true) => {
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
          behavior: "smooth",
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysInYear = (): { month: number; day: number }[] => {
      const daysInYear = [];
      const startDayOfWeek = new Date(year, 0, 1).getDay();

      for (let i = 0; i < startDayOfWeek; i++) {
        const prevYear = new Date(year, 0, 0);
        const day = prevYear.getDate() - startDayOfWeek + 1 + i;
        daysInYear.push({ month: -1, day: day });
      }

      for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          daysInYear.push({ month, day });
        }
      }

      const lastWeekDayCount = daysInYear.length % 7;
      if (lastWeekDayCount > 0) {
        const extraDaysNeeded = 7 - lastWeekDayCount;
        for (let day = 1; day <= extraDaysNeeded; day++) {
          daysInYear.push({ month: 12, day });
        }
      }

      return daysInYear;
    };

    const calendarDays = daysInYear();

    const calendarWeeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      calendarWeeks.push(calendarDays.slice(i, i + 7));
    }

    return calendarWeeks.map((week, weekIndex) => (
      <div className="flex w-full" key={`week-${weekIndex}`}>
        {week.map(({ month, day }, dayIndex) => {
          const index = weekIndex * 7 + dayIndex;
          const isNewMonth =
            index === 0 || calendarDays[index - 1].month !== month;
          const currentDate = new Date(year, month, day);
          currentDate.setHours(0, 0, 0, 0);

          const isPast = currentDate < today;
          const dayOfWeek = currentDate.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const isPermanentlyDisabled = isPast || isWeekend;

          const dateKey = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;
          const isAvailable =
            availability[dateKey] && availability[dateKey].length > 0;

          const isPending = selectedPendingDays.some(
            (d) =>
              d.getFullYear() === year &&
              d.getMonth() === month &&
              d.getDate() === day
          );

          const isToday = currentDate.getTime() === today.getTime();

          return (
            <div
              key={`${month}-${day}`}
              ref={(el) => {
                dayRefs.current[index] = el;
              }}
              data-month={month}
              data-day={day}
              onClick={() => {
                if (isPermanentlyDisabled) return;

                if (isSelectionMode) {
                  onPendingDaySelect(new Date(year, month, day));
                } else if (onClick) {
                  handleDayClick(day, month, year);
                }
              }}
              className={`
                relative group aspect-square
                -m-px w-full grow font-medium transition-all border-2
                sm:size-16 lg:size-28 2xl:size-28
                
                ${isPending ? "border-blue-500" : "border-slate-200"}
                
                ${
                  isPending
                    ? "bg-blue-50 z-40"
                    : isPermanentlyDisabled
                    ? "bg-slate-50 pointer-events-none"
                    : isAvailable
                    ? "bg-blue-50"
                    : "bg-dotted"
                }
                
                ${
                  !isPermanentlyDisabled &&
                  isSelectionMode &&
                  "cursor-pointer hover:z-30"
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

              {isNewMonth && (
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
                        <span className="ml-1 truncate">
                          {personToShow?.name || "..."}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {showAddIconInDay && !isPermanentlyDisabled && (
                <button
                  onClick={onButtonClick}
                  type="button"
                  className="absolute right-2 top-2 rounded-full opacity-0 transition-all focus:opacity-100 group-hover:opacity-100"
                >
                  <svg
                    className="size-8 scale-90 text-blue-500 transition-all hover:scale-100 group-focus:scale-100"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}

              {showAddIconInDay && !isPermanentlyDisabled && (
                <button
                  onClick={onButtonClick}
                  type="button"
                  className="absolute right-2 top-2 rounded-full opacity-0 transition-all focus:opacity-100 group-hover:opacity-100"
                >
                  <svg
                    className="size-8 scale-90 text-blue-500 transition-all hover:scale-100 group-focus:scale-100"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    ));
  }, [
    year,
    availability,
    events,
    isSelectionMode,
    selectedPendingDays,
    role,
    onClick,
    onPendingDaySelect,
  ]);

  useEffect(() => {
    scrollToDay(today.getMonth(), 1, false);
    const calendarContainer = document.querySelector(".calendar-container");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const month = parseInt(
              entry.target.getAttribute("data-month")!,
              10
            );
            setSelectedMonth(month);
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
    <div className="no-scrollbar calendar-container max-h-full overflow-y-scroll rounded-t-2xl bg-white pb-10 text-slate-800 shadow-xl">
      <div className="sticky -top-px z-50 w-full rounded-t-2xl bg-white px-5 pt-7 sm:px-8 sm:pt-8">
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
      className="cursor-pointer rounded-lg border border-gray-300 bg-white py-1.5 pl-2 pr-6 text-sm font-medium text-gray-900 hover:bg-gray-100 sm:rounded-xl sm:py-2.5 sm:pl-3 sm:pr-8"
      required
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-1 sm:pr-2">
      <svg
        className="size-5 text-slate-600"
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
