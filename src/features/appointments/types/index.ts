// src/features/appointments/types/index.ts

/**
 * Representa os possíveis status de uma consulta.
 */
export type ConsultaStatus = 'aguardando aprovacao' | 'confirmada' | 'cancelada' | 'concluida' | 'agendada';

// --- Tipos Relacionados à API e ao App ---

/**
 * ATUALIZADO: Representa a estrutura de dados EXATAMENTE como ela vem da sua API Go.
 * Como a API já retorna camelCase, este tipo também servirá como nosso modelo principal.
 */
export interface Consulta {
  id: string;
  alunoId: string;
  psicologoId: string;
  horarioId: string;
  inicio: string;          // Representa time.Time, virá como string ISO 8601
  fim: string;             // Representa time.Time, virá como string ISO 8601
  status: ConsultaStatus;
  dataAgendamento: string; // Representa time.Time, virá como string ISO 8601
}

/**
 * ATUALIZADO: Representa o modelo de dados para criar uma nova consulta.
 * O backend precisa do ID do horário para criar a consulta.
 */
export interface NewConsulta {
  alunoId: string;
  psicologoId: string;
  horarioId: string;
  status?: ConsultaStatus; // O status pode ser opcional na criação
}

// --- Tipos para a Interface do Usuário (UI) ---

/**
 * ATUALIZADO: O tipo final, enriquecido com informações prontas para a UI.
 * Ele é construído a partir do tipo `Consulta`.
 */
export interface ProcessedConsulta extends Consulta {
  participantName: string;         // Nome do outro participante
  participantAvatarUrl?: string;  // Avatar do outro participante (opcional)
  date: string;                    // Data formatada (ex: "29 de julho")
  time: string;                    // Hora formatada (ex: "10:00")
}


/**
 * Tipo auxiliar para representar um usuário (aluno ou psicólogo).
 * Necessário para encontrar o nome e o avatar do participante.
 */
export interface User {
  id: string;
  nome: string;
  avatarUrl?: string;
}

// NOTA: Como a API já retorna os campos em camelCase, a interface `ConsultaApiResponse`
// seria idêntica à `Consulta`. Para evitar duplicação, usaremos apenas `Consulta`
// como nosso modelo principal de dados recebidos.
