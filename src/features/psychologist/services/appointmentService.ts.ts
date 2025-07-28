import apiClient from '../../../services/apiClient'; // Importa nosso cliente Axios central

export interface Consulta {
  id: string;
  pacienteId: string;
  psicologoId: string;
  horario: string; // Pode ser string ISO, considere usar Date ou libs como date-fns se preferir
  status: 'aguardando aprovacao' | 'confirmada' | 'cancelada' | 'passada';
}

/**
 * Busca todas as consultas associadas a um ID de psicólogo.
 */
export const getConsultasByPsicologoId = async (psicologoId: string): Promise<Consulta[]> => {
  try {
    const response = await apiClient.get('/consultas/psicologo', {
      params: { psicologoId },
    });
    return response.data;
  } catch (error) {
    console.error('Falha ao buscar as consultas:', error);
    throw new Error('Falha ao buscar as consultas.');
  }
};

/**
 * Atualiza o status de uma consulta específica.
 */
export const updateConsultaStatus = async (
  consultaId: string,
  status: Consulta['status']
): Promise<Consulta> => {
  try {
    const response = await apiClient.patch(`/consultas/${consultaId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Falha ao atualizar o status da consulta:', error);
    throw new Error('Falha ao atualizar o status da consulta.');
  }
};

/**
 * Deleta uma consulta.
 */
export const deleteConsulta = async (consultaId: string): Promise<void> => {
  try {
    await apiClient.delete(`/consultas/${consultaId}`);
  } catch (error) {
    console.error('Falha ao deletar a consulta:', error);
    throw new Error('Falha ao deletar a consulta.');
  }
};

/**
 * Agenda uma nova consulta.
 */
export const agendarConsulta = async (
  dadosConsulta: Omit<Consulta, 'id' | 'status'>
): Promise<Consulta> => {
  try {
    const response = await apiClient.post('/consultas', dadosConsulta);
    return response.data;
  } catch (error) {
    console.error('Falha ao agendar a consulta:', error);
    throw new Error('Falha ao agendar a consulta.');
  }
};
