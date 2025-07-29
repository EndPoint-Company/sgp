// src/features/horarios/services/horarioService.ts

import apiClient from "../../../services/apiClient";

export interface HorarioDisponivel {
  id: string;
  psicologoId: string;
  inicio: string;
  fim: string;
  status: 'disponivel' | 'agendado' | 'bloqueado';
}

export interface NewHorario {
    psicologoId: string;
    inicio: string;
    fim: string;
}

const API_TIMEOUT = 15000;

export const horarioService = {
  async getByPsicologoId(psicologoId: string): Promise<HorarioDisponivel[]> {
    try {
      const response = await apiClient.get<HorarioDisponivel[]>('/horarios', {
        params: { psicologoId },
        timeout: API_TIMEOUT,
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(`Erro ao buscar horários para o psicólogo ${psicologoId}:`, error);
      throw new Error("Não foi possível carregar os horários.");
    }
  },

  /**
   * ATUALIZADO: A função agora se chama 'createHorario' (singular) e envia
   * um único objeto de horário, correspondendo à expectativa da API.
   */
  async createHorario(novoHorario: NewHorario): Promise<void> {
    try {
      await apiClient.post('/horarios', novoHorario, {
          timeout: API_TIMEOUT
      });
    } catch (error) {
        console.error('Erro ao criar novo horário:', error);
        throw new Error("Não foi possível salvar o horário.");
    }
  },

  async deleteHorario(horarioId: string): Promise<void> {
    try {
      await apiClient.delete(`/horarios/${horarioId}`, {
        timeout: API_TIMEOUT
      });
    } catch (error) {
      console.error(`Erro ao deletar o horário ${horarioId}:`, error);
      throw new Error("Não foi possível remover o horário.");
    }
  }
};

export const getHorariosByPsicologoId = horarioService.getByPsicologoId;
export const createHorario = horarioService.createHorario; // ATUALIZADO
export const deleteHorario = horarioService.deleteHorario;
