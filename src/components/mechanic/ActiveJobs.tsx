import React, { useState } from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { Booking } from '../../types/mechnik';
import { ProblemDetailsModal } from './ProblemDetailsModal';
import { Wrench, Play, CheckCircle2, Car, User, Sparkles, MapPin } from 'lucide-react';

export const ActiveJobs: React.FC = () => {
  const { bookings, startService, completeService } = useMechnik();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const activeJobs = bookings.filter((b) => b.status === 'ACCEPTED' || b.status === 'ASSIGNED' || b.status === 'IN_PROGRESS');

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Active Workshop Jobs</h1>
        <p className="text-xs text-slate-500">Track real-time maintenance on vehicles currently inside the service bay</p>
      </div>

      {activeJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3 -rotate-45" />
          <h3 className="text-base font-bold text-slate-900">No Active Jobs in Bay</h3>
          <p className="text-xs text-slate-500 mt-1">Accept incoming booking requests to begin servicing.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-mono font-bold">
                    #{job.id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{job.serviceName}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      job.status === 'IN_PROGRESS'
                        ? 'bg-orange-100 text-orange-800 animate-pulse'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {job.status === 'IN_PROGRESS' ? '⚙️ Servicing Active' : 'Slot Confirmed'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Customer</span>
                    <strong className="text-slate-900">{job.customerName}</strong>
                    <span className="text-[11px] text-slate-500 block font-mono">{job.customerPhone}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Vehicle</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      {job.vehicle.imageUrl && (
                        <img
                          src={job.vehicle.imageUrl}
                          alt={job.vehicle.model}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                        />
                      )}
                      <div>
                        <strong className="text-slate-900 block">{job.vehicle.make} {job.vehicle.model}</strong>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {job.vehicle.registrationNumber || 'Unregistered'}
                          {job.vehicle.nickname && ` • "${job.vehicle.nickname}"`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ticket Price</span>
                    <strong className="text-charcoal-900 font-mono text-sm">{job.estimatedCost}</strong>
                  </div>
                </div>

                {job.issueDescription && (
                  <div
                    onClick={() => setSelectedBooking(job)}
                    className="cursor-pointer text-xs text-slate-700 bg-slate-50 hover:bg-orange-50/70 p-2.5 rounded-xl border border-slate-200 transition-colors group"
                    title="Click to view problem details"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-bold text-mechnik-700 uppercase">Customer Note:</span>
                      <span className="text-[10px] text-mechnik-600 font-bold group-hover:underline">Inspect Details →</span>
                    </div>
                    <p className="italic">"{job.issueDescription}"</p>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedBooking(job)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-mechnik-700 text-slate-700 text-xs font-bold border border-slate-200 hover:border-orange-200 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-mechnik-500" />
                    <span>View Problem Details</span>
                  </button>

                  {job.serviceMode === 'doorstep' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      <span>Doorstep Pickup</span>
                    </span>
                  )}

                  {job.issueImages && job.issueImages.length > 0 && (
                    <div
                      onClick={() => setSelectedBooking(job)}
                      className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <span className="text-[10px] text-slate-400">{job.issueImages.length} Photos:</span>
                      {job.issueImages.map((img, i) => (
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

              <div className="w-full md:w-auto">
                {job.status === 'ACCEPTED' || job.status === 'ASSIGNED' ? (
                  <button
                    type="button"
                    onClick={() => startService(job.id)}
                    className="w-full md:w-auto btn-primary px-6 py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-mechnik-sm"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>START SERVICE</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => completeService(job.id, 650)}
                    className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>MARK AS COMPLETED</span>
                  </button>
                )}
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
        onStartService={startService}
        onCompleteService={(id) => completeService(id, 650)}
      />
    </div>
  );
};
