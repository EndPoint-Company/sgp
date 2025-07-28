import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { auth } from '../../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { AuthContext } from '../contexts/AuthContextDefinition';
import type { AuthContextType, UserRole } from '../contexts/AuthContextDefinition';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUserRole = async (uid: string): Promise<UserRole> => {
  try {
    const psicologoRef = doc(db, 'Psicologos', uid);
    const psicologoSnap = await getDoc(psicologoRef);
    if (psicologoSnap.exists()) return 'psychologist';

    const alunoRef = doc(db, 'Alunos', uid);
    const alunoSnap = await getDoc(alunoRef);
    if (alunoSnap.exists()) return 'student';

    return null;
  } catch (error) {
    console.error('Erro ao verificar role do usuário:', error);
    return null;
  }
};


  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userRole = await checkUserRole(user.uid);
      
      setUser(user);
      setRole(userRole);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRole = await checkUserRole(firebaseUser.uid);
        setUser(firebaseUser);
        setRole(userRole);
      } else {
        setUser(null);
        setRole(null);
      }
      setIsLoading(false);
    });
    
    return unsubscribe;
  }, []);

  const value = { 
    user, 
    role,
    isLoading,
    checkUserRole,
    login,  // Adicionando a função login
    logout  // Adicionando a função logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}