// src/features/auth/contexts/AuthContextDefinition.ts
import { createContext } from 'react';
import type { User } from 'firebase/auth';

export type UserRole = 'student' | 'psychologist' | 'admin' | null;

export interface AuthContextType {
  user: User | null;
  role: UserRole;
  isLoading: boolean;
  checkUserRole: (uid: string) => Promise<UserRole>;
  login: (email: string, password: string) => Promise<void>; // Adicionando a função login
  logout: () => void; // Adicionando também a função logout para completar
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);