'use client';

import { useState, useRef } from 'react';

interface Member {
  id: string;
  name: string;
  group: string;
  isPresent: boolean;
  hasPaid: boolean;
  lastAttendanceDate: string;
  avatarUrl?: string;
}

export default function Home() {
  const [selectedGroup, setSelectedGroup] = useState('Wszyscy');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);

  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Michał Nowak', group: 'Początkująca', isPresent: false, hasPaid: false, lastAttendanceDate: '09.01' },
    { id: '2', name: 'Jan Kowalski_test1', group: 'Zaawansowana', isPresent: false, hasPaid: true, lastAttendanceDate: '09.01' },
    { id: '3', name: 'Adam Nowak_test2', group: 'Początkująca', isPresent: false, hasPaid: false, lastAttendanceDate: '09.01' },
    { id: '4', name: 'Michał Wójcik_test4', group: 'Zaawansowana', isPresent: false, hasPaid: true, lastAttendanceDate: '09.01' },
    { id: '5', name: 'Paweł Zieliński_test7', group: 'Początkująca', isPresent: false, hasPaid: false, lastAttendanceDate: '09.01' },
    { id: '6', name: 'Marek Woźniak_test9', group: 'Zaawansowana', isPresent: false, hasPaid: false, lastAttendanceDate: '09.01' },
  ]);

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const logoUrl = "https://muaythai-bydgoszcz.pl/wp-content/uploads/2024/08/logo_kolor1-768x465.png";

  const togglePayment = (id: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, hasPaid: !m.hasPaid } : m));
  };

  const toggleAttendance = (id: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, isPresent: !m.isPresent } : m));
  };

  const toggleCard = (id: string) => {
    setExpandedMemberId(expandedMemberId === id ? null : id);
  };

  // Obsługa dodawania zdjęcia z aparatu / galerii natywnej
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
      
      {/* Nagłówek po zmianie nazwy */}
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

      {/* Tabela zawodników */}
      <div className="bg-[#1E293B] rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
        
        {/* Nagłówek Tabeli */}
        <div className="grid grid-cols-12 bg-[#0B132B] p-3 text-xs md:text-sm font-extrabold text-yellow-400 border-b border-gray-800 uppercase tracking-wider">
          <div className="col-span-1 text-center">Lp.</div>
          <div className="col-span-6 md:col-span-7 pl-2">Imię i Nazwisko</div>
          <div className="col-span-5 md:col-span-4 text-center">Składka / Akcje</div>
        </div>

        {/* Wiersze Tabeli */}
        <div className="divide-y divide-gray-800/60">
          {filteredMembers.map((member, index) => {
            const isExpanded = expandedMemberId === member.id;

            return (
              <div key={member.id} className="transition bg-[#1E293B] hover:bg-[#28354A]">
                
                {/* Główny Wiersz */}
                <div className="grid grid-cols-12 p-3 items-center text-xs md:text-sm">
                  
                  {/* Lp. */}
                  <div className="col-span-1 text-center font-bold text-gray-400">
                    {index + 1}.
                  </div>

                  {/* Imię i Nazwisko + Miniaturka zdjęcia */}
                  <div className="col-span-6 md:col-span-7 pl-2 flex items-center space-x-2">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt={member.name} className="w-7 h-7 rounded-full object-cover border border-yellow-400 shrink-0" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-gray-300 font-bold shrink-0">
                        👤
                      </div>
                    )}
                    <span className="font-bold text-white truncate">{member.name}</span>
                  </div>

                  {/* Kolumna Składki i Przycisku Karty */}
                  <div className="col-span-5 md:col-span-4 flex items-center justify-end space-x-1.5">
                    
                    {/* Status Składki */}
                    <button 
                      type="button"
                      onClick={() => togglePayment(member.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] md:text-xs font-bold transition active:scale-95 ${
                        member.hasPaid 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/40' 
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {member.hasPaid ? 'Opłacona ✓' : 'Zaległość ✕'}
                    </button>

                    {/* Przycisk Rozwijania Karty */}
                    <button 
                      type="button"
                      onClick={() => toggleCard(member.id)}
                      className="bg-[#1251A2] hover:bg-blue-600 active:scale-95 text-white px-2 py-1 rounded-lg text-[10px] md:text-xs font-bold border border-blue-400/30 transition flex items-center space-x-1 shrink-0"
                    >
                      <span>Karta</span>
                      <span>{isExpanded ? '▲' : '▼'}</span>
                    </button>

                  </div>
                </div>

                {/* Rozwijana Karta Zawodnika z obsługą Aparatu / Zdjęcia */}
                {isExpanded && (
                  <div className="bg-[#0F172A] p-4 border-t border-gray-800 space-y-4">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      
                      {/* Podgląd Zdjęcia i Przycisk Wyboru z Aparatu */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-24 h-24 rounded-2xl bg-slate-800 border-2 border-yellow-400 overflow-hidden flex items-center justify-center shadow-inner">
                          {member.avatarUrl ? (
                            <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl text-gray-500">📷</span>
                          )}
                        </div>

                        {/* Ukryty Input wywołujący Natywny Aparat / Galerię */}
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

                      {/* Szczegóły Zawodnika */}
                      <div className="flex-1 w-full space-y-2 text-xs md:text-sm">
                        <div className="flex justify-between border-b border-gray-800 pb-1">
                          <span className="text-gray-400">Grupa treningowa:</span>
                          <span className="font-bold text-yellow-400">{member.group}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-800 pb-1">
                          <span className="text-gray-400">Ostatnia obecność:</span>
                          <span className="font-bold">{member.lastAttendanceDate}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-800 pb-1">
                          <span className="text-gray-400">Status obecności dziś:</span>
                          <button 
                            onClick={() => toggleAttendance(member.id)}
                            className={`font-bold px-2 py-0.5 rounded text-xs ${
                              member.isPresent ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
                            }`}
                          >
                            {member.isPresent ? 'Obecny ✓' : 'Brak (kliknij aby zmienić)'}
                          </button>
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
