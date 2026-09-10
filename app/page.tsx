'use client';

import { useState } from 'react';

interface Member {
  id: string;
  name: string;
  group: string;
  isPresent: boolean;
  hasPaid: boolean;
}

export default function Home() {
  const [selectedGroup, setSelectedGroup] = useState('Początkująca');
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Jan Kowalski', group: 'Początkująca', isPresent: false, hasPaid: true },
    { id: '2', name: 'Michał Nowak', group: 'Początkująca', isPresent: false, hasPaid: false },
    { id: '3', name: 'Piotr Wiśniewski', group: 'Zaawansowana', isPresent: false, hasPaid: true },
  ]);

  const toggleAttendance = (id: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, isPresent: !m.isPresent } : m));
  };

  const filteredMembers = members.filter(m => m.group === selectedGroup);

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      {/* Nagłówek bez znacznika img */}
      <header className="bg-[#FFDF00] p-4 rounded-xl border-b-4 border-[#1251A2] flex items-center justify-between mb-6 shadow">
        <div className="flex items-center space-x-3">
          <div className="bg-[#1251A2] text-[#FFDF00] font-black px-3 py-1 rounded-lg text-lg">
            MT
          </div>
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

      {/* Lista zawodników */}
      <div className="bg-white rounded-xl shadow divide-y divide-gray-100">
        {filteredMembers.map((member) => (
          <div key={member.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-800">{member.name}</p>
              <span className={`text-xs px-2 py-0.5 rounded font-semibold ${member.hasPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {member.hasPaid ? 'Składka: Opłacona' : 'Składka: Zaległość'}
              </span>
            </div>
            <button
              onClick={() => toggleAttendance(member.id)}
              className={`w-12 h-12 rounded-xl text-xl font-bold ${
                member.isPresent ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 border'
              }`}
            >
              {member.isPresent ? '✓' : '+'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}