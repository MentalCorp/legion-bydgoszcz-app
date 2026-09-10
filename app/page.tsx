'use client';

import { useState } from 'react';

interface Member {
  id: string;
  lp: number;
  name: string;
  group: string;
  isPresent: boolean;
  hasPaid: boolean;
}

export default function Home() {
  const [selectedGroup, setSelectedGroup] = useState('Wszystkie grupy');
  const [searchQuery, setSearchQuery] = useState('');
  const [trainingDate, setTrainingDate] = useState('10.09.2026');
  
  // Stan do przechowywania ID otwartej karty zawodnika
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);

  const [members, setMembers] = useState<Member[]>([
    { id: '1', lp: 1, name: 'Michał Nowak', group: 'Początkująca', isPresent: false, hasPaid: false },
    { id: '2', lp: 2, name: 'Jan Kowalski_test1', group: 'Zaawansowana', isPresent: false, hasPaid: true },
    { id: '3', lp: 3, name: 'Adam Nowak_test2', group: 'Początkująca', isPresent: false, hasPaid: false },
  ]);

  const logoUrl = "https://muaythai-bydgoszcz.pl/wp-content/uploads/2024/08/logo_kolor1-768x465.png";

  const toggleAttendance = (id: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, isPresent: !m.isPresent } : m));
  };

  const togglePayment = (id: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, hasPaid: !m.hasPaid } : m));
  };

  // Otwieranie / zamykanie karty zawodnika
  const toggleCard = (id: string) => {
    setExpandedMemberId(expandedMemberId === id ? null : id);
  };

  const filteredMembers = members.filter(m => {
    const matchesGroup = selectedGroup === 'Wszystkie grupy' || m.group === selectedGroup;
    const matchesQuery = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#0B132B] text-white p-3 sm:p-5 font-sans space-y-4">
      
      {/* 1. Nagłówek Główny */}
      <header className="bg-[#1C2541] p-3 sm:p-4 rounded-2xl border border-gray-700/60 shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={logoUrl} 
            alt="Legion Bydgoszcz" 
            className="h-10 sm:h-12 w-auto object-contain" 
          />
          <div>
            <h1 className="font-black text-white text-sm sm:text-base tracking-wider uppercase leading-none">
              BAZA ZAWODNIKÓW
            </h1>
            <p className="text-[10px] sm:text-xs text-yellow-400 font-bold tracking-widest mt-0.5">
              LEGION BYDGOSZCZ
            </p>
          </div>
        </div>
      </header>

      {/* 2. Wyszukiwarka */}
      <div className="bg-[#1C2541] p-3.5 rounded-2xl border border-gray-700/60 shadow-md">
        <label className="block text-yellow-400 font-bold text-xs mb-1.5 flex items-center gap-1.5">
          <span>🔍</span> WYSZUKIWARKA ZAWODNIKÓW
        </label>
        <input 
          type="text"
          placeholder="Wpisz min. 3 znaki aby wyszukać..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0B132B] text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-gray-700/80 outline-none focus:border-yellow-400 placeholder-gray-500"
        />
      </div>

      {/* 3. Panel Filtrowania i Daty */}
      <div className="bg-[#1C2541] p-3.5 rounded-2xl border border-gray-700/60 shadow-md space-y-3">
        <div className="flex items-center justify-between bg-[#0B132B] p-2 sm:p-2.5 rounded-xl border border-gray-700/80">
          <span className="text-xs font-bold text-yellow-400 flex items-center gap-1">
            <span>📅</span> Data treningu:
          </span>
          <input 
            type="text" 
            value={trainingDate}
            onChange={(e) => setTrainingDate(e.target.value)}
            className="bg-[#FFDF00] text-gray-900 font-extrabold text-xs px-3 py-1 rounded-lg text-center outline-none w-28"
          />
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={selectedGroup} 
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="bg-[#0B132B] text-white font-semibold text-xs p-2.5 rounded-xl border border-gray-700/80 outline-none flex-1 cursor-pointer"
          >
            <option value="Wszystkie grupy">Wszystkie grupy</option>
            <option value="Początkująca">Początkująca</option>
            <option value="Zaawansowana">Zaawansowana</option>
          </select>

          {/* Poprawiony przycisk bez błędu w literze "A" */}
          <button 
            type="button"
            onClick={() => alert('Dodaj nowego zawodnika')}
            className="bg-[#059669] hover:bg-emerald-600 text-white font-bold text-xs px-3 py-2.5 rounded-xl flex items-center justify-center gap-1 shadow transition active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <span>+</span> DODAJ ZAWODNIKA
          </button>
        </div>
      </div>

      {/* 4. Tabela Zawodników */}
      <div className="bg-[#1C2541] rounded-2xl border border-gray-700/60 shadow-lg overflow-hidden">
        
        {/* Nagłówek Tabeli */}
        <div className="grid grid-cols-12 gap-1 items-center px-3 py-2.5 border-b border-gray-700/80 bg-[#161F38] text-[10px] sm:text-xs font-black text-yellow-400 uppercase tracking-wider">
          <div className="col-span-1 text-center">LP.</div>
          <div className="col-span-5 pl-1">ZAWODNIK</div>
          <div className="col-span-2 text-center text-[9px] sm:text-[10px] leading-tight">OBECNOŚĆ</div>
          <div className="col-span-2 text-center text-[9px] sm:text-[10px] leading-tight">SKŁADKA</div>
          <div className="col-span-2 text-center text-[9px] sm:text-[10px] leading-tight">KARTA</div>
        </div>

        {/* Lista Zawodników */}
        <div className="divide-y divide-gray-800/80">
          {filteredMembers.map((member) => {
            const isCardOpen = expandedMemberId === member.id;

            return (
              <div key={member.id} className="transition">
                {/* Główny Wiersz */}
                <div className="grid grid-cols-12 gap-1 items-center px-3 py-3 hover:bg-[#232F52] text-xs">
                  
                  {/* LP */}
                  <div className="col-span-1 text-center font-bold text-gray-400">
                    {member.lp}.
                  </div>

                  {/* Awatar + Nazwisko */}
                  <div className="col-span-5 flex items-center space-x-2 pl-1 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-gray-600 flex items-center justify-center text-gray-400 shrink-0 text-xs">
                      👤
                    </div>
                    <span className="font-bold text-white truncate text-xs">
                      {member.name}
                    </span>
                  </div>

                  {/* Wskaźnik Obecności */}
                  <div className="col-span-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => toggleAttendance(member.id)}
                      title="Przełącz obecność"
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition active:scale-90 cursor-pointer ${
                        member.isPresent 
                          ? 'bg-emerald-500 shadow-md shadow-emerald-900/50' 
                          : 'bg-rose-600 shadow-md shadow-rose-900/50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-white opacity-40"></span>
                    </button>
                  </div>

                  {/* Wskaźnik Składki */}
                  <div className="col-span-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => togglePayment(member.id)}
                      title="Przełącz składkę"
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition active:scale-90 cursor-pointer ${
                        member.hasPaid 
                          ? 'bg-emerald-500 shadow-md shadow-emerald-900/50' 
                          : 'bg-rose-600 shadow-md shadow-rose-900/50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-white opacity-40"></span>
                    </button>
                  </div>

                  {/* Przycisk Karta (Działający Klik!) */}
                  <div className="col-span-2 flex justify-center">
                    <button 
                      type="button"
                      onClick={() => toggleCard(member.id)}
                      title="Otwórz profil zawodnika"
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition active:scale-90 shadow-md cursor-pointer text-[10px] ${
                        isCardOpen 
                          ? 'bg-yellow-400 text-gray-900 font-bold' 
                          : 'bg-[#1D4ED8] hover:bg-blue-600 text-white shadow-blue-900/40'
                      }`}
                    >
                      {isCardOpen ? '▲' : '▼'}
                    </button>
                  </div>

                </div>

                {/* Rozwijana Karta Zawodnika */}
                {isCardOpen && (
                  <div className="bg-[#0D1B2A] p-4 border-t border-b border-yellow-500/30 text-xs space-y-3">
                    <div className="flex justify-between items-start border-b border-gray-800 pb-2">
                      <div>
                        <p className="text-yellow-400 font-bold text-sm">{member.name}</p>
                        <p className="text-gray-400 text-[11px]">Grupa: {member.group}</p>
                      </div>
                      <span className="bg-blue-900/60 text-blue-300 border border-blue-700 px-2 py-0.5 rounded text-[10px]">
                        ID: #{member.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-[#1C2541] p-2 rounded-lg border border-gray-800">
                        <span className="text-gray-400 block mb-1">Status Składki:</span>
                        <span className={member.hasPaid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {member.hasPaid ? 'Opłacona ✓' : 'Zaległość ✕'}
                        </span>
                      </div>
                      <div className="bg-[#1C2541] p-2 rounded-lg border border-gray-800">
                        <span className="text-gray-400 block mb-1">Dzisiejsza Obecność:</span>
                        <span className={member.isPresent ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {member.isPresent ? 'Obecny ✓' : 'Nieobecny ✕'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button 
                        type="button"
                        onClick={() => alert(`Edycja zawodnika: ${member.name}`)}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-200 py-1.5 rounded-lg font-semibold text-[11px] border border-gray-700 transition"
                      >
                        ✏️ Edytuj Profil
                      </button>
                      <button 
                        type="button"
                        onClick={() => alert(`Historia obecności: ${member.name}`)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-gray-900 py-1.5 rounded-lg font-bold text-[11px] transition"
                      >
                        📊 Historia
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
