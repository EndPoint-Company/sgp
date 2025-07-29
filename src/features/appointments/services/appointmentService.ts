// src/features/appointments/services/appointmentService.ts

import apiClient from "../../../services/apiClient";
import type { Consulta, NewConsulta, ConsultaStatus } from "../types";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const API_TIMEOUT = 10000;

export const appointmentService = {
  /**
   * Busca todas as consultas associadas a um ID de psicólogo.
   */
  async getByPsicologoId(psicologoId: string): Promise<Consulta[]> {
    try {
      const response = await apiClient.get<Consulta[]>('/consultas/psicologo', { 
        params: { psicologoId }, 
        timeout: API_TIMEOUT 
      });
      
      if (Array.isArray(response.data)) {
        return response.data.map(c => appointmentService.normalizeConsultaDates(c));
      }
      return [];

    } catch (error) {
      if (appointmentService.isAxiosError(error) && error.response?.status === 404) {
        return [];
      }
      throw appointmentService.handleError(error, "Erro ao buscar as consultas do psicólogo.");
    }
  },

  /**
   * Busca todas as consultas associadas a um ID de aluno.
   */
  async getByAlunoId(alunoId: string): Promise<Consulta[]> {
    try {
      const response = await apiClient.get<Consulta[]>('/consultas/aluno', {
        params: { alunoId },
        timeout: API_TIMEOUT
      });

      if (Array.isArray(response.data)) {
        return response.data.map(c => appointmentService.normalizeConsultaDates(c));
      }
      return [];

    } catch (error) {
      if (appointmentService.isAxiosError(error) && error.response?.status === 404) {
        return [];
      }
      throw appointmentService.handleError(error, "Erro ao buscar as consultas do aluno.");
    }
  },

  /**
   * Cria uma nova consulta.
   */
  async create(consultaData: NewConsulta): Promise<Consulta> {
    try {
      appointmentService.validateConsultaData(consultaData);
      const response = await apiClient.post<Consulta>("/consultas", consultaData, { 
        timeout: API_TIMEOUT 
      });
      return appointmentService.normalizeConsultaDates(response.data);
    } catch (error) {
      throw appointmentService.handleError(error, "Erro ao criar a consulta.");
    }
  },

  /**
   * Atualiza o status de uma consulta.
   */
  async updateStatus(id: string, status: Extract<ConsultaStatus, "confirmada" | "cancelada">): Promise<Consulta> {
    try {
      const response = await apiClient.patch<Consulta>(`/consultas/${id}/status`, { status }, { 
        timeout: API_TIMEOUT 
      });
      return appointmentService.normalizeConsultaDates(response.data);
    } catch (error) {
      throw appointmentService.handleError(error, "Erro ao atualizar o status da consulta.");
    }
  },

  /**
   * Cancela (deleta) uma consulta.
   */
  async cancel(id: string): Promise<void> {
    try {
      await apiClient.delete(`/consultas/${id}`, { timeout: API_TIMEOUT });
    } catch (error) {
      throw appointmentService.handleError(error, "Erro ao cancelar a consulta.");
    }
  },

  /**
   * Busca uma consulta específica pelo seu ID.
   */
  async getById(id: string): Promise<Consulta | null> {
    try {
      const response = await apiClient.get<Consulta>(`/consultas/${id}`, { timeout: API_TIMEOUT });
      return appointmentService.normalizeConsultaDates(response.data);
    } catch (error) {
      if (appointmentService.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw appointmentService.handleError(error, "Erro ao buscar a consulta.");
    }
  },

  /**
   * Valida os dados para a criação de uma nova consulta.
   */
  validateConsultaData(data: NewConsulta): void {
    const errors: string[] = [];
    if (!data.alunoId?.trim()) errors.push("ID do aluno é obrigatório.");
    if (!data.psicologoId?.trim()) errors.push("ID do psicólogo é obrigatório.");
    if (!data.horarioId?.trim()) errors.push("ID do horário é obrigatório.");

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }
  },

  /**
   * CORRIGIDO: Função de normalização de datas agora é mais segura.
   * Ela verifica se a data recebida da API é válida antes de tentar formatá-la.
   */
  normalizeConsultaDates(consulta: Consulta): Consulta {
    const safeFormat = (dateString: string): string => {
      if (!dateString) {
        return dateString;
      }
      const date = new Date(dateString);
      // Verifica se a data é inválida. Se for, retorna a string original.
      if (isNaN(date.getTime())) {
        console.warn(`[normalizeConsultaDates] Data inválida recebida da API: "${dateString}"`);
        return dateString;
      }
      return date.toISOString();
    };

    return {
      ...consulta,
      inicio: safeFormat(consulta.inicio),
      fim: safeFormat(consulta.fim),
      dataAgendamento: safeFormat(consulta.dataAgendamento),
    };
  },
  
  /**
   * Manipulador de erros padrão para o serviço.
   */
  handleError(error: unknown, defaultMessage: string): Error {
    if (appointmentService.isAxiosError(error)) {
      const errorData = error.response?.data as ApiErrorResponse;
      const status = error.response?.status;
      const errorMessage = errorData?.message || errorData?.error || (error as Error).message;

      switch (status) {
        case 400: return new Error(errorMessage || "Dados inválidos enviados.");
        case 401: return new Error("Autenticação necessária.");
        case 403: return new Error("Você não tem permissão para esta ação.");
        case 404: return new Error("Recurso não encontrado.");
        case 500: return new Error("Erro interno no servidor.");
        default: return new Error(errorMessage || defaultMessage);
      }
    }
    return error instanceof Error ? error : new Error(defaultMessage);
  },

  /**
   * Verificador de tipo para erros do Axios.
   */
  isAxiosError(error: unknown): error is AxiosError {
    return typeof error === "object" && error !== null && "isAxiosError" in error;
  },
};

// Exportações individuais para facilitar o uso em outras partes do código.
export const getConsultasByPsicologoId = appointmentService.getByPsicologoId;
export const getConsultasByAlunoId = appointmentService.getByAlunoId;
export const createConsulta = appointmentService.create;
export const updateConsultaStatus = appointmentService.updateStatus;
export const cancelConsulta = appointmentService.cancel;
export const getConsultaById = appointmentService.getById;
