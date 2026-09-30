import React from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { Modal } from '../common/Modal';
import { RatingStars } from '../common/RatingStars';
import {
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  Navigation,
  Wrench,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  Bike
} from 'lucide-react';

export const MechanicProfileModal: React.FC = () => {
  const { selectedMechanic, setSelectedMechanic, openBookingModal, addToast } = useMechnik();

  if (!selectedMechanic) return null;

  const handleCall = () => {
    addToast('Calling Mechanic', `Dialing ${selectedMechanic.phone}...`, 'info');
  };

  const handleDirections = () => {
    addToast('Opening Map', `Navigating to ${selectedMechanic.shopName} (${selectedMechanic.distanceKm} km away)`, 'info');
  };

  const handleBookNow = (serviceName?: string) => {
    const mech = selectedMechanic;
    setSelectedMechanic(null);
    openBookingModal(mech, serviceName);
  };

  return (
    <Modal
      isOpen={!!selectedMechanic}
      onClose={() => setSelectedMechanic(null)}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Banner / Header Card */}
        <div className="relative rounded-2xl bg-gradient-to-r from-charcoal-900 to-charcoal-800 text-white p-6 overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none mechnik-grid-bg" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <img
                src={selectedMechanic.avatarUrl}
                alt={selectedMechanic.ownerName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-extrabold tracking-tight">{selectedMechanic.shopName}</h2>
                  {selectedMechanic.verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Mechanic
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Master Technician: <strong>{selectedMechanic.ownerName}</strong> • {selectedMechanic.experienceYears}+ years of experience
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <RatingStars rating={selectedMechanic.rating} size="sm" />
                    <span className="font-bold text-white">{selectedMechanic.rating}</span>
                    <span className="text-slate-400">({selectedMechanic.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-mechnik-400" />
                    <span>{selectedMechanic.distanceKm} km away • {selectedMechanic.area}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 self-stretch sm:self-center">
              <button
                type="button"
                onClick={handleCall}
                className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call</span>
              </button>
              <button
                type="button"
                onClick={handleDirections}
                className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-sky-400" />
                <span>Directions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overview Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 text-mechnik-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Working Hours</p>
              <p className="text-xs font-bold text-slate-900">{selectedMechanic.workingHours}</p>
              <span className="text-[10px] text-emerald-600 font-semibold">● Open Today</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Service Coverage</p>
              <p className="text-xs font-bold text-slate-900">{selectedMechanic.area} & 5 km</p>
              <span className="text-[10px] text-slate-500 font-medium">Doorstep Pickup Available</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Experience & Tools</p>
              <p className="text-xs font-bold text-slate-900">{selectedMechanic.experienceYears}+ Yrs Active</p>
              <span className="text-[10px] text-slate-500 font-medium">OEM Diagnostic Scanners</span>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">About Workshop</h3>
          <p className="text-xs text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-100">
            {selectedMechanic.about}
          </p>
        </div>

        {/* Estimated Charges Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Services & Estimated Charges
            </h3>
            <span className="text-[11px] text-slate-400">Upfront transparent pricing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedMechanic.servicesOffered.map((svc) => (
              <div
                key={svc.serviceId}
                className="p-3.5 rounded-xl border border-slate-200/80 hover:border-mechnik-500/60 bg-white hover:bg-orange-50/20 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-mechnik-500 flex-shrink-0" />
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-mechnik-600 transition-colors">
                      {svc.serviceName}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{svc.description}</p>
                  <span className="text-[10px] text-slate-400 mt-0.5 inline-block">Duration: ~{svc.duration}</span>
                </div>

                <div className="text-right pl-3">
                  <span className="text-xs font-extrabold text-slate-900 block font-mono">
                    {svc.priceRange}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleBookNow(svc.serviceId)}
                    className="mt-1 text-[10px] font-bold text-mechnik-600 hover:text-mechnik-700 hover:underline"
                  >
                    Select →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Customer Reviews */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Customer Reviews ({selectedMechanic.reviews.length})
            </h3>
            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
              <span>⭐ {selectedMechanic.rating} Rating</span>
            </div>
          </div>

          <div className="space-y-3">
            {selectedMechanic.reviews.map((rev) => (
              <div key={rev.id} className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-charcoal-800 text-white font-bold flex items-center justify-center text-[10px]">
                      {rev.authorName[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{rev.authorName}</p>
                      <p className="text-[10px] text-slate-400">{rev.date} • {rev.serviceName}</p>
                    </div>
                  </div>
                  <RatingStars rating={rev.rating} size="sm" />
                </div>
                <p className="text-xs text-slate-600 mt-2 italic">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Booking CTA Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">Fast Confirmation</p>
            <p className="text-sm font-bold text-slate-900">{selectedMechanic.availabilityNote}</p>
          </div>
          <button
            type="button"
            onClick={() => handleBookNow()}
            className="btn-primary px-6 py-3 text-sm font-bold shadow-mechnik"
          >
            BOOK SERVICE NOW
          </button>
        </div>
      </div>
    </Modal>
  );
};
