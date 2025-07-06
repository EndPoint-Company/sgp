// src/features/psychologist/appointments/components/AppointmentCard.tsx

import React, { useState } from "react";
import ConfirmationModal from "../../../components/ui/confirmartion/ConfirmationModal";

type AppointmentCardProps = {
  name: string;
  date: string;
  time: string;
  status: string;
  avatarUrl: string;
  onCancel?: () => void;
};

export default function AppointmentCard({
  name,
  date,
  time,
  status,
  avatarUrl,
  onCancel,
}: AppointmentCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusColor =
    status === "Confirmada"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";

  const handleCancelClick = () => setIsModalOpen(true);

  const handleConfirmCancel = () => {
    onCancel?.();
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm w-full max-w-xs">
        <div className="flex justify-between items-center">
          <span className="text-base text-gray-600">{time}</span>
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-md ${statusColor}`}
          >
            {status}
          </span>
        </div>

        <div className="mt-3">
          <h3 className="text-2xl font-bold text-gray-900">{date}</h3>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={avatarUrl}
            alt={`Foto de ${name}`}
          />
          <span className="text-lg text-gray-700">{name}</span>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="mt-6 flex justify-between items-center">
          <button className="text-blue-600 font-semibold text-base hover:underline">
            Ver mais
          </button>
          {status === "Confirmada" && (
            <button
              onClick={handleCancelClick}
              className="bg-white border border-gray-300 rounded-lg px-6 py-2 shadow-sm text-gray-800 font-semibold text-base hover:bg-gray-50"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Cancelar consulta"
        description="Tem certeza que deseja cancelar esta consulta? Esta ação não poderá ser desfeita."
        onConfirm={handleConfirmCancel}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
}
