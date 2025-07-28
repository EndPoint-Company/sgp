// src/contexts/UserDataProvider.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
// O caminho para apiClient pode precisar de ajuste dependendo de onde este arquivo está
import apiClient from "../services/apiClient";

// Interfaces para os tipos de usuário
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

// O que o nosso contexto vai fornecer
interface UserDataContextType {
  alunos: Aluno[];
  psicologos: Psicologo[];
  isLoading: boolean;
  findAlunoById: (id: string) => Aluno; // Retorna um Aluno (com fallback)
  findPsicologoById: (id: string) => Psicologo; // Retorna um Psicologo (com fallback)
}

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

// O componente Provedor
export const UserDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [psicologos, setPsicologos] = useState<Psicologo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Busca as listas completas uma única vez
    Promise.all([
      apiClient.get<Aluno[]>("/alunos"),
      apiClient.get<Psicologo[]>("/psicologos"),
    ])
      .then(([alunosResponse, psicologosResponse]) => {
        setAlunos(alunosResponse.data);
        setPsicologos(psicologosResponse.data);
      })
      .catch((error) =>
        console.error("Falha ao carregar dados de usuários:", error)
      )
      .finally(() => setIsLoading(false));
  }, []);

  // Função de busca local para Alunos
  const findAlunoById = (id: string): Aluno => {
    const aluno = alunos.find((a) => a.id === id);
    // Retorna o aluno encontrado ou um objeto de fallback
    return aluno || { id, nome: "Aluno Desconhecido", avatarUrl: "" };
  };

  // Função de busca local para Psicólogos
  const findPsicologoById = (id: string): Psicologo => {
    const psicologo = psicologos.find((p) => p.id === id);
    // Retorna o psicólogo encontrado ou um objeto de fallback
    return psicologo || { id, nome: "Psicólogo Desconhecido", avatarUrl: "" };
  };

  const value = {
    alunos,
    psicologos,
    isLoading,
    findAlunoById,
    findPsicologoById,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

// Hook customizado para usar o contexto facilmente
// FIX: Adicionado comentário para desabilitar a regra do ESLint para esta exportação
// eslint-disable-next-line react-refresh/only-export-components
export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
};
