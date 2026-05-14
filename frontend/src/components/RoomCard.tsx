import React from 'react';
import { Room } from '../types';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const badgeColor = 
    room.category === 'Gaming' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
    room.category === 'Studying' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
    'bg-orange-500/20 text-orange-400 border-orange-500/30';

  const isFull = room.currentParticipants >= room.maxParticipants;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.15)] transition-all group flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${badgeColor}`}>
          {room.category}
        </span>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          📍 {room.location}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors">
        {room.title}
      </h3>
      
      <p className="text-sm text-slate-400 mb-6 flex-1">
        Dibuat oleh <span className="text-slate-200 font-medium">{room.masterName}</span>
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500">Kuota Partisipan</span>
          <span className={`text-sm font-bold ${isFull ? 'text-red-400' : 'text-slate-200'}`}>
            {room.currentParticipants} / {room.maxParticipants} Orang
          </span>
        </div>
        
        <button 
          disabled={isFull}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            isFull 
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
            : 'bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white'
          }`}
        >
          {isFull ? 'Penuh' : 'Join'}
        </button>
      </div>
    </div>
  );
}