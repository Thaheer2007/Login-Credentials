import React, { useState } from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const MechanicSchedule: React.FC = () => {
  const { bookings } = useMechnik();
  const [selectedDay, setSelectedDay] = useState('Tomorrow');

  const slots = [
    { time: '09:00 AM', status: 'Available' },
    { time: '10:00 AM', status: 'Booked (MK1024 - Brake Repair)' },
    { time: '11:00 AM', status: 'Booked' },
    { time: '12:00 PM', status: 'Available' },
    { time: '02:00 PM', status: 'Available' },
    { time: '04:00 PM', status: 'Maintenance Break' },
    { time: '06:00 PM', status: 'Available' }
  ];

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Workshop Schedule</h1>
        <p className="text-xs text-slate-500">Manage operating hours, lunch breaks, and technician service slots</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          {['Today', 'Tomorrow', 'Saturday', 'Sunday'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDay(d)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDay === d
                  ? 'bg-mechnik-500 text-white shadow-mechnik-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {slots.map((s, idx) => {
            const isBooked = s.status.includes('Booked');
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  isBooked ? 'bg-orange-50/50 border-orange-200' : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className={`w-4 h-4 ${isBooked ? 'text-mechnik-500' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold font-mono text-slate-900">{s.time}</span>
                  <span className="text-xs text-slate-600">{s.status}</span>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    isBooked ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isBooked ? 'Occupied' : 'Open'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
