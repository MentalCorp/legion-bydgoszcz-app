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
  birthDate?: string;
  weight?: string;
  height?: string;
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
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [editFormData, setEditFormData] = useState<Member | null>(null);

  const [newMember, setNewMember] = useState({
    name: '',
    group: 'Początkująca',
    phone: '',
    birthDate: '',
    weight: '',
    height: '',
  });

  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Michał Nowak', group: 'Początkująca', hasPaid: false, attendanceHistory: {}, phone: '500-111-222', birthDate: '1998-05-12', weight: '75', height: '180', joinDate: '2024-01-15' },
    { id: '2', name: 'Jan Kowalski_test1', group: 'Zaawansowana', hasPaid: true, attendanceHistory: {}, phone: '600-333-444', birthDate: '1995-11-03', weight: '81', height: '185', joinDate: '2023-09-01' },
    { id: '3', name: 'Adam Nowak_test2', group: 'Początkująca', hasPaid: false, attendanceHistory: {}, phone: '700-555-666', birthDate: '2001-02-20', weight: '68', height: '175', joinDate: '2024-03-10' },
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
    if (expandedMemberId === id) {
      setExpandedMemberId(null);
      setEditingMemberId(null);
    } else {
      setExpandedMemberId(id);
      setEditingMemberId(null);
    }
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

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name) return;

    const createdMember: Member = {
      id: Date.now().toString(),
      name: newMember.name,
      group: newMember.group,
      phone: newMember.phone,
      birthDate: newMember.birthDate,
      weight: newMember.weight,
      height: newMember.height,
      hasPaid: false,
      attendanceHistory: {},
      joinDate: new Date().toISOString().split('T')[0],
    };

    setMembers([createdMember, ...members]);
    setNewMember({ name: '', group: 'Początkująca', phone: '', birthDate: '', weight: '', height: '' });
    setIsAddModalOpen(false);
  };

  const startEdit = (member: Member) => {
    setEditingMemberId(member.id);
    setEditFormData({ ...member });
  };

  const saveEdit = () => {
    if (!editFormData) return;
    setMembers(members.map(m => m.id === editFormData.id ? editFormData : m));
    setEditingMemberId(null);
    setEditFormData(null);
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (window.confirm(`Czy na pewno chcesz usunąć zawodnika: ${name}?`)) {
      setMembers(members.filter(m => m.id !== id));
      if (expandedMemberId === id) {
        setExpandedMemberId(null);
      }
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesGroup = selectedGroup === 'Wszyscy' || m.group === selectedGroup;
    const matchesQuery = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F17] via-[#0F172A] to-[#1E293B] text-white p-3 md:p-6 font-sans flex flex-col justify-between selection:bg-yellow-400 selection:text-black">
      
      <div>
        {/* Nagłówek Glassmorphism */}
        <header className="bg-[#FFDF00]/90 backdrop-blur-md p-4 rounded-2xl border border-yellow-300/40 border-b-4 border-b-[#1251A2] flex items-center justify-between mb-6 shadow-xl shadow-yellow-500/5">
          <div className="flex items-center space-x-3">
            <img 
              src={logoUrl} 
              alt="Legion Bydgoszcz" 
              className="h-10 md:h-12 w-auto object-contain drop-shadow" 
            />
            <h1 className="font-extrabold text-[#1251A2] text-base md:text-xl leading-tight uppercase tracking-wider drop-shadow-sm">
              BAZA ZAWODNIKÓW
            </h1>
          </div>
        </header>

        {/* Wyszukiwarka Glassmorphism */}
        <div className="bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-yellow-500/20 shadow-lg mb-4">
          <label className="block text-yellow-400 font-bold text-xs md:text-sm mb-2 flex items-center gap-2 tracking-wide">
            <span>🔍</span> WYSZUKIWARKA ZAWODNIKÓW
          </label>
          <input 
            type="text"
            placeholder="Wpisz min. 3 znaki aby wyszukać..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/70 text-white px-4 py-2.5 rounded-xl text-sm font-medium outline-none border border-slate-700/60 focus:border-yellow-400/80 focus:ring-2 focus:ring-yellow-400/20 transition placeholder-gray-500"
          />
        </div>

        {/* Pasek akcji Glassmorphism */}
        <div className="bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 mb-6 flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center shadow-lg">
          
          <div className="flex items-center justify-between md:justify-start gap-2 bg-slate-950/60 backdrop-blur-md p-2.5 rounded-xl border border-yellow-500/30">
            <span className="font-bold text-yellow-400 text-xs md:text-sm">
              📅 Data treningu:
            </span>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#FFDF00] text-slate-950 font-bold text-xs md:text-sm px-2.5 py-1 rounded-lg outline-none cursor-pointer shadow-sm hover:bg-yellow-300 transition"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <select 
              value={selectedGroup} 
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-[#FFDF00]/90 backdrop-blur-md text-slate-950 font-bold text-xs md:text-sm p-2 rounded-xl outline-none cursor-pointer border border-yellow-300/50 shadow-sm hover:bg-yellow-300 transition"
            >
              <option value="Wszyscy">Wszystkie grupy</option>
              <option value="Początkująca">Początkująca</option>
              <option value="Zaawansowana">Zaawansowana</option>
            </select>

            <button 
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-emerald-600/80 hover:bg-emerald-500/90 backdrop-blur-md text-white font-extrabold text-xs md:text-sm py-2 px-3.5 rounded-xl transition active:scale-95 border border-emerald-400/40 shadow-lg shadow-emerald-900/20"
            >
              + DODAJ ZAWODNIKA
            </button>
          </div>

        </div>

        {/* Tabela zawodników */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden mb-8">
          
          <div className="grid grid-cols-12 bg-slate-950/80 p-3.5 text-[11px] md:text-xs font-extrabold text-yellow-400 border-b border-white/10 uppercase tracking-wider items-center">
            <div className="col-span-1 text-center">Lp.</div>
            <div className="col-span-4 md:col-span-5 pl-1">Zawodnik</div>
            <div className="col-span-3 text-center">Obecność</div>
            <div className="col-span-2 text-center">Składka</div>
            <div className="col-span-2 md:col-span-1 text-right pr-1">Karta</div>
          </div>

          <div className="divide-y divide-white/5">
            {filteredMembers.map((member, index) => {
              const isExpanded = expandedMemberId === member.id;
              const isEditing = editingMemberId === member.id;
              const isPresentToday = member.attendanceHistory[selectedDate] || false;

              return (
                <div key={member.id} className="transition-colors duration-150 bg-slate-900/30 hover:bg-slate-800/40">
                  
                  <div className="grid grid-cols-12 p-3 items-center text-xs md:text-sm">
                    <div className="col-span-1 text-center font-bold text-slate-500">
                      {index + 1}.
                    </div>

                    <div className="col-span-4 md:col-span-5 pl-1 flex items-center space-x-2.5">
                      {member.avatarUrl ? (
                        <img src={member.avatarUrl} alt={member.name} className="w-8 h-8 rounded-full object-cover border border-yellow-400/80 shrink-0 shadow-sm" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[11px] text-gray-300 font-bold shrink-0">
                          👤
                        </div>
                      )}
                      <span className="font-bold text-slate-100 truncate">{member.name}</span>
                    </div>

                    <div className="col-span-3 px-1 text-center">
                      <button 
                        type="button"
                        onClick={() => toggleAttendance(member.id, selectedDate)}
                        className={`w-full py-1.5 px-2 rounded-xl font-extrabold text-[10px] md:text-xs transition active:scale-95 backdrop-blur-md border flex items-center justify-center space-x-1 ${
                          isPresentToday 
                            ? 'bg-emerald-600/80 hover:bg-emerald-500/90 border-emerald-400/50 text-white shadow-lg shadow-emerald-950/40' 
                            : 'bg-slate-950/40 hover:bg-slate-800/60 border-slate-700/60 text-slate-400'
                        }`}
                      >
                        <span>{isPresentToday ? 'OBECNY ✓' : 'NIEOBECNY'}</span>
                      </button>
                    </div>

                    <div className="col-span-2 px-1 text-center">
                      <button 
                        type="button"
                        onClick={() => togglePayment(member.id)}
                        className={`w-full py-1.5 px-1 rounded-xl text-[10px] md:text-xs font-bold transition active:scale-95 backdrop-blur-md border ${
                          member.hasPaid 
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {member.hasPaid ? 'Opłacona' : 'Zaległość'}
                      </button>
                    </div>

                    <div className="col-span-2 md:col-span-1 text-right pr-1">
                      <button 
                        type="button"
                        onClick={() => toggleCard(member.id)}
                        className="bg-[#1251A2]/80 hover:bg-[#1251A2] backdrop-blur-md active:scale-95 text-white py-1.5 px-2.5 rounded-xl text-[10px] font-bold border border-blue-400/30 transition inline-flex items-center space-x-1 shadow-sm"
                      >
                        <span>Karta</span>
                        <span>{isExpanded ? '▲' : '▼'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Rozszerzona karta z efektem szkła */}
                  {isExpanded && (
                    <div className="bg-slate-950/80 backdrop-blur-2xl p-4 md:p-5 border-t border-white/10 space-y-4">
                      <div className="flex flex-col md:flex-row items-center gap-5">
                        
                        <div className="flex flex-col items-center space-y-2.5">
                          <div className="w-24 h-24 rounded-2xl bg-slate-900 border-2 border-yellow-400/70 overflow-hidden flex items-center justify-center shadow-inner">
                            {member.avatarUrl ? (
                              <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-3xl text-slate-600">📷</span>
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
                            className="bg-yellow-400/90 hover:bg-yellow-400 backdrop-blur-md text-slate-950 font-extrabold text-xs py-1.5 px-3 rounded-xl transition active:scale-95 border border-yellow-300/40 shadow"
                          >
                            {member.avatarUrl ? 'Zmień zdjęcie 📷' : 'Dodaj zdjęcie 📷'}
                          </button>
                        </div>

                        {/* Tryb Edycji / Podglądu */}
                        {isEditing && editFormData ? (
                          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs md:text-sm bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-inner">
                            <div>
                              <label className="text-slate-400 block mb-1">Imię i Nazwisko:</label>
                              <input 
                                type="text"
                                value={editFormData.name}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                className="w-full bg-slate-950 p-2 rounded-xl border border-slate-700 text-white outline-none focus:border-yellow-400/80"
                              />
                            </div>
                            <div>
                              <label className="text-slate-400 block mb-1">Grupa:</label>
                              <select 
                                value={editFormData.group}
                                onChange={(e) => setEditFormData({ ...editFormData, group: e.target.value })}
                                className="w-full bg-slate-950 p-2 rounded-xl border border-slate-700 text-white outline-none focus:border-yellow-400/80"
                              >
                                <option value="Początkująca">Początkująca</option>
                                <option value="Zaawansowana">Zaawansowana</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-slate-400 block mb-1">Data urodzenia:</label>
                              <input 
                                type="date"
                                value={editFormData.birthDate || ''}
                                onChange={(e) => setEditFormData({ ...editFormData, birthDate: e.target.value })}
                                className="w-full bg-slate-950 p-2 rounded-xl border border-slate-700 text-white outline-none focus:border-yellow-400/80"
                              />
                            </div>
                            <div>
                              <label className="text-slate-400 block mb-1">Waga (kg):</label>
                              <input 
                                type="number"
                                value={editFormData.weight || ''}
                                onChange={(e) => setEditFormData({ ...editFormData, weight: e.target.value })}
                                className="w-full bg-slate-950 p-2 rounded-xl border border-slate-700 text-white outline-none focus:border-yellow-400/80"
                              />
                            </div>
                            <div>
                              <label className="text-slate-400 block mb-1">Wzrost (cm):</label>
                              <input 
                                type="number"
                                value={editFormData.height || ''}
                                onChange={(e) => setEditFormData({ ...editFormData, height: e.target.value })}
                                className="w-full bg-slate-950 p-2 rounded-xl border border-slate-700 text-white outline-none focus:border-yellow-400/80"
                              />
                            </div>
                            <div>
                              <label className="text-slate-400 block mb-1">Telefon:</label>
                              <input 
                                type="text"
                                value={editFormData.phone || ''}
                                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                className="w-full bg-slate-950 p-2 rounded-xl border border-slate-700 text-white outline-none focus:border-yellow-400/80"
                              />
                            </div>
                            <div className="col-span-1 md:col-span-2 flex justify-end gap-2 pt-2">
                              <button 
                                onClick={() => setEditingMemberId(null)}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3.5 py-1.5 rounded-xl font-bold transition"
                              >
                                Anuluj
                              </button>
                              <button 
                                onClick={saveEdit}
                                className="bg-emerald-600/90 hover:bg-emerald-500 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl font-bold border border-emerald-400/30 transition"
                              >
                                Zapisz zmiany ✓
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 w-full space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs md:text-sm">
                              <div className="flex justify-between border-b border-white/5 pb-1.5">
                                <span className="text-slate-400">Imię i Nazwisko:</span>
                                <span className="font-bold text-white">{member.name}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-1.5">
                                <span className="text-slate-400">Grupa treningowa:</span>
                                <span className="font-bold text-yellow-400">{member.group}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-1.5">
                                <span className="text-slate-400">Data urodzenia:</span>
                                <span className="font-bold text-slate-200">{member.birthDate || 'Brak danych'}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-1.5">
                                <span className="text-slate-400">Waga:</span>
                                <span className="font-bold text-slate-200">{member.weight ? `${member.weight} kg` : 'Brak danych'}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-1.5">
                                <span className="text-slate-400">Wzrost:</span>
                                <span className="font-bold text-slate-200">{member.height ? `${member.height} cm` : 'Brak danych'}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-1.5">
                                <span className="text-slate-400">Telefon:</span>
                                <span className="font-bold text-slate-200">{member.phone || 'Brak danych'}</span>
                              </div>
                            </div>
                            
                            {/* Akcje karty Glassmorphism */}
                            <div className="flex justify-end gap-2 pt-2">
                              <button 
                                onClick={() => startEdit(member)}
                                className="bg-blue-600/80 hover:bg-blue-500/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-blue-400/30 transition active:scale-95 shadow"
                              >
                                ✏️ Edytuj dane
                              </button>
                              <button 
                                onClick={() => handleDeleteMember(member.id, member.name)}
                                className="bg-rose-600/80 hover:bg-rose-500/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-rose-400/30 transition active:scale-95 shadow"
                              >
                                🗑️ Usuń zawodnika
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

        {/* Modal Dodawania z delikatnym szkłem */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-yellow-500/30 p-6 rounded-2xl w-full max-w-md shadow-2xl space-y-4">
              <h2 className="text-base font-extrabold text-yellow-400 uppercase tracking-wide border-b border-white/10 pb-2.5">
                ➕ DODAJ NOWEGO ZAWODNIKA
              </h2>

              <form onSubmit={handleAddMember} className="space-y-3.5 text-xs md:text-sm">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Imię i Nazwisko *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="np. Jan Kowalski"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-2.5 text-white outline-none focus:border-yellow-400/80 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Grupa</label>
                    <select 
                      value={newMember.group}
                      onChange={(e) => setNewMember({ ...newMember, group: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-2.5 text-white outline-none focus:border-yellow-400/80 transition"
                    >
                      <option value="Początkująca">Początkująca</option>
                      <option value="Zaawansowana">Zaawansowana</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Data urodzenia</label>
                    <input 
                      type="date" 
                      value={newMember.birthDate}
                      onChange={(e) => setNewMember({ ...newMember, birthDate: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-2 text-white outline-none focus:border-yellow-400/80 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Waga (kg)</label>
                    <input 
                      type="number" 
                      placeholder="75"
                      value={newMember.weight}
                      onChange={(e) => setNewMember({ ...newMember, weight: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-2 text-white outline-none focus:border-yellow-400/80 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Wzrost (cm)</label>
                    <input 
                      type="number" 
                      placeholder="180"
                      value={newMember.height}
                      onChange={(e) => setNewMember({ ...newMember, height: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-2 text-white outline-none focus:border-yellow-400/80 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Telefon</label>
                    <input 
                      type="tel" 
                      placeholder="500..."
                      value={newMember.phone}
                      onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-2 text-white outline-none focus:border-yellow-400/80 transition"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold transition"
                  >
                    Anuluj
                  </button>
                  <button 
                    type="submit"
                    className="bg-yellow-400/90 hover:bg-yellow-400 backdrop-blur-md text-slate-950 px-4 py-2 rounded-xl font-extrabold border border-yellow-300/40 transition"
                  >
                    Zapisz
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Stopka */}
      <footer className="text-center text-xs text-slate-500 pt-6 pb-2 border-t border-white/5 mt-auto">
        POC/Demo ver. 1.0 © MentalCorp Media 2026
      </footer>

    </div>
  );
}
