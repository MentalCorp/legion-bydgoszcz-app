'use client';

import { useState, useRef } from 'react';

interface Member {
  id: string;
  name: string;
  group: string;
  hasPaid: boolean;
  attendanceHistory: { [date: string]: boolean };
  avatarUrl?: string;
  phone?: string;
  joinDate?: string;
}

export default function Home() {
  const [selectedGroup, setSelectedGroup] = useState('Wszyscy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);

  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Michał Nowak', group: 'Początkująca', hasPaid: false, attendanceHistory: {}, phone: '500-111-222', joinDate: '2024-01-15' },
    { id: '2', name: 'Jan Kowalski_test1', group: 'Zaawansowana', hasPaid: true, attendanceHistory: {}, phone: '600-333-444', joinDate: '2023-09-01' },
    { id: '3', name: 'Adam Nowak_test2', group: 'Początkująca', hasPaid: false, attendanceHistory: {}, phone: '700-555-666', joinDate: '2024-03-10' },
    { id: '4', name: 'Michał Wójcik_test4', group: 'Zaawansowana', hasPaid: true, attendanceHistory: {}, phone: '501-777-888', joinDate: '2023-11-20' },
    { id: '5', name: 'Paweł Zieliński_test7', group: 'Początkująca', hasPaid: false, attendanceHistory: {}, phone: '602-999-000', joinDate: '2024-02-01' },
    { id: '6', name: 'Marek Woźniak_test9', group: 'Zaawansowana', hasPaid: false, attendanceHistory: {}, phone: '703-123-456', joinDate: '2023-08-12' },
  ]);

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const logoUrl = "https://muaythai-bydgoszcz.pl/wp-content/uploads/2024/08/logo_kolor1-768x465.png";

  const togglePayment = (id: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, hasPaid: !m.hasPaid } : m));
  };

  const toggleAttendance = (id: string, date: string) => {
    setMembers(members.map(m => {
      if (m.id === id) {
        const currentStatus = m.attendanceHistory[date] || false;
        return {
          ...m,
          attendanceHistory: {
            ...m.attendanceHistory,
            [date]: !currentStatus
          }
        };
      }
      return m;
    }));
  };

  const toggleCard = (id: string) => {
    setExpandedMemberId(expandedMemberId === id ? null : id);
  };

  const handleImageChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMembers(members.map(m => m.id === id ? { ...m, avatarUrl: reader.result as string } : m));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesGroup = selectedGroup === 'Wszyscy' || m.group === selectedGroup;
    const matchesQuery = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-3 md:p-6 font-sans">
      
      {/* Nagłówek */}
      <header className="bg-[#FFDF00] p-4 rounded-2xl border-b-4 border-[#1251A2] flex items-center justify-between mb-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <img 
            src={logoUrl} 
            alt="Legion Bydgoszcz" 
            className="h-10 md:h-12 w-auto object-contain" 
          />
          <h1 className="font-extrabold text-[#1251A2] text-base md:text-xl leading-tight uppercase tracking-wide">
            BAZA ZAWODNIKÓW
          </h1>
        </div>
      </header>

      {/* Wyszukiwarka */}
      <div className="bg-[#1E293B] p-4 rounded-2xl border border-yellow-500/40 shadow-md mb-4">
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

      {/* Pasek filtrowania oraz wyboru daty treningu */}
      <div className="bg-[#1E293B] p-4 rounded-2xl border border-gray-700 mb-6 flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        
        {/* Wybór daty treningu do sprawozdania obecności */}
        <div className="flex items-center justify-between md:justify-start gap-2 bg-[#0F172A] p-2.5 rounded-xl border border-yellow-500/50">
          <span className="font-bold text-yellow-400 text-xs md:text-sm flex items-center gap-1">
            📅 Data treningu:
          </span>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#FFDF00] text-gray-900 font-bold text-xs md:text-sm px-2 py-1 rounded-lg outline-none cursor-pointer"
          />
        </div>

        {/* Filtr grupy */}
        <div className="flex items-center justify-between md:justify-start gap-2">
          <span className="font-bold text-gray-300 text-xs md:text-sm">Grupa:</span>
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

      </div>

      {/* Tabela zawodników z bezpośrednim odznaczaniem obecności */}
      <div className="bg-[#1E293B] rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
        
        {/* Nagłówek Tabeli */}
        <div className="grid grid-cols-12 bg-[#0B132B] p-3 text-[11px] md:text-xs font-extrabold text-yellow-400 border-b border-gray-800 uppercase tracking-wider items-center">
          <div className="col-span-1 text-center">Lp.</div>
          <div className="col-span-4 md:col-span-5 pl-1">Zawodnik</div>
          <div className="col-span-3 text-center">Obecność ({selectedDate.slice(5)})</div>
          <div className="col-span-2 text-center">Składka</div>
          <div className="col-span-2 md:col-span-1 text-right pr-1">Karta</div>
        </div>

        {/* Wiersze Tabeli */}
        <div className="divide-y divide-gray-800/60">
          {filteredMembers.map((member, index) => {
            const isExpanded = expandedMemberId === member.id;
            const isPresentToday = member.attendanceHistory[selectedDate] || false;

            return (
              <div key={member.id} className="transition bg-[#1E293B] hover:bg-[#28354A]">
                
                {/* Wiersz główny z szybką obecnością */}
                <div className="grid grid-cols-12 p-2.5 md:p-3 items-center text-xs md:text-sm">
                  
                  {/* Lp. */}
                  <div className="col-span-1 text-center font-bold text-gray-400">
                    {index + 1}.
                  </div>

                  {/* Zawodnik */}
                  <div className="col-span-4 md:col-span-5 pl-1 flex items-center space-x-2">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt={member.name} className="w-7 h-7 rounded-full object-cover border border-yellow-400 shrink-0" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-gray-300 font-bold shrink-0">
                        👤
                      </div>
                    )}
                    <span className="font-bold text-white truncate">{member.name}</span>
                  </div>

                  {/* OBECNOŚĆ – Dedykowany Przycisk Trenera */}
                  <div className="col-span-3 px-1 text-center">
                    <button 
                      type="button"
                      onClick={() => toggleAttendance(member.id, selectedDate)}
                      className={`w-full py-1.5 px-2 rounded-xl font-extrabold text-[10px] md:text-xs transition active:scale-95 border flex items-center justify-center space-x-1 ${
                        isPresentToday 
                          ? 'bg-green-600 border-green-400 text-white shadow-lg shadow-green-900/50' 
                          : 'bg-slate-800 border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <span>{isPresentToday ? 'OBECNY ✓' : 'NIEOBECNY'}</span>
                    </button>
                  </div>

                  {/* SKŁADKA */}
                  <div className="col-span-2 px-1 text-center">
                    <button 
                      type="button"
                      onClick={() => togglePayment(member.id)}
                      className={`w-full py-1.5 px-1 rounded-xl text-[10px] md:text-xs font-bold transition active:scale-95 border ${
                        member.hasPaid 
                          ? 'bg-green-500/20 text-green-300 border-green-500/40' 
                          : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                    >
                      {member.hasPaid ? 'Opłacona' : 'Zaległość'}
                    </button>
                  </div>

                  {/* Przycisk Karty */}
                  <div className="col-span-2 md:col-span-1 text-right pr-1">
                    <button 
                      type="button"
                      onClick={() => toggleCard(member.id)}
                      className="bg-[#1251A2] hover:bg-blue-600 active:scale-95 text-white py-1.5 px-2 rounded-xl text-[10px] font-bold border border-blue-400/30 transition inline-flex items-center space-x-1"
                    >
                      <span>Karta</span>
                      <span>{isExpanded ? '▲' : '▼'}</span>
                    </button>
                  </div>

                </div>

                {/* Pełna Karta Zawodnika */}
                {isExpanded && (
                  <div className="bg-[#0F172A] p-4 border-t border-gray-800 space-y-4">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      
                      {/* Aparat / Galeria / Zdjęcie */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-24 h-24 rounded-2xl bg-slate-800 border-2 border-yellow-400 overflow-hidden flex items-center justify-center shadow-inner">
                          {member.avatarUrl ? (
                            <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl text-gray-500">📷</span>
                          )}
                        </div>

                        <input 
                          type="file" 
                          accept="image/*"
                          capture="environment"
                          ref={(el) => { fileInputRefs.current[member.id] = el; }}
                          onChange={(e) => handleImageChange(member.id, e)}
                          className="hidden"
                        />

                        <button 
                          type="button"
                          onClick={() => fileInputRefs.current[member.id]?.click()}
                          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-xs py-1.5 px-3 rounded-xl transition active:scale-95 shadow"
                        >
                          {member.avatarUrl ? 'Zmień zdjęcie 📷' : 'Dodaj zdjęcie 📷'}
                        </button>
                      </div>

                      {/* Komplet danych w karcie */}
                      <div className="flex-1 w-full space-y-2 text-xs md:text-sm">
                        <div className="flex justify-between border-b border-gray-800 pb-1">
                          <span className="text-gray-400">Imię i Nazwisko:</span>
                          <span className="font-bold text-white">{member.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-800 pb-1">
                          <span className="text-gray-400">Grupa treningowa:</span>
                          <span className="font-bold text-yellow-400">{member.group}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-800 pb-1">
                          <span className="text-gray-400">Telefon kontaktowy:</span>
                          <span className="font-bold text-gray-200">{member.phone || 'Brak danych'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-800 pb-1">
                          <span className="text-gray-400">Data dołączenia:</span>
                          <span className="font-bold text-gray-200">{member.joinDate || 'Brak danych'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-800 pb-1">
                          <span className="text-gray-400">Obecności łącznie:</span>
                          <span className="font-bold text-green-400">
                            {Object.values(member.attendanceHistory).filter(Boolean).length} treningów
                          </span>
                        </div>
                      </div>

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
