import React, { useState } from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { ShieldCheck, Wrench, Clock, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';

export const MechanicProfileEdit: React.FC = () => {
  const { mechanics, addToast } = useMechnik();
  const currentMechanic = mechanics[0]; // Ravi Auto Care

  const [shopName, setShopName] = useState(currentMechanic.shopName);
  const [ownerName, setOwnerName] = useState(currentMechanic.ownerName);
  const [phone, setPhone] = useState(currentMechanic.phone);
  const [email, setEmail] = useState(currentMechanic.email);
  const [experienceYears, setExperienceYears] = useState(currentMechanic.experienceYears);
  const [workingHours, setWorkingHours] = useState(currentMechanic.workingHours);
  const [area, setArea] = useState(currentMechanic.area);
  const [about, setAbout] = useState(currentMechanic.about);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Workshop Profile Updated', 'Your rates, hours, and workshop details were updated.', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Workshop Profile & Rates</h1>
        <p className="text-xs text-slate-500">Manage your business credentials, operating hours, and service charges</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-6">
        {/* Verification Status Banner */}
        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                ✓ Verified Partner Workshop
              </h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                Mechnik certified inspection partner. Eligible for priority direct customer bookings.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-md border border-emerald-200">
            ID: MECH-1001
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Workshop Name</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Master Mechanic Name</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Experience (Years)</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Working Hours</label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Coverage Area</label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Workshop Bio & Specialization</label>
            <textarea
              rows={3}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          {/* Current Rate Sheet */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Configured Service Rate Sheet
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {currentMechanic.servicesOffered.map((svc) => (
                <div key={svc.serviceId} className="p-3 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <span className="font-bold text-slate-800">{svc.serviceName}</span>
                    <span className="text-[11px] text-slate-500 block">{svc.description}</span>
                  </div>
                  <span className="font-mono font-extrabold text-mechnik-600">{svc.priceRange}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button type="submit" className="btn-primary px-6 py-2.5 text-xs font-bold shadow-mechnik-sm">
              Save Workshop Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
