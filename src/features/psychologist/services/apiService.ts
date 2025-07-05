// src/features/psychologist/services/apiService.ts

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BASE_URL = 'http://localhost:8080/consultas';

export interface Consulta {
  id: string;
  pacienteId: string;
  psicologoId: string;
  horario: string;
  status: 'aguardando aprovacao' | 'confirmada' | 'cancelada' | 'passada';
}

/**
 * Busca todas as consultas associadas a um ID de psicólogo.
 * (Função mantida para uso futuro, desativada com ESlint)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getConsultasByPsicologoId = async (psicologoId: string): Promise<Consulta[]> => {
  const response = await fetch(`${BASE_URL}/psicologo?psicologoId=${psicologoId}`);
  
  if (!response.ok) {
    throw new Error('Falha ao buscar as consultas.');
  }
  
  return response.json();
};

/**
 * Atualiza o status de uma consulta específica.
 * (Função mantida para uso futuro, desativada com ESlint)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateConsultaStatus = async (consultaId: string, status: Consulta['status']): Promise<Consulta> => {
  const response = await fetch(`${BASE_URL}/${consultaId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Falha ao atualizar o status da consulta.');
  }

  return response.json();
};

/**
 * Deleta uma consulta.
 * (Função mantida para uso futuro, desativada com ESlint)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteConsulta = async (consultaId: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/${consultaId}`, {
        method: 'DELETE',
    });

    if(!response.ok) {
        throw new Error('Falha ao deletar a consulta.');
    }
};