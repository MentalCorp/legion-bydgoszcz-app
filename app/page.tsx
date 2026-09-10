'use client';

import { useState, useRef, useEffect } from 'react';

interface Member {
  id: string;
  lp: number;
  name: string;
  group: string;
  isPresent: boolean;
  hasPaid: boolean;
  photoUrl?: string;
  phone?: string;
  birthDate?: string;
  weight?: string;
  height?: string;
  joinDate?: string;
  medicalValidUntil?: string;
  notes?: string;
}

const INITIAL_MEMBERS: Member[] = [
  { 
    id: '1', 
    lp: 1, 
    name: 'Michał Nowak', 
    group: 'Początkująca', 
    isPresent: false, 
    hasPaid: false,
    phone: '+48 600 111 222',
    birthDate: '2005-05-15',
    weight: '75',
    height: '180',
    joinDate: '2025-01-12',
    medicalValidUntil: '2026-12-31',
    notes: 'Brak przeciwwskazań zdrowotnych.'
  },
  { 
    id: '2', 
    lp: 2, 
    name: 'Jan Kowalski_test1', 
    group: 'Zaawansowana', 
    isPresent: false, 
    hasPaid: true,
    phone: '+48 500 222 333',
    birthDate: '1998-11-10',
    weight: '81',
    height: '185',
    joinDate: '2024-09-05',
    medicalValidUntil: '2026-06-30',
    notes: 'Ochraniacze piszczeli zakupione.'
  },
];

