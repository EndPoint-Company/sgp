// src/pages/psychologist/Home.tsx

import PsychologistLayout from "../../layouts/PsychologistLayout";
import HomePage from "../../features/psychologist/home/HomePage";

export default function Home() {
  return (
    <PsychologistLayout>
      <HomePage />
    </PsychologistLayout>
  );
}
