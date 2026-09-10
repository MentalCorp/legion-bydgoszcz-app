'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inicjalizacja połączenia z Supabase na podstawie zmiennych z Vercela
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Member {
  id: string;
  name: string;
  group_name: string;
  has_paid: boolean;
}

export default function Home() {
  const [selectedGroup, setSelectedGroup] = useState('Początkująca');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Pobieranie zawodników z bazy Supabase przy załadowaniu strony
  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setLoading(true);
    const { data, error } = await supabase.from('members').select('*');
    if (error) {
      console.error('Błąd pobierania danych:', error);
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  }

  // Zmiana statusu opłacenia składki w bazie
  async function togglePayment(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('members')
      .update({ has_paid: !currentStatus })
      .eq('id', id);

    if (!error) {
      setMembers(members.map(m => m.id === id ? { ...m, has_paid: !currentStatus } : m));
    }
  }

  const filteredMembers = members.filter(m => m.group_name === selectedGroup);

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      {/* Nagłówek */}
      <header className="bg-[#FFDF00] p-4 rounded-xl border-b-4 border-[#1251A2] flex items-center justify-between mb-6 shadow">
        <div className="flex items-center space-x-3">
          <img 
            src="/logo.png" 
            alt="Legion Bydgoszcz" 
            className="h-12 w-auto object-contain" 
          />
          <h1 className="font-extrabold text-[#1251A2] text-xl tracking-wider">
            LEGION BYDGOSZCZ
          </h1>
        </div>
      </header>

      {/* Wybór grupy */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 flex justify-between items-center">
        <span className="font-bold text-gray-700">Grupa:</span>
        <select 
          value={selectedGroup} 
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="bg-[#FFDF00] font-bold p-2 rounded-lg border border-yellow-500 outline-none text-gray-900"
        >
          <option value="Początkująca">Początkująca</option>
          <option value="Zaawansowana">Zaawansowana</option>
        </select>
      </div>

      {/* Lista zawodników z bazy */}
      <div className="bg-white rounded-xl shadow divide-y divide-gray-100">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Ładowanie zawodników z bazy...</div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Brak zawodników w tej grupie.</div>
        ) : (
          filteredMembers.map((member) => (
            <div key={member.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800">{member.name}</p>
                <button 
                  onClick={() => togglePayment(member.id, member.has_paid)}
                  className={`text-xs px-2 py-1 rounded font-semibold mt-1 transition ${
                    member.has_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {member.has_paid ? 'Składka: Opłacona ✓' : 'Składka: Zaległość ✕'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
