import React from 'react';
import Navbar from '../components/Navbar';
import RoomCard from '../components/RoomCard';
import { Room } from '../types';

export default function Home() {
  // Dummy
  const dummyRooms: Room[] = [
    { id: '1', title: 'Push Rank Valorant Ascendant', category: 'Gaming', location: 'Jakarta Selatan', currentParticipants: 3, maxParticipants: 5, masterName: 'Ariq' },
    { id: '2', title: 'Nugas Bareng SBD Modul 6', category: 'Studying', location: 'Depok', currentParticipants: 2, maxParticipants: 4, masterName: 'brum' },
    { id: '3', title: 'Ngopi & Diskusi AI', category: 'Hangout', location: 'Tangerang', currentParticipants: 5, maxParticipants: 5, masterName: 'sooom' },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-4">
            Eksplorasi Ruang
          </h1>
          <p className="text-slate-400 text-lg">Temukan aktivitas yang cocok denganmu hari ini.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </main>

      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
    </div>
  );
}