export type ConsultaStatus = 'aguardando_aprovacao' | 'confirmada' | 'cancelada' | 'concluida';

export interface NewConsulta {
  alunoId: string;
  psicologoId: string;
  horario: string;
  status: ConsultaStatus;
}

export interface Consulta extends NewConsulta {
  id: string;
}

export interface ConsultaApiResponse {
  id: string;
  aluno_id: string;
  psicologo_id: string;
  horario: string;
  status: ConsultaStatus;
}

export interface ProcessedConsulta extends Consulta {
  participantName: string;
  participantAvatarUrl?: string;  // opcional
  date: string;
  time: string;
}
