import React from 'react';

// 1. Definimos as propriedades (props) que o componente vai receber.
// O nome é opcional (string | null | undefined) para o caso de ainda não ter carregado.
interface WelcomeBannerProps {
  userName: string | null | undefined;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ userName }) => {
  
  // 2. Definimos um nome padrão caso a prop 'userName' venha vazia ou nula.
  const displayName = userName || 'Usuário';

  return (
    // 3. Usamos classes do Tailwind CSS para estilizar o banner.
    // Você pode customizar as cores, espaçamento e sombra como preferir.
    <div className="p-6 bg-blue-600 text-white rounded-xl shadow-md mb-8">
      <h1 className="text-2xl md:text-3xl font-bold">
        Bem-vindo(a) de volta, {displayName}!
      </h1>
      <p className="mt-1 text-blue-100">
        Aqui está um resumo das suas atividades e agendamentos.
      </p>
    </div>
  );
};