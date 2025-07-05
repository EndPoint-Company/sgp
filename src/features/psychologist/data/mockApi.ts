import type { Consulta } from '../services/apiService';

export const mockFirebaseData: Consulta[] = [
  {
    "id": "l10YBKR1cKW9WHPzg9Lv",
    "pacienteId": "mu3Mo6I0eSSD3aWZdYte",
    "psicologoId": "CRsiWje2vKiLsr5fCpxW",
    "horario": "2025-07-15T14:00:00Z",
    "status": "confirmada"
  },
  {
    "id": "L33ijLuI4egijO8qAAaC",
    "pacienteId": "2QZfL6ICZwO6UUMBN14I",
    "psicologoId": "CRsiWje2vKiLsr5fCpxW",
    "horario": "2025-07-21T19:30:00Z",
    "status": "aguardando aprovacao"
  },
  {
    "id": "53HngIRRhtUKfH1u09Ez",
    "pacienteId": "fG7hJkL9mnOpQrStUvWx",
    "psicologoId": "CRsiWje2vKiLsr5fCpxW",
    "horario": "2025-07-22T10:00:00Z",
    "status": "aguardando aprovacao"
  },
   {
    "id": "pA4sD5fG6hJ7kL8mN9oP",
    "pacienteId": "mu3Mo6I0eSSD3aWZdYte",
    "psicologoId": "CRsiWje2vKiLsr5fCpxW",
    "horario": "2025-06-10T11:00:00Z",
    "status": "passada"
  },
  {
    "id": "zX8cY9vA0bS1dE2fG3hI",
    "pacienteId": "2QZfL6ICZwO6UUMBN14I",
    "psicologoId": "CRsiWje2vKiLsr5fCpxW",
    "horario": "2025-06-18T16:00:00Z",
    "status": "cancelada"
  }
];

const mockPacientesDatabase: { [id: string]: { name: string; avatarUrl: string } } = {
  "mu3Mo6I0eSSD3aWZdYte": { name: "Marcos Vitor", avatarUrl: 'https://i.pravatar.cc/40?u=marcos' },
  "2QZfL6ICZwO6UUMBN14I": { name: "Juliana Martins", avatarUrl: 'https://i.pravatar.cc/40?u=juliana' },
  "fG7hJkL9mnOpQrStUvWx": { name: "Carlos Andrade", avatarUrl: 'https://i.pravatar.cc/40?u=carlos' },
};

export const getPacienteData = (pacienteId: string) => {
  return mockPacientesDatabase[pacienteId] || { name: 'Paciente Desconhecido', avatarUrl: 'https://i.pravatar.cc/40' };
};

export const formatAppointmentDate = (isoString: string) => {
    const date = new Date(isoString);
    const dayOfWeek = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date);
    const formattedDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
    const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
    const capitalizedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
    date.setHours(date.getHours() + 1);
    const endTime = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date);

    return {
        date: `${capitalizedDay}, ${formattedDate.replace(' de ', ' ')}`,
        time: `${time} às ${endTime}`,
    }
}