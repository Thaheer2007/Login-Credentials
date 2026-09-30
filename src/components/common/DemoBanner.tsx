import React, { useState } from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { Wrench, Shield, User, RotateCcw, ChevronDown, ChevronUp, Sparkles, ArrowRight } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { currentRole, setCurrentRole, resetDemoData, bookings } = useMechnik();
  const [collapsed, setCollapsed] = useState(false);

  // Find the primary interactive booking MK1024 or latest
  const targetBooking = bookings.find((b) => b.id === 'MK1024') || bookings[0];

  return (
    <div className="bg-charcoal-900 text-white border-b border-charcoal-800 text-xs py-2 px-4 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Branding & Current Context */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mechnik-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-mechnik-500"></span>
          </span>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-mechnik-400 font-bold uppercase tracking-wider">Demo Sandbox</span>
            <span className="text-charcoal-400">|</span>
            <span className="text-slate-200">
              Active Role: <strong className="text-white capitalize">{currentRole}</strong>
            </span>
            {targetBooking && (
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-charcoal-800 text-slate-300 text-[11px] border border-charcoal-700">
                Booking #{targetBooking.id}: <strong className="text-mechnik-400 font-semibold">{targetBooking.status}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Middle: Recommended Action / Helper */}
        <div className="hidden lg:flex items-center gap-2 text-slate-300 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-mechnik-400" />
          {targetBooking?.status === 'REQUESTED' ? (
            <span>
              💡 <em>Step 1:</em> Switch to <strong>Mechanic</strong> below to <strong>Accept</strong> #{targetBooking.id}.
            </span>
          ) : targetBooking?.status === 'ACCEPTED' ? (
            <span>
              💡 <em>Step 2:</em> As <strong>Mechanic</strong>, click <strong>Start Service</strong>.
            </span>
          ) : targetBooking?.status === 'IN_PROGRESS' ? (
            <span>
              💡 <em>Step 3:</em> As <strong>Mechanic</strong>, click <strong>Mark as Completed</strong>.
            </span>
          ) : targetBooking?.status === 'COMPLETED' && !targetBooking.rating ? (
            <span>
              💡 <em>Step 4:</em> Switch to <strong>Vehicle Owner</strong> & click <strong>Rate Mechanic</strong>!
            </span>
          ) : (
            <span>
              💡 <em>Flow complete!</em> Click Book Service to create another booking or reset demo data.
            </span>
          )}
        </div>

        {/* Right: Instant Role Switchers & Reset */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="inline-flex rounded-lg bg-charcoal-800 p-0.5 border border-charcoal-700">
            <button
              type="button"
              onClick={() => setCurrentRole('owner')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                currentRole === 'owner'
                  ? 'bg-mechnik-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Vehicle Owner perspective (Sai Kumar)"
            >
              <User className="w-3 h-3" />
              <span>Owner</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentRole('mechanic')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                currentRole === 'mechanic'
                  ? 'bg-mechnik-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Mechanic Portal (Ravi Auto Care)"
            >
              <Wrench className="w-3 h-3" />
              <span>Mechanic</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentRole('admin')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                currentRole === 'admin'
                  ? 'bg-mechnik-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Admin Operations Console"
            >
              <Shield className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>

          <button
            type="button"
            onClick={resetDemoData}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-charcoal-800 hover:bg-charcoal-700 text-slate-300 hover:text-white border border-charcoal-700 transition-colors"
            title="Reset to default demo data"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
