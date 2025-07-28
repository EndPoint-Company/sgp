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
   * Busca consultas por ID do psicólogo
   */
  async getByPsicologoId(psicologoId: string): Promise<Consulta[]> {
    try {
      console.log(`[getByPsicologoId] Buscando consultas para psicólogo ID: ${psicologoId}`);
      
      // ALTERADO: A chamada à API agora usa query parameters
      const response = await apiClient.get<Consulta[]>(
        `/consultas/psicologo`, // Endpoint base
        { 
          params: { psicologoId }, // Passa o ID como query param
          timeout: API_TIMEOUT 
        }
      );

      console.log(`[getByPsicologoId] Dados recebidos:`, response.data);

      const normalizedData = response.data.map((consulta) => ({
        ...consulta,
        horario: appointmentService.normalizeDateTime(consulta.horario),
      }));

      console.log(`[getByPsicologoId] Dados normalizados:`, normalizedData);
      return normalizedData;
    } catch (error) {
      if (appointmentService.isAxiosError(error) && error.response?.status === 404) {
        console.log(`[getByPsicologoId] Nenhuma consulta encontrada para o psicólogo ${psicologoId}. Retornando array vazio.`);
        return [];
      }
      
      console.error(`[getByPsicologoId] Erro ao buscar consultas do psicólogo ${psicologoId}:`, error);
      throw appointmentService.handleError(
        error,
        "Erro ao buscar consultas do psicólogo"
      );
    }
  },

  /**
   * Busca consultas por ID do aluno
   */
  async getByAlunoId(alunoId: string): Promise<Consulta[]> {
    try {
      console.log(`[getByAlunoId] Iniciando busca de consultas para aluno ID: ${alunoId}`);
      
      const response = await apiClient.get<Consulta[]>(
        `/consultas/aluno`,
        {
          params: { alunoId },
          timeout: API_TIMEOUT
        }
      );

      console.log(`[getByAlunoId] Resposta da API para aluno ${alunoId}:`, {
        status: response.status,
        data: response.data,
        config: response.config
      });

      if (!response.data || !Array.isArray(response.data)) {
        console.warn(`[getByAlunoId] Dados recebidos inválidos para aluno ${alunoId}:`, response.data);
        return [];
      }

      const normalizedData = response.data.map((consulta) => {
        const normalized = {
          ...consulta,
          horario: appointmentService.normalizeDateTime(consulta.horario),
        };
        console.log(`[getByAlunoId] Consulta ${consulta.id} normalizada:`, normalized);
        return normalized;
      });

      console.log(`[getByAlunoId] Retornando ${normalizedData.length} consultas para aluno ${alunoId}`);
      return normalizedData;
    } catch (error) {
      if (appointmentService.isAxiosError(error)) {
        console.error(`[getByAlunoId] Erro Axios na busca por aluno ${alunoId}:`, {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
        
        if (error.response?.status === 404) {
          console.log(`[getByAlunoId] Nenhuma consulta encontrada para aluno ${alunoId}`);
          return [];
        }
      } else {
        console.error(`[getByAlunoId] Erro desconhecido na busca por aluno ${alunoId}:`, error);
      }
      
      throw appointmentService.handleError(
        error,
        "Erro ao buscar consultas do aluno"
      );
    }
  },

  /**
   * Cria uma nova consulta
   */
  async create(consultaData: NewConsulta): Promise<Consulta> {
    try {
      console.log(`[create] Validando dados para nova consulta:`, consultaData);
      appointmentService.validateConsultaData(consultaData);

      const payload = {
        ...consultaData,
        status: consultaData.status || "aguardando_aprovacao",
      };
      console.log(`[create] Enviando payload para API:`, payload);

      const response = await apiClient.post<Consulta>(
        "/consultas",
        payload,
        { timeout: API_TIMEOUT }
      );

      console.log(`[create] Consulta criada com sucesso:`, response.data);
      
      const result = {
        ...response.data,
        horario: appointmentService.normalizeDateTime(response.data.horario),
      };
      console.log(`[create] Retornando consulta normalizada:`, result);
      
      return result;
    } catch (error) {
      console.error(`[create] Erro ao criar consulta:`, {
        error,
        consultaData,
        isAxiosError: appointmentService.isAxiosError(error),
        responseData: appointmentService.isAxiosError(error) ? error.response?.data : null
      });
      throw appointmentService.handleError(error, "Erro ao criar consulta");
    }
  },

  /**
   * Atualiza o status de uma consulta
   */
  async updateStatus(
    id: string,
    status: Extract<ConsultaStatus, "confirmada" | "cancelada">
  ): Promise<Consulta> {
    try {
      console.log(`[updateStatus] Atualizando status da consulta ${id} para ${status}`);
      
      const response = await apiClient.patch<Consulta>(
        `/consultas/${id}/status`,
        { status },
        { timeout: API_TIMEOUT }
      );

      console.log(`[updateStatus] Status atualizado com sucesso:`, response.data);
      
      const result = {
        ...response.data,
        horario: appointmentService.normalizeDateTime(response.data.horario),
      };
      console.log(`[updateStatus] Retornando consulta atualizada:`, result);
      
      return result;
    } catch (error) {
      console.error(`[updateStatus] Erro ao atualizar status da consulta ${id}:`, {
        error,
        status,
        isAxiosError: appointmentService.isAxiosError(error),
        responseData: appointmentService.isAxiosError(error) ? error.response?.data : null
      });
      throw appointmentService.handleError(
        error,
        "Erro ao atualizar status da consulta"
      );
    }
  },

  /**
   * Cancela uma consulta
   */
  async cancel(id: string): Promise<void> {
    try {
      console.log(`[cancel] Iniciando cancelamento da consulta ${id}`);
      
      await apiClient.delete(`/consultas/${id}`, {
        timeout: API_TIMEOUT,
      });
      
      console.log(`[cancel] Consulta ${id} cancelada com sucesso`);
    } catch (error) {
      console.error(`[cancel] Erro ao cancelar consulta ${id}:`, {
        error,
        isAxiosError: appointmentService.isAxiosError(error),
        responseData: appointmentService.isAxiosError(error) ? error.response?.data : null
      });
      throw appointmentService.handleError(error, "Erro ao cancelar consulta");
    }
  },

  /**
   * Busca uma consulta por ID
   */
  async getById(id: string): Promise<Consulta | null> {
    try {
      console.log(`[getById] Buscando consulta com ID: ${id}`);
      
      const response = await apiClient.get<Consulta>(`/consultas/${id}`, {
        timeout: API_TIMEOUT,
      });

      console.log(`[getById] Consulta encontrada:`, response.data);
      
      const result = {
        ...response.data,
        horario: appointmentService.normalizeDateTime(response.data.horario),
      };
      console.log(`[getById] Retornando consulta normalizada:`, result);
      
      return result;
    } catch (error) {
      if (appointmentService.isAxiosError(error) && error.response?.status === 404) {
        console.log(`[getById] Consulta ${id} não encontrada`);
        return null;
      }
      
      console.error(`[getById] Erro ao buscar consulta ${id}:`, {
        error,
        isAxiosError: appointmentService.isAxiosError(error),
        responseData: appointmentService.isAxiosError(error) ? error.response?.data : null
      });
      throw appointmentService.handleError(error, "Erro ao buscar consulta");
    }
  },

  /**
   * Normaliza o formato da data/hora
   */
  normalizeDateTime(dateTime: string): string {
    try {
      const normalized = new Date(dateTime).toISOString();
      // console.log(`[normalizeDateTime] Normalizado de "${dateTime}" para "${normalized}"`);
      return normalized;
    } catch (error) {
      console.warn(`[normalizeDateTime] Falha ao normalizar data "${dateTime}":`, error);
      return dateTime;
    }
  },

  /**
   * Valida os dados da consulta antes de enviar
   */
  validateConsultaData(data: NewConsulta): void {
    // console.log(`[validateConsultaData] Validando dados:`, data);
    const errors: string[] = [];

    if (!data.alunoId?.trim()) errors.push("ID do aluno é obrigatório");
    if (!data.psicologoId?.trim()) errors.push("ID do psicólogo é obrigatório");
    if (!data.horario?.trim()) errors.push("Horário é obrigatório");

    try {
      new Date(data.horario);
    } catch {
      errors.push("Formato de horário inválido");
    }

    if (errors.length > 0) {
      console.error(`[validateConsultaData] Erros de validação:`, errors);
      throw new Error(errors.join(", "));
    }
    
    // console.log(`[validateConsultaData] Dados validados com sucesso`);
  },

  /**
   * Tratamento padrão de erros
   */
  handleError(error: unknown, defaultMessage: string): Error {
    // console.error(`[handleError] Tratando erro:`, { error, defaultMessage });

    if (appointmentService.isAxiosError(error)) {
      const errorData = error.response?.data as ApiErrorResponse;
      const status = error.response?.status;
      const errorMessage =
        errorData?.message || errorData?.error || (error as Error).message;

      // console.error("[handleError] Detalhes do erro Axios:", { message: defaultMessage, status, error: errorMessage });

      switch (status) {
        case 400: return new Error(errorMessage || "Dados inválidos enviados");
        case 401: return new Error("Autenticação necessária");
        case 403: return new Error("Você não tem permissão para esta ação");
        case 404: return new Error("Recurso não encontrado");
        case 500: return new Error("Erro interno no servidor");
        default: return new Error(errorMessage || defaultMessage);
      }
    }

    // console.error("[handleError] Erro não-Axios:", { error, defaultMessage });
    return error instanceof Error ? error : new Error(defaultMessage);
  },

  /**
   * Type guard para AxiosError
   */
  isAxiosError(error: unknown): error is AxiosError {
    return typeof error === "object" && error !== null && "isAxiosError" in error;
  },
};

// Exportações individuais para conveniência
export const getConsultasByPsicologoId = appointmentService.getByPsicologoId;
export const getConsultasByAlunoId = appointmentService.getByAlunoId;
export const createConsulta = appointmentService.create;
export const updateConsultaStatus = appointmentService.updateStatus;
export const cancelConsulta = appointmentService.cancel;
export const getConsultaById = appointmentService.getById;
