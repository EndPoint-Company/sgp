// src/pages/psychologist/PsychologistAppointmentsPage.tsx

import React from "react";

// 1. Hooks e Contexto
import { useAuth } from "../../features/auth/hooks/useAuth";

// 2. Layouts e Componentes de UI
import PsychologistLayout from "../../layouts/PsychologistLayout";
// ATUALIZADO: A página agora importa o componente que gerencia tudo.
import AppointmentsManager from "../../features/appointments/components/AppointmentsManager";

export default function PsychologistAppointmentsPage() {
  // --- LÓGICA E ESTADO ---
  // A página agora só precisa se preocupar com a autenticação do usuário.
  const { user, isLoading: isAuthLoading } = useAuth();

  // --- RENDERIZAÇÃO ---
  return (
    <PsychologistLayout>
      <div className="container mx-auto p-4">
        {/* Mostra um estado de carregamento enquanto a autenticação é verificada. */}
        {isAuthLoading && (
          <div className="text-center py-10 text-gray-500">Carregando dados do usuário...</div>
        )}

        {/* Exibe uma mensagem de erro se o usuário não for encontrado. */}
        {!isAuthLoading && !user && (
          <div className="text-center py-10 text-red-600">
            Não foi possível carregar os dados do usuário. Por favor, tente fazer login novamente.
          </div>
        )}

        {/* Quando o usuário estiver autenticado, renderiza o AppointmentsManager.
          O componente cuidará de buscar e gerenciar seus próprios dados a partir daqui.
        */}
        {!isAuthLoading && user?.uid && (
          <AppointmentsManager 
            userId={user.uid} 
            userRole="psicologo" 
          />
        )}
      </div>
    </PsychologistLayout>
  );
}