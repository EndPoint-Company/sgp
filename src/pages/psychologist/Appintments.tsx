// src/pages/psychologist/Appintment.tsx

import PsychologistLayout from "../../layouts/PsychologistLayout";
import AppointmentDetailsPage from "../../features/psychologist/appointments/AppointmentDetailsPage";

export default function Home() {
  return (
    <PsychologistLayout>
      <AppointmentDetailsPage />
    </PsychologistLayout>
  );
}
