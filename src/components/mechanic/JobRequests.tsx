import React, { useState } from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { Booking } from '../../types/mechnik';
import { ProblemDetailsModal } from './ProblemDetailsModal';
import { Clock, CheckCircle2, XCircle, Car, MapPin, Volume2, Sparkles } from 'lucide-react';

export const JobRequests: React.FC = () => {
  const { bookings, acceptBooking, rejectBooking } = useMechnik();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const pendingRequests = bookings.filter((b) => b.status === 'REQUESTED');

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Incoming Job Requests</h1>
        <p className="text-xs text-slate-500">Review, accept or decline service appointments requested by vehicle owners</p>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Pending Requests</h3>
          <p className="text-xs text-slate-500 mt-1">All incoming bookings have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-mechnik-700 text-xs font-mono font-bold">
                    #{req.id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{req.serviceName}</h3>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs text-slate-600 font-semibold">{req.date} at {req.timeSlot}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Customer</span>
                    <strong className="text-slate-900">{req.customerName}</strong>
                    <span className="text-[11px] text-slate-500 block font-mono">{req.customerPhone}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Vehicle</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      {req.vehicle.imageUrl && (
                        <img
                          src={req.vehicle.imageUrl}
                          alt={req.vehicle.model}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                        />
                      )}
                      <div>
                        <strong className="text-slate-900 block">{req.vehicle.make} {req.vehicle.model}</strong>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {req.vehicle.registrationNumber || 'Unregistered'}
                          {req.vehicle.nickname && ` • "${req.vehicle.nickname}"`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ticket Price</span>
                    <strong className="text-charcoal-900 font-mono text-sm">{req.estimatedCost}</strong>
                  </div>
                </div>

                {req.issueDescription && (
                  <div
                    onClick={() => setSelectedBooking(req)}
                    className="cursor-pointer text-xs text-slate-700 bg-orange-50/70 hover:bg-orange-100/70 p-2.5 rounded-xl border border-orange-200 transition-colors group"
                    title="Click to view problem details"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-bold text-mechnik-700 uppercase">Customer Problem:</span>
                      <span className="text-[10px] text-mechnik-600 font-bold group-hover:underline">View Full Details →</span>
                    </div>
                    <p className="italic">"{req.issueDescription}"</p>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedBooking(req)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-100/80 hover:bg-orange-200 text-mechnik-800 text-xs font-bold transition-colors border border-orange-200"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-mechnik-600" />
                    <span>View Problem Details</span>
                  </button>

                  {req.serviceMode === 'doorstep' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      <span>Doorstep Pickup</span>
                    </span>
                  )}

                  {req.voiceNote && (
                    <div className="flex items-center gap-1.5 text-mechnik-600 font-semibold bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Voice Note ({req.voiceNote.duration})</span>
                    </div>
                  )}

                  {req.issueImages && req.issueImages.length > 0 && (
                    <div
                      onClick={() => setSelectedBooking(req)}
                      className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <span className="text-[10px] text-slate-400">{req.issueImages.length} Photos:</span>
                      {req.issueImages.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Problem ${i}`}
                          className="w-7 h-7 rounded-md object-cover border border-slate-200"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => rejectBooking(req.id)}
                  className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors"
                >
                  REJECT
                </button>
                <button
                  type="button"
                  onClick={() => acceptBooking(req.id)}
                  className="flex-1 md:flex-initial btn-primary px-6 py-2.5 text-xs font-bold shadow-mechnik"
                >
                  ACCEPT REQUEST
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Problem Details Modal */}
      <ProblemDetailsModal
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onAccept={acceptBooking}
        onReject={rejectBooking}
      />
    </div>
  );
};
