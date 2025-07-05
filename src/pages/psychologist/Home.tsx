// src/pages/psychologist/Home.tsx

import PsychologistLayout from '../../layouts/PsychologistLayout';
import HomePage from '../../festures/psychologist/home/HomePage';

export default function Home() {
  return (
    <PsychologistLayout>
      {/* ADICIONE ESTE ELEMENTO DE TESTE */}
      <h1 className="text-5xl font-bold text-red-500 p-10">
        TESTE DA SAFELIST
      </h1>
      <HomePage />
    </PsychologistLayout>
  );
}