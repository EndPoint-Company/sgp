import type { Consulta } from '../services/apiService';

// Dados principais das consultas
export const mockFirebaseData: Consulta[] = [
  {
    "id": "l10YBKR1cKW9WHPzg9Lv",
    "pacienteId": "mu3Mo6I0eSSD3aWZdYte", // Aluno: Marcos Vitor
    "psicologoId": "CRsiWje2vKiLsr5fCpxW", // Psicóloga: Ester Ravette
    "horario": "2025-07-15T14:00:00Z", // Data futura para aparecer em "Próximos"
    "status": "passada"
  },
  {
    "id": "L33ijLuI4egijO8qAAaC",
    "pacienteId": "2QZfL6ICZwO6UUMBN14I", // Outra aluna, não deve aparecer na tela do Marcos
    "psicologoId": "CRsiWje2vKiLsr5fCpxW",
    "horario": "2025-07-21T19:30:00Z",
    "status": "aguardando aprovacao"
  },
  {
    "id": "L33ijLuI4egijO8qAAaC",
    "pacienteId": "2QZfL6ICZwO6UUMBN14I", // Outra aluna, não deve aparecer na tela do Marcos
    "psicologoId": "CRsiWje2vKiLsr5fCpxW",
    "horario": "2025-07-29T15:30:00Z",
    "status": "confirmada"
  },
  {
    "id": "L33ijLuI4egijO8qAAaC",
    "pacienteId": "2QZfL6ICZwO6UUMBN14I", // Outra aluna, não deve aparecer na tela do Marcos
    "psicologoId": "CRsiWje2vKiLsr5fCpxW",
    "horario": "2025-07-29T15:30:00Z",
    "status": "confirmada"
  },
  // ... outros dados ...
];

// Banco de dados de pacientes
const mockPacientesDatabase: { [id: string]: { name: string; avatarUrl: string } } = {
  "mu3Mo6I0eSSD3aWZdYte": { name: "Marcos Vitor", avatarUrl: 'https://i.pravatar.cc/40?u=marcos' },
  "2QZfL6ICZwO6UUMBN14I": { name: "Juliana Martins", avatarUrl: 'https://i.pravatar.cc/40?u=juliana' },
};

// MUDANÇA: Adicionado banco de dados de psicólogos
const mockPsicologosDatabase: { [id: string]: { name: string; avatarUrl: string } } = {
  "CRsiWje2vKiLsr5fCpxW": { name: "Ester Ravette", avatarUrl: 'https://i.pravatar.cc/40?u=ester' },
};

// Função para formatar apenas a hora
export const formatEventTime = (isoString: string) => {
  const date = new Date(isoString);
  // Retorna a hora no formato HH:mm (ex: "14:00")
  return new Intl.DateTimeFormat('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  }).format(date);
};

// Função para buscar dados do paciente
export const getPacienteData = (pacienteId: string) => {
  return mockPacientesDatabase[pacienteId] || { name: 'Paciente Desconhecido', avatarUrl: 'https://i.pravatar.cc/40' };
};

// MUDANÇA: Adicionada função para buscar dados do psicólogo
export const getPsicologoData = (psicologoId: string) => {
  return mockPsicologosDatabase[psicologoId] || { name: 'Psicólogo Desconhecido', avatarUrl: 'https://i.pravatar.cc/40' };
};

// Função para formatar data e hora
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