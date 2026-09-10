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
}

const MONTHS = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

export default function Home() {
  const [selectedGroup, setSelectedGroup] = useState('Początkująca');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(9); // Wrzesień 2026
  
  // 1. Domyślnie włączony Dark Mode
  const [darkMode, setDarkMode] = useState(true);

  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Record<string, boolean>>({});
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Formularz nowego członka
  const [newName, setNewName] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);

  async function fetchData() {
    setLoading(true);
    const { data: membersData, error: memErr } = await supabase.from('members').select('*');
    if (memErr) console.error('Błąd pobierania członków:', memErr);
    setMembers(membersData || []);

    const { data: paymentsData } = await supabase
      .from('payments')
      .select('*')
      .eq('year', selectedYear)
      .eq('month', selectedMonth);

    const payMap: Record<string, boolean> = {};
    paymentsData?.forEach(p => { payMap[p.member_id] = p.has_paid; });
    setPayments(payMap);

    const { data: attendanceData } = await supabase
      .from('attendance')
      .select('*')
      .eq('year', selectedYear)
      .eq('month', selectedMonth);

    const attMap: Record<string, boolean> = {};
    attendanceData?.forEach(a => { attMap[a.member_id] = a.is_present; });
    setAttendance(attMap);

    setLoading(false);
  }

  // 2. Naprawione dodawanie członka do aktywnej grupy
  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;

    const { error } = await supabase
      .from('members')
      .insert([{ name: newName.trim(), group_name: selectedGroup }]);

    if (error) {
      alert('Błąd podczas dodawania: ' + error.message);
    } else {
      setNewName('');
      await fetchData(); // Odświeżenie danych po dodaniu
    }
  }

  // Usuwanie członka
  async function handleDeleteMember(id: string) {
    if (!confirm('Czy na pewno chcesz usunąć zawodnika?')) return;
    const { error } = await supabase.from('members').delete().eq('id', id);
    if (!error) {
      setMembers(members.filter(m => m.id !== id));
    } else {
      alert('Błąd podczas usuwania: ' + error.message);
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

  // Przełączanie obecności
  async function toggleAttendance(memberId: string) {
    const currentStatus = !!attendance[memberId];
    const newStatus = !currentStatus;

    setAttendance({ ...attendance, [memberId]: newStatus });

    await supabase.from('attendance').upsert({
      member_id: memberId,
      year: selectedYear,
      month: selectedMonth,
      is_present: newStatus
    });
  }

  // Eksport do CSV / Excel
  function exportToExcel() {
    if (members.length === 0) {
      alert('Brak danych do wyeksportowania.');
      return;
    }

    const monthName = MONTHS[selectedMonth - 1];
    let csvContent = `Imię i nazwisko;Grupa;Rok;Miesiąc;Składka;Obecność\n`;

    members.forEach(member => {
      const isPaid = payments[member.id] ? 'Opłacona' : 'Zaległość';
      const isPresent = attendance[member.id] ? 'Obecny' : 'Brak';
      csvContent += `"${member.name}";"${member.group_name}";"${selectedYear}";"${monthName}";"${isPaid}";"${isPresent}"\n`;
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

  const filteredMembers = members.filter(m => m.group_name === selectedGroup);

  return (
    <div className={`min-h-screen flex flex-col justify-between p-4 font-sans transition-colors ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div>
        {/* Nagłówek & Przełącznik Dark Mode */}
        <header className="bg-[#FFDF00] p-4 rounded-xl border-b-4 border-[#1251A2] flex items-center justify-between mb-6 shadow">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Legion Bydgoszcz" className="h-10 w-auto object-contain" />
            <h1 className="font-extrabold text-[#1251A2] text-lg tracking-wider">
              LEGION BYDGOSZCZ
            </h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-[#1251A2] text-[#FFDF00] font-bold px-3 py-1 rounded-lg text-xs shadow"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </header>

        {/* Panel Wyboru */}
        <div className={`p-4 rounded-xl shadow mb-4 space-y-3 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center">
            <span className="font-bold">Rok:</span>
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
            <span className="font-bold">Miesiąc:</span>
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
            <span className="font-bold">Grupa:</span>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-[#FFDF00] font-bold p-2 rounded-lg text-gray-900 outline-none text-sm"
            >
              <option value="Początkująca">Początkująca</option>
              <option value="Zaawansowana">Zaawansowana</option>
            </select>
          </div>

          <div className="pt-2 border-t border-gray-700 flex justify-end">
            <button
              onClick={exportToExcel}
              className="bg-[#FFDF00] text-[#1251A2] font-extrabold px-3 py-2 rounded-lg text-xs flex items-center gap-1 shadow hover:bg-yellow-400 transition"
            >
              📊 Eksportuj do Excela (.csv)
            </button>
          </div>
        </div>

        {/* Formularz Dodawania Członka */}
        <form onSubmit={handleAddMember} className={`p-4 rounded-xl shadow mb-4 flex gap-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <input
            type="text"
            placeholder={`Nowy zawodnik w gr. ${selectedGroup}`}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 p-2 rounded-lg border border-gray-600 text-gray-900 text-sm outline-none"
          />
          <button type="submit" className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-sm shadow hover:bg-green-700">
            + Dodaj
          </button>
        </form>

        {/* Lista Zawodników */}
        <div className={`rounded-xl shadow divide-y ${darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-100'}`}>
          {loading ? (
            <div className="p-4 text-center text-gray-400">Ładowanie danych...</div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-4 text-center text-gray-400">Brak zawodników w grupie {selectedGroup}.</div>
          ) : (
            filteredMembers.map((member) => (
              <div key={member.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold">{member.name}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => togglePayment(member.id)}
                      className={`text-xs px-2 py-1 rounded font-semibold ${payments[member.id] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      Składka: {payments[member.id] ? 'Opłacona ✓' : 'Zaległość ✕'}
                    </button>
                    <button
                      onClick={() => toggleAttendance(member.id)}
                      className={`text-xs px-2 py-1 rounded font-semibold ${attendance[member.id] ? 'bg-blue-100 text-blue-800' : 'bg-gray-700 text-gray-300'}`}
                    >
                      Obecność: {attendance[member.id] ? 'Obecny ✓' : 'Brak'}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="text-red-500 text-sm font-bold px-2 py-1 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))
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
