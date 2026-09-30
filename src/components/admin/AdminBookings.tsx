import React, { useState } from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { Search, ArrowRight } from 'lucide-react';

export const AdminBookings: React.FC = () => {
  const { bookings, setTrackingBookingId } = useMechnik();
  const [filter, setFilter] = useState('all');

  const filtered = bookings.filter((b) => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Bookings Ledger</h1>
          <p className="text-xs text-slate-500">Master audit trail for all service transactions across MECHNIK</p>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800"
        >
          <option value="all">All Statuses</option>
          <option value="REQUESTED">Requested</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100 text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Workshop</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-mechnik-600">#{b.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{b.customerName}</td>
                  <td className="py-3 px-4">{b.mechanicName}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block">{b.serviceName}</span>
                    {b.serviceMode === 'doorstep' || b.pickupAddress ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-mechnik-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200 mt-0.5" title={b.pickupAddress}>
                        <span>🚗 Doorstep</span>
                        {b.pickupAddress && <span className="text-slate-500 truncate max-w-[130px]">({b.pickupAddress})</span>}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">🏢 Workshop Drop</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{b.vehicle.make} {b.vehicle.model}</td>
                  <td className="py-3 px-4">{b.date} • {b.timeSlot}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        b.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'IN_PROGRESS'
                          ? 'bg-orange-100 text-orange-800'
                          : b.status === 'ACCEPTED'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold">{b.estimatedCost}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setTrackingBookingId(b.id)}
                      className="text-xs text-mechnik-600 hover:text-mechnik-700 font-bold"
                    >
                      Inspect →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
