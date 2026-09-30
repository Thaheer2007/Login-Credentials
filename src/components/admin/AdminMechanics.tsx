import React from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { RatingStars } from '../common/RatingStars';
import { ShieldCheck, MapPin, CheckCircle2, XCircle } from 'lucide-react';

export const AdminMechanics: React.FC = () => {
  const { mechanics, verifyMechanic } = useMechnik();

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Mechanic Workshop Directory</h1>
        <p className="text-xs text-slate-500">Audit workshop credentials, license numbers, and manage verification badges</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100 text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Workshop</th>
                <th className="py-3 px-4">Master Mechanic</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {mechanics.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={m.avatarUrl}
                        alt={m.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{m.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{m.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{m.ownerName}</td>
                  <td className="py-3 px-4 text-slate-600">{m.area}, {m.city}</td>
                  <td className="py-3 px-4">{m.experienceYears} Years</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <RatingStars rating={m.rating} size="sm" />
                      <span className="font-bold text-slate-800">{m.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {m.verified ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        Verified ✓
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {!m.verified ? (
                      <button
                        type="button"
                        onClick={() => verifyMechanic(m.id, true)}
                        className="btn-primary px-3 py-1 text-xs font-bold shadow-mechnik-sm"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => verifyMechanic(m.id, false)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Revoke Badge
                      </button>
                    )}
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
