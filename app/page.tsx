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
            className="bg-[#0B132B] text-white font-semibold text-xs p-2.5 rounded-xl border border-gray-700/80 outline-none flex-1"
          >
            <option value="Wszystkie grupy">Wszystkie grupy</option>
            <option value="Początkująca">Początkująca</option>
            <option value="Zaawansowana">Zaawansowana</option>
          </select>

          <button 
            type="button"
            onClick={() => alert('Dodaj zawodnika')}
            className="bg-[#059669] hover:bg-emerald-600 text-white font-bold text-xs px-3 py-2.5 rounded-xl flex items-center justify-center gap-1 shadow transition active:scale-95 whitespace-nowrap"
          >
            <span>+</span> DODAJ ZAWODNIKÁ
          </button>
        </div>
      </div>

      {/* 4. Tabela z idealnie dopasowaną siatką (Grid 12-kolumnowy) */}
      <div className="bg-[#1C2541] rounded-2xl border border-gray-700/60 shadow-lg overflow-hidden">
        
        {/* Nagłówek Tabeli z dopasowanymi szerokościami */}
        <div className="grid grid-cols-12 gap-1 items-center px-3 py-2.5 border-b border-gray-700/80 bg-[#161F38] text-[10px] sm:text-xs font-black text-yellow-400 uppercase tracking-wider">
          <div className="col-span-1 text-center">LP.</div>
          <div className="col-span-5 pl-1">ZAWODNIK</div>
          <div className="col-span-2 text-center text-[9px] sm:text-[10px] leading-tight">OBECNOŚĆ</div>
          <div className="col-span-2 text-center text-[9px] sm:text-[10px] leading-tight">SKŁADKA</div>
          <div className="col-span-2 text-center text-[9px] sm:text-[10px] leading-tight">KARTA</div>
        </div>

        {/* Wiersze Zawodników */}
        <div className="divide-y divide-gray-800/80">
          {filteredMembers.map((member) => (
            <div 
              key={member.id} 
              className="grid grid-cols-12 gap-1 items-center px-3 py-3 hover:bg-[#232F52] transition text-xs"
            >
              {/* LP */}
              <div className="col-span-1 text-center font-bold text-gray-400">
                {member.lp}.
              </div>

              {/* Awatar + Imię i Nazwisko */}
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
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition active:scale-90 ${
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
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition active:scale-90 ${
                    member.hasPaid 
                      ? 'bg-emerald-500 shadow-md shadow-emerald-900/50' 
                      : 'bg-rose-600 shadow-md shadow-rose-900/50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white opacity-40"></span>
                </button>
              </div>

              {/* Przycisk Karta (Niebieskie Kółko) */}
              <div className="col-span-2 flex justify-center">
                <button 
                  type="button"
                  onClick={() => alert(`Karta zawodnika: ${member.name}`)}
                  title="Rozwiń kartę zawodnika"
                  className="w-7 h-7 rounded-full bg-[#1D4ED8] hover:bg-blue-600 text-white flex items-center justify-center transition active:scale-90 shadow-md shadow-blue-900/40 text-[10px]"
                >
                  ▼
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