export default function Home() {
  const [selectedGroup, setSelectedGroup] = useState('Wszystkie grupy');
  const [searchQuery, setSearchQuery] = useState('');
  const [trainingDate, setTrainingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);
  
  // Stany formularzy
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState<Partial<Member>>({
    name: '',
    group: 'Początkująca',
    phone: '',
    birthDate: '',
    weight: '',
    height: '',
    joinDate: new Date().toISOString().split('T')[0],
    medicalValidUntil: '',
    notes: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePhotoMemberId, setActivePhotoMemberId] = useState<string | null>(null);

  // Zapis i odczyt z localStorage
  const [members, setMembers] = useState<Member[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('legion_members');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return INITIAL_MEMBERS;
  });

  useEffect(() => {
    localStorage.setItem('legion_members', JSON.stringify(members));
  }, [members]);

  const logoUrl = "https://muaythai-bydgoszcz.pl/wp-content/uploads/2024/08/logo_kolor1-768x465.png";

  const toggleAttendance = (id: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, isPresent: !m.isPresent } : m));
  };

  const togglePayment = (id: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, hasPaid: !m.hasPaid } : m));
  };

  const toggleCard = (id: string) => {
    setExpandedMemberId(expandedMemberId === id ? null : id);
    setEditingMember(null);
  };

  // Dodawanie nowego zawodnika
  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name?.trim()) return;

    const createdMember: Member = {
      id: Date.now().toString(),
      lp: members.length + 1,
      name: newMember.name,
      group: newMember.group || 'Początkująca',
      isPresent: false,
      hasPaid: false,
      phone: newMember.phone || '',
      birthDate: newMember.birthDate || '',
      weight: newMember.weight || '',
      height: newMember.height || '',
      joinDate: newMember.joinDate || new Date().toISOString().split('T')[0],
      medicalValidUntil: newMember.medicalValidUntil || '',
      notes: newMember.notes || ''
    };

    setMembers([...members, createdMember]);
    setIsAddingMember(false);
    setNewMember({
      name: '',
      group: 'Początkująca',
      phone: '',
      birthDate: '',
      weight: '',
      height: '',
      joinDate: new Date().toISOString().split('T')[0],
      medicalValidUntil: '',
      notes: ''
    });
  };

  // Edycja zawodnika
  const handleEditClick = (member: Member) => {
    setEditingMember({ ...member });
  };

  const handleSaveEdit = () => {
    if (editingMember) {
      setMembers(members.map(m => m.id === editingMember.id ? editingMember : m));
      setEditingMember(null);
    }
  };

  // Aparat / Zdjęcie
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
    <div className="min-h-screen bg-[#0B132B] text-white p-3 sm:p-5 font-sans flex flex-col justify-between space-y-4">
      
      <div className="space-y-4">
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          ref={fileInputRef} 
          onChange={handlePhotoCapture} 
          className="hidden" 
        />

        {/* Nagłówek */}
        <header className="bg-[#1C2541] p-3 sm:p-4 rounded-2xl border border-gray-700/60 shadow-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logoUrl} alt="Legion Bydgoszcz" className="h-10 sm:h-12 w-auto object-contain" />
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

        {/* Wyszukiwarka */}
        <div className="bg-[#1C2541] p-3.5 rounded-2xl border border-gray-700/60 shadow-md">
          <label className="block text-yellow-400 font-bold text-xs mb-1.5 flex items-center gap-1.5">
            <span>🔍</span> WYSZUKIWARKA ZAWODNIKÓW
          </label>
          <input 
            type="text"
            placeholder="Wpisz imię lub nazwisko..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0B132B] text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-gray-700/80 outline-none focus:border-yellow-400 placeholder-gray-500"
          />
        </div>

        {/* Filtracja, Kalendarz i Przycisk Dodawania */}
        <div className="bg-[#1C2541] p-3.5 rounded-2xl border border-gray-700/60 shadow-md space-y-3">
          <div className="flex items-center justify-between bg-[#0B132B] p-2 sm:p-2.5 rounded-xl border border-gray-700/80">
            <span className="text-xs font-bold text-yellow-400 flex items-center gap-1">
              <span>📅</span> Data treningu:
            </span>
            <input 
              type="date" 
              value={trainingDate}
              onChange={(e) => setTrainingDate(e.target.value)}
              className="bg-[#FFDF00] text-gray-900 font-extrabold text-xs px-2 py-1 rounded-lg outline-none cursor-pointer"
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
              onClick={() => setIsAddingMember(!isAddingMember)}
              className="bg-[#059669] hover:bg-emerald-600 text-white font-bold text-xs px-3 py-2.5 rounded-xl flex items-center justify-center gap-1 shadow transition active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <span>{isAddingMember ? '✖' : '+'}</span> {isAddingMember ? 'ZAMKNIJ' : 'DODAJ ZAWODNIKA'}
            </button>
          </div>
        </div>

        {/* Formularz Nowego Zawodnika */}
        {isAddingMember && (
          <form onSubmit={handleAddMemberSubmit} className="bg-[#1C2541] p-4 rounded-2xl border border-yellow-500/50 space-y-3 shadow-xl">
            <h3 className="text-yellow-400 font-bold text-xs uppercase tracking-wider">Nowy Zawodnik</h3>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" 
                placeholder="Imię i Nazwisko *" 
                required
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="bg-[#0B132B] text-white p-2 rounded-xl text-xs border border-gray-700 col-span-2"
              />
              <select 
                value={newMember.group}
                onChange={(e) => setNewMember({ ...newMember, group: e.target.value })}
                className="bg-[#0B132B] text-white p-2 rounded-xl text-xs border border-gray-700"
              >
                <option value="Początkująca">Początkująca</option>
                <option value="Zaawansowana">Zaawansowana</option>
              </select>
              <input 
                type="text" 
                placeholder="Telefon" 
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                className="bg-[#0B132B] text-white p-2 rounded-xl text-xs border border-gray-700"
              />
              <div>
                <label className="text-[9px] text-gray-400 block">Data urodzenia</label>
                <input 
                  type="date" 
                  value={newMember.birthDate}
                  onChange={(e) => setNewMember({ ...newMember, birthDate: e.target.value })}
                  className="bg-[#0B132B] text-white p-1.5 rounded-xl text-xs border border-gray-700 w-full"
                />
              </div>
              <div>
                <label className="text-[9px] text-gray-400 block">Badania lekarskie ważne do</label>
                <input 
                  type="date" 
                  value={newMember.medicalValidUntil}
                  onChange={(e) => setNewMember({ ...newMember, medicalValidUntil: e.target.value })}
                  className="bg-[#0B132B] text-white p-1.5 rounded-xl text-xs border border-gray-700 w-full"
                />
              </div>
              <input 
                type="number" 
                placeholder="Waga (kg)" 
                value={newMember.weight}
                onChange={(e) => setNewMember({ ...newMember, weight: e.target.value })}
                className="bg-[#0B132B] text-white p-2 rounded-xl text-xs border border-gray-700"
              />
              <input 
                type="number" 
                placeholder="Wzrost (cm)" 
                value={newMember.height}
                onChange={(e) => setNewMember({ ...newMember, height: e.target.value })}
                className="bg-[#0B132B] text-white p-2 rounded-xl text-xs border border-gray-700"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs uppercase"
            >
              Zapisz Nowego Zawodnika
            </button>
          </form>
        )}

        {/* Tabela Główna */}
        <div className="bg-[#1C2541] rounded-2xl border border-gray-700/60 shadow-lg overflow-hidden">
          
          <div className="grid grid-cols-12 gap-1 items-center px-3 py-2.5 border-b border-gray-700/80 bg-[#161F38] text-[10px] sm:text-xs font-black text-yellow-400 uppercase tracking-wider">
            <div className="col-span-1 text-center">LP.</div>
            <div className="col-span-5 pl-1">ZAWODNIK</div>
            <div className="col-span-2 text-center text-[9px] sm:text-[10px] leading-tight">OBECNOŚĆ</div>
            <div className="col-span-2 text-center text-[9px] sm:text-[10px] leading-tight">SKŁADKA</div>
            <div className="col-span-2 text-center text-[9px] sm:text-[10px] leading-tight">KARTA</div>
          </div>

          <div className="divide-y divide-gray-800/80">
            {filteredMembers.map((member, index) => {
              const isCardOpen = expandedMemberId === member.id;

              return (
                <div key={member.id} className="transition">
                  <div className="grid grid-cols-12 gap-1 items-center px-3 py-3 hover:bg-[#232F52] text-xs">
                    <div className="col-span-1 text-center font-bold text-gray-400">{index + 1}.</div>

                    <div className="col-span-5 flex items-center space-x-2 pl-1 min-w-0">
                      <button 
                        type="button"
                        onClick={() => triggerCamera(member.id)}
                        className="w-8 h-8 rounded-full bg-slate-800 border border-yellow-500/50 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer"
                      >
                        {member.photoUrl ? (
                          <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs">📷</span>
                        )}
                      </button>
                      <span className="font-bold text-white truncate text-xs">{member.name}</span>
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <button
                        type="button"
                        onClick={() => toggleAttendance(member.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition active:scale-90 cursor-pointer ${
                          member.isPresent ? 'bg-emerald-500 shadow-md shadow-emerald-900/50' : 'bg-rose-600 shadow-md shadow-rose-900/50'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-white opacity-40"></span>
                      </button>
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <button
                        type="button"
                        onClick={() => togglePayment(member.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition active:scale-90 cursor-pointer ${
                          member.hasPaid ? 'bg-emerald-500 shadow-md shadow-emerald-900/50' : 'bg-rose-600 shadow-md shadow-rose-900/50'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-white opacity-40"></span>
                      </button>
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <button 
                        type="button"
                        onClick={() => toggleCard(member.id)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition active:scale-90 shadow-md cursor-pointer text-[10px] ${
                          isCardOpen ? 'bg-yellow-400 text-gray-900 font-bold' : 'bg-[#1D4ED8] hover:bg-blue-600 text-white shadow-blue-900/40'
                        }`}
                      >
                        {isCardOpen ? '▲' : '▼'}
                      </button>
                    </div>
                  </div>

                  {/* Rozwinięta Karta Zawodnika */}
                  {isCardOpen && (
                    <div className="bg-[#0D1B2A] p-4 border-t border-b border-yellow-500/30 text-xs space-y-3">
                      
                      {editingMember?.id === member.id ? (
                        /* TRYB EDYCJI */
                        <div className="space-y-3 bg-[#1C2541] p-3 rounded-xl border border-yellow-500/50">
                          <h4 className="text-yellow-400 font-bold">Edycja danych zawodnika</h4>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-gray-400 block">Imię i Nazwisko</label>
                              <input 
                                type="text" 
                                value={editingMember.name} 
                                onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                                className="w-full bg-[#0B132B] p-1.5 rounded border border-gray-700 text-white text-xs" 
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 block">Telefon</label>
                              <input 
                                type="text" 
                                value={editingMember.phone || ''} 
                                onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                                className="w-full bg-[#0B132B] p-1.5 rounded border border-gray-700 text-white text-xs" 
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 block">Data urodzenia</label>
                              <input 
                                type="date" 
                                value={editingMember.birthDate || ''} 
                                onChange={(e) => setEditingMember({ ...editingMember, birthDate: e.target.value })}
                                className="w-full bg-[#0B132B] p-1.5 rounded border border-gray-700 text-white text-xs" 
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 block">Data dołączenia</label>
                              <input 
                                type="date" 
                                value={editingMember.joinDate || ''} 
                                onChange={(e) => setEditingMember({ ...editingMember, joinDate: e.target.value })}
                                className="w-full bg-[#0B132B] p-1.5 rounded border border-gray-700 text-white text-xs" 
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 block">Waga (kg)</label>
                              <input 
                                type="text" 
                                value={editingMember.weight || ''} 
                                onChange={(e) => setEditingMember({ ...editingMember, weight: e.target.value })}
                                className="w-full bg-[#0B132B] p-1.5 rounded border border-gray-700 text-white text-xs" 
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 block">Wzrost (cm)</label>
                              <input 
                                type="text" 
                                value={editingMember.height || ''} 
                                onChange={(e) => setEditingMember({ ...editingMember, height: e.target.value })}
                                className="w-full bg-[#0B132B] p-1.5 rounded border border-gray-700 text-white text-xs" 
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-yellow-400 font-bold block">Badania lekarskie ważne do</label>
                            <input 
                              type="date" 
                              value={editingMember.medicalValidUntil || ''} 
                              onChange={(e) => setEditingMember({ ...editingMember, medicalValidUntil: e.target.value })}
                              className="w-full bg-[#0B132B] p-1.5 rounded border border-yellow-500/50 text-white text-xs" 
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-gray-400 block">Notatki trenera</label>
                            <textarea 
                              value={editingMember.notes || ''} 
                              onChange={(e) => setEditingMember({ ...editingMember, notes: e.target.value })}
                              className="w-full bg-[#0B132B] p-1.5 rounded border border-gray-700 text-white text-xs h-16" 
                            />
                          </div>

                          <div className="flex gap-2">
                            <button 
                              type="button" 
                              onClick={handleSaveEdit}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-lg text-xs"
                            >
                              💾 Zapisz zmiany
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setEditingMember(null)}
                              className="bg-gray-700 text-gray-300 py-1.5 px-3 rounded-lg text-xs"
                            >
                              Anuluj
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* TRYB PODGLĄDU */
                        <>
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
                              <p className="text-gray-400 text-[10px]">Tel: {member.phone || 'Brak'}</p>
                              <p className="text-gray-400 text-[10px]">Data ur.: {member.birthDate || 'Brak danych'}</p>
                              <p className="text-gray-400 text-[10px]">Dołączył(a): {member.joinDate || 'Brak danych'}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-[#1C2541] p-2 rounded-xl border border-gray-800">
                              <span className="text-gray-400 block text-[9px]">Waga</span>
                              <span className="font-bold text-white text-xs">{member.weight ? `${member.weight} kg` : '—'}</span>
                            </div>
                            <div className="bg-[#1C2541] p-2 rounded-xl border border-gray-800">
                              <span className="text-gray-400 block text-[9px]">Wzrost</span>
                              <span className="font-bold text-white text-xs">{member.height ? `${member.height} cm` : '—'}</span>
                            </div>
                            <div className="bg-[#1C2541] p-2 rounded-xl border border-gray-800">
                              <span className="text-gray-400 block text-[9px]">Badania do</span>
                              <span className={`font-bold text-xs ${member.medicalValidUntil ? 'text-yellow-400' : 'text-gray-500'}`}>
                                {member.medicalValidUntil || 'Brak'}
                              </span>
                            </div>
                          </div>

                          <div className="bg-[#1C2541] p-2.5 rounded-xl border border-gray-800">
                            <span className="text-gray-400 block text-[10px] mb-0.5">Notatki trenera:</span>
                            <p className="text-gray-200 text-[11px] italic">{member.notes || 'Brak notatek.'}</p>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button 
                              type="button"
                              onClick={() => triggerCamera(member.id)}
                              className="flex-1 bg-[#1251A2] hover:bg-blue-600 text-white py-2 rounded-xl font-bold text-[11px] transition flex items-center justify-center gap-1"
                            >
                              <span>📷</span> Zdjęcie
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleEditClick(member)}
                              className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-gray-900 py-2 rounded-xl font-bold text-[11px] transition"
                            >
                              ✏️ Edytuj Profil
                            </button>
                          </div>
                        </>
                      )}

                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Zaktualizowana Stopka */}
      <footer className="mt-6 pt-4 border-t border-gray-800 text-center text-gray-500 text-[10px]">
        <p>Demo ver. 1.0 © MentalCorp Media 2026</p>
      </footer>

    </div>
  );
}
