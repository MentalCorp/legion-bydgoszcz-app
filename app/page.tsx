'use client';

import { useState } from 'react';

interface Member {
  id: string;
  name: string;
  group: string;
  isPresent: boolean;
  hasPaid: boolean;
  lastAttendanceDate: string;
}

export default function Home() {
  const [selectedGroup, setSelectedGroup] = useState('Wszyscy');
  const [searchQuery, setSearchQuery] = useState('');

  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Michał Nowak', group: 'Początkująca', isPresent: false, hasPaid: false, lastAttendanceDate: '09.01' },
    { id: '2', name: 'Jan Kowalski_test1', group: 'Zaawansowana', isPresent: false, hasPaid: false, lastAttendanceDate: '09.01' },
    { id: '3', name: 'Adam Nowak_test2', group: 'Początkująca', isPresent: false, hasPaid: false, lastAttendanceDate: '09.01' },
    { id: '4', name: 'Michał Wójcik_test4', group: 'Zaawansowana', isPresent: false, hasPaid: false, lastAttendanceDate: '09.01' },
    { id: '5', name: 'Paweł Zieliński_test7', group: 'Początkująca', isPresent: false, hasPaid: false, lastAttendanceDate: '09.01' },
    { id: '6', name: 'Marek Woźniak_test9', group: 'Zaawansowana', isPresent: false, hasPaid: false, lastAttendanceDate: '09.01' },
  ]);

  const logoUrl = "https://placehold.co/200x100/FFDF00/1251A2?text=LEGION";

  const filteredMembers = members.filter(m => {
    const matchesGroup = selectedGroup === 'Wszyscy' || m.group === selectedGroup;
    const matchesQuery = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-3 md:p-6 font-sans">
      
      {/* Nagłówek z nową nazwą i Logo */}
      <header className="bg-[#FFDF00] p-4 rounded-2xl border-b-4 border-[#1251A2] flex items-center justify-between mb-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <img 
            src={logoUrl} 
            alt="Legion Bydgoszcz" 
            className="h-10 md:h-12 w-auto object-contain rounded" 
          />
          <h1 className="font-extrabold text-[#1251A2] text-sm md:text-lg leading-tight uppercase">
            BAZA ZAWODNIKÓW MUAYTHAI LEGION BYDGOSZCZ
          </h1>
        </div>
      </header>

      {/* Wyszukiwarka zawodników */}
      <div className="bg-[#1E293B] p-4 rounded-2xl border border-yellow-500/40 shadow-md mb-6">
        <label className="block text-yellow-400 font-bold text-xs md:text-sm mb-2 flex items-center gap-2">
          <span>🔍</span> WYSZUKIWARKA ZAWODNIKÓW
        </label>
        <input 
          type="text"
          placeholder="Wpisz min. 3 znaki aby wyszukać..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white text-gray-900 px-4 py-2.5 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400"
        />
      </div>

      {/* Wybór grupy */}
      <div className="bg-[#1E293B] p-4 rounded-2xl border border-gray-700 mb-6 flex justify-between items-center">
        <span className="font-bold text-gray-300 text-sm">Filtruj grupę:</span>
        <select 
          value={selectedGroup} 
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="bg-[#FFDF00] text-gray-900 font-bold text-xs md:text-sm p-2 rounded-xl outline-none"
        >
          <option value="Wszyscy">Wszystkie grupy</option>
          <option value="Początkująca">Początkująca</option>
          <option value="Zaawansowana">Zaawansowana</option>
        </select>
      </div>

      {/* Lista zawodników z naprawionym układem na Androida */}
      <div className="space-y-3">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-[#1E293B] p-4 rounded-2xl border border-gray-800 shadow-md space-y-3">
            
            {/* Imię i nazwisko */}
            <h3 className="font-extrabold text-white text-base md:text-lg tracking-wide">
              {member.name}
            </h3>

            {/* Naprawiony Grid 3-kolumnowy (Nic się nie nakłada i nie rozjeżdża) */}
            <div className="grid grid-cols-3 gap-2 items-center">
              
              {/* Pigułka Składki */}
              <div className={`p-2 rounded-xl text-[11px] leading-tight font-bold text-center flex flex-col justify-center h-full ${
                member.hasPaid ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                <span>Składka:</span>
                <span>{member.hasPaid ? 'Opłacona ✓' : 'Zaległość ✕'}</span>
              </div>

              {/* Pigułka Obecności */}
              <div className="bg-slate-800 text-gray-300 p-2 rounded-xl text-[11px] leading-tight font-medium text-center flex flex-col justify-center h-full border border-gray-700">
                <span>Obecność</span>
                <span className="text-gray-400 text-[10px]">({member.lastAttendanceDate}): {member.isPresent ? 'Obecny' : 'Brak'}</span>
              </div>

              {/* Przycisk Karta Zawodnika */}
              <button 
                onClick={() => alert(`Karta zawodnika: ${member.name}`)}
                className="bg-[#1251A2] hover:bg-blue-600 active:scale-95 text-white p-2 rounded-xl text-[11px] font-bold text-center flex flex-col items-center justify-center h-full border border-blue-400/30 transition"
              >
                <span>Karta</span>
                <span className="text-[10px] font-normal">zawodnika 📋</span>
              </button>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
