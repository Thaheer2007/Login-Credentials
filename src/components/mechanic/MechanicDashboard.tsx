import React, { useState } from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { Booking } from '../../types/mechnik';
import { ProblemDetailsModal } from './ProblemDetailsModal';
import {
  Wrench,
  Car,
  Bike,
  Truck,
  Tractor,
  Clock,
  CheckCircle2,
  XCircle,
  Play,
  Check,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Calendar,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  Volume2,
  Image as ImageIcon
} from 'lucide-react';

export const MechanicDashboard: React.FC = () => {
  const {
    bookings,
    acceptBooking,
    rejectBooking,
    startService,
    completeService,
    setActiveTab
  } = useMechnik();

  const [selectedProblemBooking, setSelectedProblemBooking] = useState<Booking | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Pending requests
  const pendingRequests = bookings.filter((b) => b.status === 'REQUESTED');
  // Active jobs (Accepted, Assigned, In Progress)
  const activeJobs = bookings.filter(
    (b) => b.status === 'ACCEPTED' || b.status === 'ASSIGNED' || b.status === 'IN_PROGRESS'
  );
  // Completed jobs
  const completedJobs = bookings.filter((b) => b.status === 'COMPLETED');

  return (
    <div className="space-y-8 pb-16">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-charcoal-900 via-charcoal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-soft-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified Multi-Vehicle Workshop
            </span>
            <span className="text-xs text-slate-400">Shop #14, Indiranagar</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, Ravi 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
            Ravi Auto Care Workshop Portal. You have{' '}
            <strong className="text-mechnik-400 font-bold">{pendingRequests.length} pending request(s)</strong> awaiting your confirmation today.
          </p>
        </div>

        {/* Quick status indicator */}
        <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
          <div>
            <p className="text-xs font-bold text-white">Workshop Open</p>
            <p className="text-[10px] text-slate-300">Cars, Bikes, Trucks & Tractors</p>
          </div>
        </div>
      </div>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Today's Jobs */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Today's Jobs</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {8 + activeJobs.length}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            ↑ 2 from yesterday
          </span>
        </div>

        {/* Pending Requests */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Pending Requests</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-mechnik-600 font-mono">
            {pendingRequests.length}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Awaiting Accept / Reject</span>
        </div>

        {/* Active Jobs */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Active in Bay</span>
            <Wrench className="w-4 h-4 text-mechnik-500 -rotate-45" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {activeJobs.length}
          </div>
          <span className="text-[10px] text-sky-600 font-semibold mt-1 block">
            {activeJobs.filter((j) => j.status === 'IN_PROGRESS').length} in progress
          </span>
        </div>

        {/* Completed Jobs */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Completed Jobs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {128 + completedJobs.length}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">4.8 ★ Workshop</span>
        </div>

        {/* Today's Earnings */}
        <div className="col-span-2 lg:col-span-1 p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-200 shadow-soft">
          <div className="flex items-center justify-between text-mechnik-700 mb-2">
            <span className="text-xs font-bold">Today's Earnings</span>
            <TrendingUp className="w-4 h-4 text-mechnik-600" />
          </div>
          <div className="text-2xl font-extrabold text-charcoal-900 font-mono">
            ₹{2450 + (completedJobs.length > 1 ? (completedJobs.length - 1) * 650 : 0)}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Bank settlement tonight</span>
        </div>
      </div>

      {/* SECTION: NEW JOB REQUESTS */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>New Job Requests</span>
              {pendingRequests.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-mechnik-500 text-white text-xs font-bold animate-pulse">
                  {pendingRequests.length} New
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500">Customer requests waiting for workshop confirmation</p>
          </div>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">All caught up!</h3>
            <p className="text-xs text-slate-500 mt-0.5">No pending customer requests at this moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-2xl border-2 border-mechnik-200 p-5 shadow-soft-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
              >
                {/* Left Request Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-mono font-bold">
                      #{request.id}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{request.serviceName}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs text-slate-500">
                      Mode: <strong className="text-slate-800 capitalize">{request.serviceMode}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Customer</span>
                      <strong className="text-slate-900">{request.customerName}</strong>
                      <span className="text-[11px] text-slate-500 block font-mono">{request.customerPhone}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Vehicle</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        {request.vehicle.imageUrl && (
                          <img
                            src={request.vehicle.imageUrl}
                            alt={request.vehicle.model}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                          />
                        )}
                        <div>
                          <strong className="text-slate-900 block">
                            {request.vehicle.make} {request.vehicle.model}
                          </strong>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            {request.vehicle.registrationNumber || 'Unregistered'}
                            {request.vehicle.nickname && ` • "${request.vehicle.nickname}"`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Requested Time</span>
                      <strong className="text-slate-900">{request.date}</strong>
                      <span className="text-[11px] text-mechnik-600 font-semibold block">{request.timeSlot}</span>
                    </div>
                  </div>

                  {/* Clickable Problem Description */}
                  {request.issueDescription && (
                    <div
                      onClick={() => setSelectedProblemBooking(request)}
                      className="p-3 bg-orange-50/70 hover:bg-orange-100/70 cursor-pointer rounded-xl text-xs border border-orange-200 mt-2 transition-colors group"
                      title="Click to view full diagnosis details"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-mechnik-700 uppercase flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Customer Problem:</span>
                        </span>
                        <span className="text-[10px] text-mechnik-600 font-bold group-hover:underline">
                          View Details →
                        </span>
                      </div>
                      <p className="text-slate-800 font-medium italic">"{request.issueDescription}"</p>
                    </div>
                  )}

                  {/* Problem images & voice note attachments */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedProblemBooking(request)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-100/80 hover:bg-orange-200 text-mechnik-800 text-[11px] font-bold transition-colors border border-orange-200"
                    >
                      <Sparkles className="w-3 h-3 text-mechnik-600" />
                      <span>View Problem Details</span>
                    </button>

                    {request.serviceMode === 'doorstep' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-200">
                        <MapPin className="w-3 h-3 text-amber-700" />
                        <span>Doorstep Pickup</span>
                      </span>
                    )}

                    {request.voiceNote && (
                      <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-200 text-mechnik-600 font-medium">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Voice Note ({request.voiceNote.duration})</span>
                      </div>
                    )}

                    {request.issueImages && request.issueImages.length > 0 && (
                      <div
                        onClick={() => setSelectedProblemBooking(request)}
                        className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                        title="Click to inspect images"
                      >
                        <span className="text-[10px] text-slate-400">{request.issueImages.length} Photos:</span>
                        {request.issueImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Issue ${idx}`}
                            className="w-7 h-7 rounded-md object-cover border border-slate-200"
                          />
                        ))}
                      </div>
                    )}

                    <div className="ml-auto">
                      <span className="text-slate-500 mr-1">Estimated Ticket:</span>
                      <strong className="text-charcoal-900 font-mono text-sm">{request.estimatedCost}</strong>
                    </div>
                  </div>
                </div>

                {/* Right Working Action Buttons */}
                <div className="flex sm:flex-col lg:flex-row items-center gap-3 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <button
                    type="button"
                    onClick={() => rejectBooking(request.id, 'Workshop bay busy during this slot')}
                    className="flex-1 lg:flex-initial px-5 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>REJECT</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => acceptBooking(request.id)}
                    className="flex-1 lg:flex-initial btn-primary px-7 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-mechnik"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ACCEPT</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION: ACTIVE JOBS IN WORKSHOP */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Active Workshop Repairs</h2>
            <p className="text-xs text-slate-500">
              Manage vehicles currently on lift / in service bay
            </p>
          </div>
        </div>

        {activeJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-2 -rotate-45" />
            <h3 className="text-sm font-bold text-slate-800">No active jobs right now</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Accept a pending request above to allocate a bay and begin work.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 p-5 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
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

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600">
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
                            className="w-7 h-7 rounded object-cover border border-slate-200"
                          />
                        )}
                        <div>
                          <strong className="text-slate-900 block">
                            {job.vehicle.make} {job.vehicle.model}
                          </strong>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            {job.vehicle.registrationNumber || 'Unregistered'}
                            {job.vehicle.nickname && ` • "${job.vehicle.nickname}"`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Amount</span>
                      <strong className="text-mechnik-600 font-mono text-sm">{job.estimatedCost}</strong>
                    </div>
                  </div>

                  {job.issueDescription && (
                    <div
                      onClick={() => setSelectedProblemBooking(job)}
                      className="cursor-pointer text-xs text-slate-700 bg-slate-50 hover:bg-orange-50/70 p-2.5 rounded-xl border border-slate-200 hover:border-orange-200 transition-colors group"
                      title="Click to view problem details"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-bold text-mechnik-700 uppercase">Customer Note:</span>
                        <span className="text-[10px] text-mechnik-600 font-bold group-hover:underline">Inspect Details →</span>
                      </div>
                      <p className="italic">"{job.issueDescription}"</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedProblemBooking(job)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-mechnik-700 text-slate-700 text-xs font-bold border border-slate-200 hover:border-orange-200 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-mechnik-500" />
                      <span>View Problem Details</span>
                    </button>

                    {job.serviceMode === 'doorstep' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-200">
                        <MapPin className="w-3 h-3 text-amber-700" />
                        <span>Doorstep Pickup</span>
                      </span>
                    )}

                    {/* Problem images preview if any */}
                    {job.issueImages && job.issueImages.length > 0 && (
                      <div
                        onClick={() => setSelectedProblemBooking(job)}
                        className="flex items-center gap-1.5 ml-2 cursor-pointer hover:opacity-80 transition-opacity"
                        title="Click to inspect images"
                      >
                        <span className="text-[10px] text-slate-400">Photos:</span>
                        {job.issueImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Job photo ${idx}`}
                            className="w-7 h-7 rounded-md object-cover border border-slate-200"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mechanic Service Controls */}
                <div className="w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 flex items-center gap-3">
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
      </section>

      {/* Dedicated Mechanic Problem Details Modal */}
      <ProblemDetailsModal
        booking={selectedProblemBooking}
        isOpen={!!selectedProblemBooking}
        onClose={() => setSelectedProblemBooking(null)}
        onAccept={acceptBooking}
        onReject={(id) => rejectBooking(id, 'Workshop bay busy')}
        onStartService={startService}
        onCompleteService={(id) => completeService(id, 650)}
      />
    </div>
  );
};
