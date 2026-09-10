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

  // Przywrócony bezpośredni URL do logo klubu
  const logoUrl = "https://muaythai-bydgoszcz.pl/wp-content/uploads/2024/08/logo_kolor1-768x465.png";

  // Przełączanie statusu składki po kliknięciu w pigułkę
  const togglePayment = (id: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, hasPaid: !m.hasPaid } : m));
  };

  // Przełączanie obecności po kliknięciu w pigułkę obecności
  const toggleAttendance = (id: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, isPresent: !m.isPresent } : m));
  };

  const filteredMembers = members.filter(m => {
    const matchesGroup = selectedGroup === 'Wszyscy' || m.group === selectedGroup;
    const matchesQuery = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-3 md:p-6 font-sans">
      
      {/* Nagłówek z przywróconym logo */}
      <header className="bg-[#FFDF00] p-4 rounded-2xl border-b-4 border-[#1251A2] flex items-center justify-between mb-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <img 
            src={logoUrl} 
            alt="Legion Bydgoszcz" 
            className="h-10 md:h-12 w-auto object-contain" 
          />
          <h1 className="font-extrabold text-[#1251A2] text-xs md:text-base leading-tight uppercase">
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
          className="bg-[#FFDF00] text-gray-900 font-bold text-xs md:text-sm p-2 rounded-xl outline-none cursor-pointer"
        >
          <option value="Wszyscy">Wszystkie grupy</option>
          <option value="Początkująca">Początkująca</option>
          <option value="Zaawansowana">Zaawansowana</option>
        </select>
      </div>

      {/* Lista zawodników – klikalne przyciski i pigułki */}
      <div className="space-y-3">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-[#1E293B] p-4 rounded-2xl border border-gray-800 shadow-md space-y-3">
            
            <h3 className="font-extrabold text-white text-base md:text-lg tracking-wide">
              {member.name}
            </h3>

            <div className="grid grid-cols-3 gap-2 items-center">
              
              {/* Klikalny status składki */}
              <button 
                type="button"
                onClick={() => togglePayment(member.id)}
                className={`p-2 rounded-xl text-[11px] leading-tight font-bold text-center flex flex-col justify-center h-full cursor-pointer transition active:scale-95 ${
                  member.hasPaid ? 'bg-green-500/20 text-green-300 border border-green-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}
              >
                <span>Składka:</span>
                <span>{member.hasPaid ? 'Opłacona ✓' : 'Zaległość ✕'}</span>
              </button>

              {/* Klikalny status obecności */}
              <button 
                type="button"
                onClick={() => toggleAttendance(member.id)}
                className={`p-2 rounded-xl text-[11px] leading-tight font-medium text-center flex flex-col justify-center h-full border transition active:scale-95 cursor-pointer ${
                  member.isPresent 
                    ? 'bg-blue-600/30 text-blue-200 border-blue-500' 
                    : 'bg-slate-800 text-gray-300 border-gray-700'
                }`}
              >
                <span>Obecność</span>
                <span className="text-[10px]">({member.lastAttendanceDate}): {member.isPresent ? 'Obecny ✓' : 'Brak'}</span>
              </button>

              {/* Przycisk Karta Zawodnika */}
              <button 
                type="button"
                onClick={() => alert(`Karta zawodnika: ${member.name}`)}
                className="bg-[#1251A2] hover:bg-blue-600 active:scale-95 text-white p-2 rounded-xl text-[11px] font-bold text-center flex flex-col items-center justify-center h-full border border-blue-400/30 transition cursor-pointer"
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
