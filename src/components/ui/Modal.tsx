import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, CalendarPlus } from 'lucide-react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white p-6 shadow-lg rounded-xl">
          <div className="flex items-start justify-between">

            <Dialog.Title asChild>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <CalendarPlus className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
              </div>
            </Dialog.Title>

            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>
          <div className="mt-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}