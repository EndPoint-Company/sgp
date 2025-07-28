// src/services/userService.ts
import apiClient from "./apiClient";

export interface Aluno {
  id: string;
  nome: string;
  avatarUrl?: string;
}

export interface Psicologo {
  id: string;
  nome: string;
  avatarUrl?: string;
}

// Esta função ainda pode ser útil em outros contextos
export const getPsicologos = async (): Promise<Psicologo[]> => {
  try {
    const response = await apiClient.get<Psicologo[]>('/psicologos');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar a lista de psicólogos:", error);
    throw new Error("Não foi possível carregar os psicólogos disponíveis.");
  }
};

// As funções getPacienteData e getPsicologoData foram removidas 
// pois sua funcionalidade foi substituída pelo UserDataProvider.