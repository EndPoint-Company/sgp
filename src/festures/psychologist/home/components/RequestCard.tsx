// src/features/psychologist/home/components/RequestCard.tsx
import React from 'react';

type RequestCardProps = {
  name: string;
  date: string;
  time: string;
  onAccept: () => void;
  onReject: () => void;
};

export default function RequestCard({ name, date, time, onAccept, onReject }: RequestCardProps) {
  return (
    <div className="bg-white border rounded p-4 shadow-sm w-60">
      <div className="text-xs text-gray-500">{time}</div>
      <div className="text-sm font-bold mt-1">{date}</div>
      <div className="text-sm text-gray-700 mt-1">{name}</div>
      <div className="mt-3 flex justify-between items-center text-green-600">
        <button onClick={onAccept}>✔</button>
        <button className="text-blue-600">Ver mais</button>
        <button className="text-red-600" onClick={onReject}>❌</button>
      </div>
    </div>
  );
}