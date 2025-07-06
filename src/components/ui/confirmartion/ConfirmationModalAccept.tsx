// components/ConfirmationModalAccept.tsx
import React from 'react';
import { CheckCircle } from 'lucide-react';

type ConfirmationModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmationModalAccept({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[320px]">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-green-100 text-green-600 p-2 rounded-full">
            <CheckCircle size={24} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        <p className="text-gray-600 mb-6 text-sm">{description}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
