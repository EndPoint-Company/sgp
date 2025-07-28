"use client";

import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export const Toast = ({ message, isVisible }: ToastProps) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-5 z-50 animate-fade-in-up">
      <div className="flex items-center gap-3 rounded-lg bg-gray-800 p-4 text-white shadow-lg">
        <CheckCircleIcon className="h-6 w-6 text-green-400" />
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
};
