'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Member {
  id: string;
  name: string;
  group_name: string;
  birth_date?: string | null;
  member_since?: string | null;
  weight_kg?: number | null;
  height_cm?: number | null;
  medical_until?: string | null;
}

const MONTHS = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

// Wyznaczanie dni treningowych (Pn, Wt, Śr, Pt) dla wskazanego miesiąca i roku
function getTrainingDays(year: number, monthZeroBased: number): string[] {
  const dates: string[] = [];
  const daysInMonth = new Date(year, monthZeroBased + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, monthZeroBased, day);
    const dayOfWeek = d.getDay(); // 0: Nd, 1: Pn, 2: Wt, 3: Śr, 4: Cz, 5: Pt, 6: Sb
    if ([1, 2, 3, 5].includes(dayOfWeek)) {
      // Format YYYY-MM-DD
      const formattedMonth = String(monthZeroBased + 1).padStart(2, '0');
      const formattedDay = String(day).padStart(2, '0');
      dates.push(`${year}-${formattedMonth}-${formattedDay}`);
    }
  }
  return dates;
}

export default function Home() {
  const [selectedGroup, setSelectedGroup] = useState('Początkująca');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(9); // Wrzesień 2026
  const [darkMode, setDarkMode] = useState(true);

  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Record<string, boolean>>({});
  // Mapa obecności: key = `${memberId}_${sessionDate}` -> boolean
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Wyszukiwarka & Rozwijane karty
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<Partial<Member>>({});

  const trainingDays = getTrainingDays(selectedYear, selectedMonth - 1);

  // Ustawienie domyślnej daty przy zmianie miesiąca/roku
  useEffect(() => {
    if (trainingDays.length > 0) {
      setSelectedDate(trainingDays[0]);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);

  async function fetchData() {
    setLoading(true);
    const { data: membersData, error: memErr } = await supabase.from('members').select('*');
    if (memErr) console.error('Błąd pobierania członków:', memErr);
    setMembers(membersData || []);

    // Składki miesięczne
    const { data: paymentsData } = await supabase
      .from('payments')
      .select('*')
      .eq('year', selectedYear)
      .eq('month', selectedMonth);

    const payMap: Record<string, boolean> = {};
    paymentsData?.forEach(p => { payMap[p.member_id] = p.has_paid; });
    setPayments(payMap);

    // Obecności dla danego miesiąca/roku
    const { data: attendanceData } = await supabase
      .from('attendance')
      .select('*')
      .eq('year', selectedYear)
      .eq('month', selectedMonth);

    const attMap: Record<string, boolean> = {};
    attendanceData?.forEach(a => {
      if (a.session_date) {
        attMap[`${a.member_id}_${a.session_date}`] = a.is_present;
      }
    });
    setAttendance(attMap);

    setLoading(false);
  }

  // Dodawanie członka z wyszukiwarki
  async function handleAddMemberFromSearch() {
    if (!searchQuery.trim()) return;

    const { error } = await supabase
      .from('members')
      .insert([{ name: searchQuery.trim(), group_name: selectedGroup }]);

    if (error) {
      alert('Błąd podczas dodawania: ' + error.message);
    } else {
      setSearchQuery('');
      await fetchData();
    }
  }

  // Usuwanie członka (z Karty)
  async function handleDeleteMember(id: string, name: string) {
    if (!confirm(`Czy na pewno chcesz usunąć zawodnika: "${name}" z bazy danych?`)) {
      return;
    }
    const { error } = await supabase.from('members').delete().eq('id', id);
    if (!error) {
      setMembers(members.filter(m => m.id !== id));
      setExpandedCardId(null);
    } else {
      alert('Błąd podczas usuwania zawodnika: ' + error.message);
    }
  }

  // Przełączanie opłaty
  async function togglePayment(memberId: string) {
    const currentStatus = !!payments[memberId];
    const newStatus = !currentStatus;

    setPayments({ ...payments, [memberId]: newStatus });

    await supabase.from('payments').upsert({
      member_id: memberId,
      year: selectedYear,
      month: selectedMonth,
      has_paid: newStatus
    }, { onConflict: 'member_id,year,month' });
  }

  // Przełączanie obecności na konkretnym treningu
  async function toggleAttendance(memberId: string, date: string) {
    if (!date) return;
    const key = `${memberId}_${date}`;
    const currentStatus = !!attendance[key];
    const newStatus = !currentStatus;

    setAttendance({ ...attendance, [key]: newStatus });

    await supabase.from('attendance').upsert({
      member_id: memberId,
      year: selectedYear,
      month: selectedMonth,
      session_date: date,
      is_present: newStatus
    }, { onConflict: 'member_id,session_date' });
  }

  // Zapisywanie danych karty zawodnika
  async function handleSaveCard(memberId: string) {
    const { error } = await supabase
      .from('members')
      .update(editingMember)
      .eq('id', memberId);

    if (error) {
      alert('Błąd zapisu karty zawodnika: ' + error.message);
    } else {
      alert('Zapisano dane zawodnika!');
      fetchData();
    }
  }

  // Eksport do pliku
  function exportToExcel() {
    if (members.length === 0) {
      alert('Brak danych do wyeksportowania.');
      return;
    }

    const monthName = MONTHS[selectedMonth - 1];
    let csvContent = `Imię i nazwisko;Grupa;Rok;Miesiąc;Składka;Wybrana Data Treningu (${selectedDate});Obecność\n`;

    members.forEach(member => {
      const isPaid = payments[member.id] ? 'Opłacona' : 'Zaległość';
      const isPresent = attendance[`${member.id}_${selectedDate}`] ? 'Obecny' : 'Brak';
      csvContent += `"${member.name}";"${member.group_name}";"${selectedYear}";"${monthName}";"${isPaid}";"${selectedDate}";"${isPresent}"\n`;
    });

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Legion_Bydgoszcz_${monthName}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filteredMembers = members.filter(m => {
    const matchesGroup = m.group_name === selectedGroup;
    const isSearching = searchQuery.trim().length >= 3;
    if (isSearching) {
      return matchesGroup && m.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return matchesGroup;
  });

  return (
    <div className={`min-h-screen flex flex-col justify-between p-4 font-sans transition-colors ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div>
        {/* Nagłówek & Przełącznik Trybu */}
        <header className="bg-[#FFDF00] p-4 rounded-xl border-b-4 border-[#1251A2] flex items-center justify-between mb-6 shadow">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Legion Bydgoszcz" className="h-10 w-auto object-contain" />
            <h1 className="font-extrabold text-[#1251A2] text-lg tracking-wider">
              LEGION BYDGOSZCZ
            </h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-[#1251A2] text-[#FFDF00] font-bold px-3 py-1.5 rounded-lg text-xs shadow flex items-center gap-1"
          >
            {darkMode ? '☀️ Tryb jasny' : '🌙 Tryb ciemny'}
          </button>
        </header>

        {/* Panel Nawigacji i Wyboru Treningu */}
        <div className={`p-4 rounded-xl shadow mb-4 space-y-3 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm">Rok:</span>
            <div className="space-x-2">
              {[2026, 2027].map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-3 py-1 rounded-lg font-bold text-sm ${selectedYear === year ? 'bg-[#1251A2] text-white' : 'bg-gray-700 text-gray-200'}`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-bold text-sm">Miesiąc:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-[#FFDF00] font-bold p-2 rounded-lg text-gray-900 outline-none text-sm"
            >
              {MONTHS.map((m, idx) => (
                <option key={idx} value={idx + 1}>{m}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-700">
            <span className="font-bold text-sm">Grupa:</span>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-[#FFDF00] font-bold p-2 rounded-lg text-gray-900 outline-none text-sm"
            >
              <option value="Początkująca">Początkująca</option>
              <option value="Zaawansowana">Zaawansowana</option>
            </select>
          </div>

          {/* Wybór konkretnej daty treningu (Pn, Wt, Śr, Pt o 19:30) */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-700">
            <span className="font-bold text-sm text-[#FFDF00]">🗓️ Data treningu (19:30):</span>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-700 text-white font-bold p-2 rounded-lg outline-none text-xs border border-gray-600"
            >
              {trainingDays.map(dateStr => {
                const [y, m, d] = dateStr.split('-');
                const dayName = new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString('pl-PL', { weekday: 'short' });
                return (
                  <option key={dateStr} value={dateStr}>
                    {dayName.toUpperCase()} {d}.{m}.{y} (19:30)
                  </option>
                );
              })}
            </select>
          </div>

          <div className="pt-2 border-t border-gray-700 flex justify-end">
            <button
              onClick={exportToExcel}
              className="bg-[#FFDF00] text-[#1251A2] font-extrabold px-3 py-2 rounded-lg text-xs flex items-center gap-1 shadow hover:bg-yellow-400 transition"
            >
              📊 Eksport do pliku
            </button>
          </div>
        </div>

        {/* Sekcja: Wyszukiwarka */}
        <div className={`p-4 rounded-xl shadow mb-4 border-2 border-[#FFDF00] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <label className="block text-xs font-bold text-[#FFDF00] uppercase tracking-wider mb-1">
            🔍 Wyszukiwarka zawodników
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Wpisz min. 3 znaki aby wyszukać..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-2 rounded-lg border border-gray-600 text-gray-900 text-sm outline-none bg-white"
            />
            {searchQuery.trim().length >= 3 && filteredMembers.length === 0 && (
              <button
                onClick={handleAddMemberFromSearch}
                className="bg-green-600 text-white font-bold px-3 py-2 rounded-lg text-xs shadow hover:bg-green-700 transition"
              >
                + Dodaj jako nowego
              </button>
            )}
          </div>
        </div>

        {/* Lista Zawodników */}
        <div className={`rounded-xl shadow divide-y ${darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-100'}`}>
          {loading ? (
            <div className="p-4 text-center text-gray-400">Ładowanie danych...</div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              {searchQuery.trim().length >= 3 
                ? `Nie znaleziono zawodnika "${searchQuery}" w grupie ${selectedGroup}.` 
                : `Brak zawodników w grupie ${selectedGroup}.`}
            </div>
          ) : (
            filteredMembers.map((member) => {
              const isExpanded = expandedCardId === member.id;
              const hasAttendedSelectedDate = !!attendance[`${member.id}_${selectedDate}`];

              return (
                <div key={member.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-base">{member.name}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => togglePayment(member.id)}
                          className={`text-xs px-2.5 py-1 rounded-md font-semibold transition ${payments[member.id] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          Składka: {payments[member.id] ? 'Opłacona ✓' : 'Zaległość ✕'}
                        </button>
                        
                        {/* Przełączanie obecności na wybrany dzień treningowy */}
                        <button
                          onClick={() => toggleAttendance(member.id, selectedDate)}
                          className={`text-xs px-2.5 py-1 rounded-md font-semibold transition ${hasAttendedSelectedDate ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                        >
                          Obecność ({selectedDate ? selectedDate.split('-').slice(1).join('.') : ''}): {hasAttendedSelectedDate ? 'Obecny ✓' : 'Brak'}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (isExpanded) {
                          setExpandedCardId(null);
                        } else {
                          setExpandedCardId(member.id);
                          setEditingMember(member);
                        }
                      }}
                      className="bg-[#1251A2] text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow hover:bg-blue-800 transition"
                    >
                      {isExpanded ? 'Zamknij kartę' : 'Karta zawodnika 📋'}
                    </button>
                  </div>

                  {/* Rozwijana Karta Zawodnika */}
                  {isExpanded && (
                    <div className={`p-4 rounded-lg mt-3 border space-y-3 text-sm ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                      <h3 className="font-bold text-[#FFDF00] border-b border-gray-700 pb-1">
                        📋 Karta Zawodnika: {member.name}
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Data urodzenia:</label>
                          <input
                            type="date"
                            value={editingMember.birth_date || ''}
                            onChange={(e) => setEditingMember({ ...editingMember, birth_date: e.target.value })}
                            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Członkostwo od:</label>
                          <input
                            type="date"
                            value={editingMember.member_since || ''}
                            onChange={(e) => setEditingMember({ ...editingMember, member_since: e.target.value })}
                            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Waga (kg):</label>
                          <input
                            type="number"
                            step="0.1"
                            value={editingMember.weight_kg || ''}
                            onChange={(e) => setEditingMember({ ...editingMember, weight_kg: parseFloat(e.target.value) || undefined })}
                            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Wzrost (cm):</label>
                          <input
                            type="number"
                            value={editingMember.height_cm || ''}
                            onChange={(e) => setEditingMember({ ...editingMember, height_cm: parseInt(e.target.value) || undefined })}
                            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 text-xs"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs text-gray-400 mb-1">Badania ważne do:</label>
                          <input
                            type="date"
                            value={editingMember.medical_until || ''}
                            onChange={(e) => setEditingMember({ ...editingMember, medical_until: e.target.value })}
                            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 text-xs"
                          />
                        </div>
                      </div>

                      {/* Akcje w Karcie Zawodnika */}
                      <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                        <button
                          onClick={() => handleDeleteMember(member.id, member.name)}
                          className="bg-red-600/20 text-red-400 border border-red-600/50 hover:bg-red-600 hover:text-white font-bold px-3 py-1.5 rounded-lg text-xs transition"
                        >
                          🗑️ Usuń zawodnika
                        </button>
                        <button
                          onClick={() => handleSaveCard(member.id)}
                          className="bg-green-600 text-white font-bold px-4 py-1.5 rounded-lg text-xs shadow hover:bg-green-700 transition"
                        >
                          Zapisz dane karty
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Stopka */}
      <footer className="mt-8 text-center text-xs text-gray-500 py-4">
        © MentalCorp Media 2026. All rights reserved.
      </footer>
    </div>
  );
}
