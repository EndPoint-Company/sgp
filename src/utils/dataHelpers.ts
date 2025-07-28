  // Exemplo - Adapte com base no seu código mock original
  const mockPacientes = [
    { id: 'paciente01', name: 'Carlos Silva', avatarUrl: '...' },
    { id: 'paciente02', name: 'Ana Pereira', avatarUrl: '...' },
  ];

  export const getPacienteData = (pacienteId: string) => {
    return mockPacientes.find(p => p.id === pacienteId) || { name: 'Desconhecido', avatarUrl: '' };
  };

  export const formatAppointmentDate = (isoString: string) => {
    const dateObj = new Date(isoString);
    return {
      date: dateObj.toLocaleDateString('pt-BR'),
      time: dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const mockPsicologos = [
    { id: 'CRsiWje2vKiLsr5fCpxW', name: 'Dr. Ana Costa', avatarUrl: '...' },
    { id: 'psicologo02', name: 'Dr. João Martins', avatarUrl: '...' },
  ];

  export const getPsicologoData = (psicologoId: string) => {
    return mockPsicologos.find(p => p.id === psicologoId) || { name: 'Psicólogo(a) Desconhecido(a)', avatarUrl: '' };
  };