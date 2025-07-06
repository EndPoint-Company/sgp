import React, { useState, useMemo } from 'react';
import RequestCard from '../components/RequestCard';
import AppointmentCard from '../components/AppintmentCard';
import { Input } from '../../../components/ui/input'; 
import { Button } from '../../../components/ui/button'; 
import { LayoutGrid, List, CalendarDays, RefreshCw, X, Check, Search, Plus } from 'lucide-react';
import { mockFirebaseData, getPacienteData, formatAppointmentDate } from '../data/mockApi';
import type { Consulta } from '../services/apiService'; 

export default function AppointmentDetailsPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'agendados' | 'solicitacoes' | 'cancelados' | 'passados'>('solicitacoes');
  
  const [consultas, setConsultas] = useState<Consulta[]>(mockFirebaseData);
  
  const handleUpdateStatus = (consultaId: string, newStatus: 'confirmada' | 'cancelada') => {
    setConsultas(prevConsultas => 
      prevConsultas.map(c => 
        c.id === consultaId ? { ...c, status: newStatus } : c
      )
    );
    alert(`Consulta ${newStatus === 'confirmada' ? 'confirmada' : 'cancelada'}! A visualização foi atualizada.`);
  };

  const processedData = useMemo(() => {
    return consultas.map(item => {
      const paciente = getPacienteData(item.pacienteId);
      const schedule = formatAppointmentDate(item.horario);
      return { ...item, ...paciente, ...schedule };
    });
  }, [consultas]);

  const filteredData = useMemo(() => {
    const tabStatusMap: { [key: string]: string } = {
      agendados: 'confirmada',
      solicitacoes: 'aguardando aprovacao',
      cancelados: 'cancelada',
    };
    const now = new Date();
    return processedData
      .filter(item => {
        if (activeTab === 'passados') {
          return new Date(item.horario) < now && (item.status === 'confirmada' || item.status === 'passada');
        }
        return item.status === tabStatusMap[activeTab];
      })
      .filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
  }, [activeTab, search, processedData]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Agendamentos</h1>

      <div className="flex items-center gap-6 border-b border-gray-200 mb-4 text-sm">
        <button onClick={() => setActiveTab('agendados')} className={`flex items-center gap-1 pb-2 ${activeTab === 'agendados' ? 'text-black font-medium border-b-2 border-blue-500' : 'text-gray-500'}`}>
          <Check className="w-4 h-4" /> Agendados
        </button>
        <button onClick={() => setActiveTab('solicitacoes')} className={`flex items-center gap-1 pb-2 ${activeTab === 'solicitacoes' ? 'text-blue-600 font-medium border-b-2 border-blue-500' : 'text-gray-500'}`}>
          <RefreshCw className="w-4 h-4" /> Solicitações
        </button>
        <button onClick={() => setActiveTab('cancelados')} className={`flex items-center gap-1 pb-2 ${activeTab === 'cancelados' ? 'text-black font-medium border-b-2 border-blue-500' : 'text-gray-500'}`}>
          <X className="w-4 h-4" /> Cancelados
        </button>
        <button onClick={() => setActiveTab('passados')} className={`flex items-center gap-1 pb-2 ${activeTab === 'passados' ? 'text-black font-medium border-b-2 border-blue-500' : 'text-gray-500'}`}>
          <CalendarDays className="w-4 h-4" /> Passados
        </button>
      </div>

      <div className="flex flex-wrap md:flex-nowrap md:items-center justify-between gap-4 mb-6">
        <Input
          icon={<Search className="w-4 h-4 text-gray-400" />}
          placeholder="Pesquisar por nome do paciente"
          className="max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-sm px-3 text-gray-500">Recentes</Button>
          <Button variant="outline" className="text-sm px-3">
            <Plus className="w-4 h-4 text-gray-400 mr-1" /> 
            <span className='text-gray-500'>Próximos</span>
          </Button>
          <Button variant="ghost" size="icon">
            <LayoutGrid className="w-5 h-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon">
            <List className="w-5 h-5 text-gray-500" />
          </Button>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        {filteredData.length > 0 ? (
          filteredData.map(item => {
            if (activeTab === 'solicitacoes') {
              return (
                <RequestCard
                  key={item.id}
                  {...item}
                  onAccept={() => handleUpdateStatus(item.id, 'confirmada')}
                  onReject={() => handleUpdateStatus(item.id, 'cancelada')}
                />
              );
            }
            // Para as outras abas (Agendados, Cancelados, Passados)
            return (
              <AppointmentCard
                key={item.id}
                name={item.name}
                date={item.date}
                time={item.time}
                status={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                avatarUrl={item.avatarUrl}
                // 👇 PASSANDO A FUNÇÃO DE CANCELAR PARA O COMPONENTE
                onCancel={() => handleUpdateStatus(item.id, 'cancelada')}
              />
            );
          })
        ) : (
          <p className="text-gray-500 w-full">Nenhum item encontrado nesta categoria.</p>
        )}
      </div>
    </div>
  );
}