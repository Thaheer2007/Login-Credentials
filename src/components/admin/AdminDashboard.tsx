import React from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { ADMIN_STATS } from '../../data/mockData';
import {
  Users,
  Wrench,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Clock,
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { mechanics, bookings, verifyMechanic, setActiveTab } = useMechnik();

  const pendingVerificationMechanics = mechanics.filter((m) => !m.verified || m.verificationStatus === 'pending');

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Operations Console</h1>
          <p className="text-xs text-slate-500">Platform governance, mechanic auditing, booking monitoring & marketplace health</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Online • 99.98% Uptime
          </span>
        </div>
      </div>

      {/* TOP KPI STATISTICS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Registered Users */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Registered Users</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {ADMIN_STATS.registeredUsers.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            ↑ +42 this week
          </span>
        </div>

        {/* Verified Mechanics */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Verified Mechanics</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {ADMIN_STATS.verifiedMechanics + mechanics.filter((m) => m.verified).length - 4}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Across Bengaluru</span>
        </div>

        {/* Total Bookings */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Bookings</span>
            <Wrench className="w-4 h-4 text-mechnik-500 -rotate-45" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {ADMIN_STATS.totalBookings + (bookings.length - 2)}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            ↑ 94.2% fulfillment
          </span>
        </div>

        {/* Completed Bookings */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Completed Bookings</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {ADMIN_STATS.completedBookings + bookings.filter((b) => b.status === 'COMPLETED').length - 1}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Average rating: 4.82 ★</span>
        </div>

        {/* Platform Revenue */}
        <div className="col-span-2 sm:col-span-1 p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-200 shadow-soft">
          <div className="flex items-center justify-between text-mechnik-700 mb-2">
            <span className="text-xs font-bold">Platform Revenue</span>
            <TrendingUp className="w-4 h-4 text-mechnik-600" />
          </div>
          <div className="text-2xl font-extrabold text-charcoal-900 font-mono">
            ₹{ADMIN_STATS.platformRevenue.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">10% Platform fee</span>
        </div>
      </div>

      {/* SECTION: MECHANIC VERIFICATION QUEUE */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Mechanic Verification Queue</span>
              {pendingVerificationMechanics.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                  {pendingVerificationMechanics.length} Pending
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500">Audit workshop identity, certifications and physical setup before approving onto MECHNIK</p>
          </div>
          <button
            onClick={() => setActiveTab('admin-mechanics')}
            className="text-xs font-bold text-mechnik-600 hover:underline"
          >
            Manage All
          </button>
        </div>

        <div className="space-y-3">
          {mechanics.map((mech) => (
            <div
              key={mech.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={mech.avatarUrl}
                  alt={mech.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{mech.name}</h4>
                    {mech.verified ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        Verified ✓
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                        Pending Verification
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {mech.ownerName} • {mech.address} • {mech.experienceYears} yrs exp
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {!mech.verified ? (
                  <>
                    <button
                      type="button"
                      onClick={() => verifyMechanic(mech.id, false)}
                      className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => verifyMechanic(mech.id, true)}
                      className="btn-primary px-4 py-1.5 text-xs font-bold shadow-mechnik-sm"
                    >
                      Approve Workshop
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active on Marketplace</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: RECENT PLATFORM BOOKINGS TABLE */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Platform Bookings</h2>
            <p className="text-xs text-slate-500">Real-time audit log of customer service orders</p>
          </div>
          <button
            onClick={() => setActiveTab('admin-bookings')}
            className="text-xs font-bold text-mechnik-600 hover:underline"
          >
            View All ({bookings.length})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100 text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-3">Booking ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Workshop</th>
                <th className="py-3 px-3">Service</th>
                <th className="py-3 px-3">Vehicle</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Est. Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-mechnik-600">#{b.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{b.customerName}</td>
                  <td className="py-3 px-3">{b.mechanicName}</td>
                  <td className="py-3 px-3">{b.serviceName}</td>
                  <td className="py-3 px-3 text-slate-500">
                    {b.vehicle.make} {b.vehicle.model}
                  </td>
                  <td className="py-3 px-3">{b.date}</td>
                  <td className="py-3 px-3">
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
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    {b.estimatedCost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
