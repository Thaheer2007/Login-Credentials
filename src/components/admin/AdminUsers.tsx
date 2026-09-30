import React from 'react';
import { Users, Bike, CheckCircle2 } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const dummyUsers = [
    {
      id: 'usr-1',
      name: 'Sai Kumar',
      phone: '+91 98765 43210',
      email: 'sai.kumar@example.com',
      vehicles: 'Hyundai Creta (Car), Activa 6G (Bike)',
      joined: 'May 2026',
      totalBookings: 3
    },
    {
      id: 'usr-2',
      name: 'Ananya Reddy',
      phone: '+91 98450 12345',
      email: 'ananya.r@example.com',
      vehicles: 'Tata Ace Gold (Truck), Jupiter 125 (Bike)',
      joined: 'Jun 2026',
      totalBookings: 2
    },
    {
      id: 'usr-3',
      name: 'Vikram Joshi',
      phone: '+91 97410 99887',
      email: 'vikram.j@example.com',
      vehicles: 'Mahindra 575 DI (Tractor)',
      joined: 'Jul 2026',
      totalBookings: 1
    },
    {
      id: 'usr-4',
      name: 'Tanmay Bhatt',
      phone: '+91 99002 44332',
      email: 'tanmay.b@example.com',
      vehicles: 'Maruti Brezza (Car)',
      joined: 'Aug 2026',
      totalBookings: 4
    }
  ];

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Registered Vehicle Owners</h1>
        <p className="text-xs text-slate-500">Directory of verified vehicle owners registered on the platform</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100 text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Registered Vehicles</th>
                <th className="py-3 px-4">Member Since</th>
                <th className="py-3 px-4 text-right">Bookings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {dummyUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-slate-800 block">{u.phone}</span>
                    <span className="text-slate-400 text-[11px]">{u.email}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{u.vehicles}</td>
                  <td className="py-3 px-4 text-slate-500">{u.joined}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{u.totalBookings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
