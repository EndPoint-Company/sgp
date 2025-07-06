import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import ConfirmationModalAccept from '../../../components/ui/confirmartion/ConfirmationModalAccept';
import ConfirmationModal from '../../../components/ui/confirmartion/ConfirmationModal'; 

type RequestCardProps = {
  name: string;
  date: string;
  time: string;
  onAccept: () => void;
  onReject: () => void;
  avatarUrl: string;
};

export default function RequestCard({
  name,
  date,
  time,
  onAccept,
  onReject,
  avatarUrl,
}: RequestCardProps) {
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const handleAcceptClick = () => setIsAcceptModalOpen(true);
  const handleRejectClick = () => setIsRejectModalOpen(true);

  const handleConfirmAccept = () => {
    onAccept();
    setIsAcceptModalOpen(false);
  };

  const handleConfirmReject = () => {
    onReject();
    setIsRejectModalOpen(false);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm w-full max-w-xs">
        {/* Topo: hora e status */}
        <div className="flex justify-between items-center">
          <span className="text-base text-gray-600">{time}</span>
          <span className="text-sm font-semibold px-3 py-1 rounded-md bg-yellow-100 text-yellow-800">
            Pendente
          </span>
        </div>

        {/* Data */}
        <div className="mt-3">
          <h3 className="text-2xl font-bold text-gray-900">{date}</h3>
        </div>

        {/* Avatar e nome */}
        <div className="flex items-center gap-3 mt-4">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={avatarUrl}
            alt={`Foto de ${name}`}
          />
          <span className="text-lg text-gray-700">{name}</span>
        </div>

        <hr className="my-4 border-gray-200" />

        {/* Ações */}
        <div className="flex justify-between items-center">
          <button className="text-blue-600 font-semibold text-base hover:underline">
            Ver mais
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleAcceptClick}
              className="bg-green-100 text-green-700 rounded-xl p-2 text-xl hover:bg-green-200"
            >
              <Check />
            </button>
            <button
              onClick={handleRejectClick}
              className="bg-red-100 text-red-700 rounded-xl p-2 text-xl hover:bg-red-200"
            >
              <X />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de aceitar */}
      <ConfirmationModalAccept
        isOpen={isAcceptModalOpen}
        title="Aceitar solicitação"
        description="Deseja aceitar esta solicitação? Essa ação confirmará o agendamento."
        onConfirm={handleConfirmAccept}
        onCancel={() => setIsAcceptModalOpen(false)}
      />

      {/* Modal de rejeitar */}
      <ConfirmationModal
        isOpen={isRejectModalOpen}
        title="Rejeitar solicitação"
        description="Tem certeza que deseja rejeitar esta solicitação? Esta ação não poderá ser desfeita."
        onConfirm={handleConfirmReject}
        onCancel={() => setIsRejectModalOpen(false)}
      />
    </>
  );
}
