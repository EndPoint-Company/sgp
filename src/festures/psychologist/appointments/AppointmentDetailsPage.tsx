// src/features/psychologist/home/HomePage.tsx
import React, { useState } from 'react';
import RequestCard from '../components/RequestCard';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { LayoutGrid, List, CalendarDays, RefreshCw, X, Check, Search, Plus } from 'lucide-react';

export default function AppointmentDetailsPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'agendados' | 'solicitacoes' | 'cancelados' | 'passados'>('solicitacoes');

  const mockRequests = [
    {
      name: 'Carlos Andrade',
      date: 'Sexta, 13 Maio 2025',
      time: '09:00 às 10:00',
      avatarUrl: 'https://i.pravatar.cc/40',
    },
    {
      name: 'Ana Paula',
      date: 'Sábado, 14 Maio 2025',
      time: '10:00 às 11:00',
      avatarUrl: 'https://i.pravatar.cc/40',
    },
    {
      name: 'Roberto Silva',
      date: 'Domingo, 15 Maio 2025',
      time: '11:00 às 12:00',
      avatarUrl: 'https://i.pravatar.cc/40',
    },
    {
      name: 'Fernanda Costa',
      date: 'Segunda, 16 Maio 2025',
      time: '12:00 às 13:00',
      avatarUrl: 'https://i.pravatar.cc/40',
    },

  ];

  const filteredRequests = mockRequests.filter((req) =>
    req.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Solicitações</h1>

      {/* Menu superior de tabs */}
      <div className="flex items-center gap-6 border-b border-gray-200 mb-4 text-sm">
        <button
          onClick={() => setActiveTab('agendados')}
          className={`flex items-center gap-1 pb-2 ${activeTab === 'agendados' ? 'text-black font-medium border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          <Check className="w-4 h-4" /> Agendados
        </button>

        <button
          onClick={() => setActiveTab('solicitacoes')}
          className={`flex items-center gap-1 pb-2 ${activeTab === 'solicitacoes' ? 'text-blue-600 font-medium border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          <RefreshCw className="w-4 h-4" /> Solicitações
        </button>

        <button
          onClick={() => setActiveTab('cancelados')}
          className={`flex items-center gap-1 pb-2 ${activeTab === 'cancelados' ? 'text-black font-medium border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          <X className="w-4 h-4" /> Cancelados
        </button>

        <button
          onClick={() => setActiveTab('passados')}
          className={`flex items-center gap-1 pb-2 ${activeTab === 'passados' ? 'text-black font-medium border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          <CalendarDays className="w-4 h-4" /> Passados
        </button>
      </div>

      {/* Menu de pesquisa e filtros */}
      <div className="flex flex-wrap md:flex-nowrap md:items-center justify-between gap-4 mb-6">
        <Input
          icon={<Search className="w-4 h-4 text-gray-400" />}
          placeholder="Pesquisar"
          className="max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-sm px-3 text-gray-500">Recentes</Button>
          <Button variant="outline" className="text-sm px-3">
            <Plus className="w-4 h-4 text-gray-400 mr-1" /> 
            <span className='text-gray-500'>
              Próximos
            </span>
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
        {filteredRequests.map((req, index) => (
          <RequestCard
            key={index}
            {...req}
            onAccept={() => alert('Aceito')}
            onReject={() => alert('Recusado')}
          />
        ))}
      </div>
    </div>
  );
}
