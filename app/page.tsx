'use client';

import { useState, useRef } from 'react';

interface Member {
  id: string;
  lp: number;
  name: string;
  group: string;
  isPresent: boolean;
  hasPaid: boolean;
  photoUrl?: string;
  phone?: string;
  joinDate?: string;
  notes?: string;
}

export default function Home() {
  const [selectedGroup, setSelectedGroup] = useState('Wszystkie grupy');
  const [searchQuery, setSearchQuery] = useState('');
  const [trainingDate, setTrainingDate] = useState('10.09.2026');
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePhotoMemberId, setActivePhotoMemberId] = useState<string | null>(null);

  const [members, setMembers] = useState<Member[]>([
    { 
      id: '1', 
      lp: 1, 
      name: 'Michał Nowak', 
      group: 'Początkująca', 
      isPresent: false, 
      hasPaid: false,
      phone: '+48 600 111 222',
      joinDate: '12.01.2025',
      notes: 'Brak przeciwwskazań zdrowotnych. Grupa B.'
    },
    { 
      id: '2', 
      lp: 2, 
      name: 'Jan Kowalski_test1', 
      group: 'Zaawansowana', 
      isPresent: false, 
      hasPaid: true,
      phone: '+48 500 222 333',
      joinDate: '05.09.2024',
      notes: 'Ochraniacze piszczeli zakupione.'
    },
    { 
      id: '3', 
      lp: 3, 
      name: 'Adam Nowak_test2', 
      group: 'Początkująca', 
      isPresent: false, 
      hasPaid: false,
      phone: '+48 700 333 444',
      joinDate: '01.02.2026',
      notes: 'Wymagana zgoda rodzica.'
    },
  ]);

  const logoUrl = "https://muaythai-bydgoszcz.pl/wp-content/uploads/2024/08/logo_kolor1-768x465.png";

  const toggleAttendance = (id: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, isPresent: !m.isPresent } : m));
  };

  const togglePayment = (id: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, hasPaid: !m.hasPaid } : m));
  };

  const toggleCard = (id: string) => {
    setExpandedMemberId(expandedMemberId === id ? null : id);
  };

  // Obsługa aparatu / wyboru pliku
  const triggerCamera = (memberId: string) => {
    setActivePhotoMemberId(memberId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activePhotoMemberId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setMembers(members.map(m => m.id === activePhotoMemberId ? { ...m, photoUrl: base64Image } : m));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesGroup = selectedGroup === 'Wszystkie grupy' || m.group === selectedGroup;
    const matchesQuery = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#0B132B] text-white p-3 sm:p-5 font-sans space-y-4">
      
      {/* Ukryty input do przechwytywania zdjęcia z aparatu Androida */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef} 
        onChange={handlePhotoCapture} 
        className="hidden" 
      />

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

          <button 
            type="button"
            onClick={() => alert('Dodaj nowego zawodnika')}
            className="bg-[#059669] hover:bg-emerald-600 text-white font-bold text-xs px-3 py-2.5 rounded-xl flex items-center justify-center gap-1 shadow transition active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <span>+</span> DODAJ ZAWODNIKA
          </button>
        </div>
      </div>

      {/* 4. Tabela Zawodników z Miniaturami Zdjęć */}
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

                  {/* Miniatura Zdjęcia + Nazwisko */}
                  <div className="col-span-5 flex items-center space-x-2 pl-1 min-w-0">
                    <button 
                      type="button"
                      onClick={() => triggerCamera(member.id)}
                      title="Kliknij, aby zrobić/zmienić zdjęcie"
                      className="w-8 h-8 rounded-full bg-slate-800 border border-yellow-500/50 flex items-center justify-center overflow-hidden shrink-0 relative group cursor-pointer"
                    >
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs">📷</span>
                      )}
                    </button>
                    <span className="font-bold text-white truncate text-xs">
                      {member.name}
                    </span>
                  </div>

                  {/* Wskaźnik Obecności */}
                  <div className="col-span-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => toggleAttendance(member.id)}
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
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition active:scale-90 cursor-pointer ${
                        member.hasPaid 
                          ? 'bg-emerald-500 shadow-md shadow-emerald-900/50' 
                          : 'bg-rose-600 shadow-md shadow-rose-900/50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-white opacity-40"></span>
                    </button>
                  </div>

                  {/* Przycisk Karta Zawodnika */}
                  <div className="col-span-2 flex justify-center">
                    <button 
                      type="button"
                      onClick={() => toggleCard(member.id)}
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

                {/* Pełna Karta Zawodnika po Rozwinięciu */}
                {isCardOpen && (
                  <div className="bg-[#0D1B2A] p-4 border-t border-b border-yellow-500/30 text-xs space-y-3">
                    
                    {/* Nagłówek Karty: Duże Zdjęcie + Dane */}
                    <div className="flex gap-3 items-center border-b border-gray-800 pb-3">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-xl bg-slate-800 border-2 border-yellow-400 overflow-hidden flex items-center justify-center">
                          {member.photoUrl ? (
                            <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl text-gray-500">👤</span>
                          )}
                        </div>
                        <button 
                          type="button"
                          onClick={() => triggerCamera(member.id)}
                          className="absolute -bottom-1 -right-1 bg-yellow-400 text-gray-900 p-1 rounded-full text-[10px] font-bold shadow"
                        >
                          📷
                        </button>
                      </div>

                      <div className="flex-1">
                        <h4 className="text-yellow-400 font-extrabold text-sm">{member.name}</h4>
                        <p className="text-gray-300 text-[11px]">Grupa: <span className="font-semibold text-white">{member.group}</span></p>
                        <p className="text-gray-400 text-[10px]">Telefon: {member.phone || 'Brak danych'}</p>
                        <p className="text-gray-400 text-[10px]">Dołączył(a): {member.joinDate || 'b/d'}</p>
                      </div>
                    </div>

                    {/* Szczegóły Statusów */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-[#1C2541] p-2.5 rounded-xl border border-gray-800">
                        <span className="text-gray-400 block mb-0.5">Status Składki:</span>
                        <span className={member.hasPaid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {member.hasPaid ? 'Opłacona ✓' : 'Zaległość ✕'}
                        </span>
                      </div>
                      <div className="bg-[#1C2541] p-2.5 rounded-xl border border-gray-800">
                        <span className="text-gray-400 block mb-0.5">Dzisiejsza Obecność:</span>
                        <span className={member.isPresent ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {member.isPresent ? 'Obecny ✓' : 'Nieobecny ✕'}
                        </span>
                      </div>
                    </div>

                    {/* Uwagi / Notatki Trenera */}
                    <div className="bg-[#1C2541] p-2.5 rounded-xl border border-gray-800">
                      <span className="text-gray-400 block text-[10px] mb-1">Notatki trenera:</span>
                      <p className="text-gray-200 text-[11px] italic">
                        {member.notes || 'Brak notatek do profilu zawodnika.'}
                      </p>
                    </div>

                    {/* Akcje na karcie */}
                    <div className="flex gap-2 pt-1">
                      <button 
                        type="button"
                        onClick={() => triggerCamera(member.id)}
                        className="flex-1 bg-[#1251A2] hover:bg-blue-600 text-white py-2 rounded-xl font-bold text-[11px] border border-blue-400/30 transition flex items-center justify-center gap-1"
                      >
                        <span>📷</span> Zrób zdjęcie
                      </button>
                      <button 
                        type="button"
                        onClick={() => alert(`Edycja danych: ${member.name}`)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-gray-900 py-2 rounded-xl font-bold text-[11px] transition"
                      >
                        ✏️ Edytuj profil
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
