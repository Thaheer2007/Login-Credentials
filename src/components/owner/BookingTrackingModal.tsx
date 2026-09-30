import React, { useState } from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { Modal } from '../common/Modal';
import {
  Wrench,
  Car,
  Bike,
  Truck,
  Tractor,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  AlertCircle,
  Star,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Ban,
  Volume2,
  Image as ImageIcon,
  Play,
  Pause
} from 'lucide-react';

export const BookingTrackingModal: React.FC = () => {
  const {
    trackingBookingId,
    setTrackingBookingId,
    bookings,
    rejectBooking,
    openReviewModal,
    addToast
  } = useMechnik();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!trackingBookingId) return null;

  const booking = bookings.find((b) => b.id === trackingBookingId);
  if (!booking) return null;

  const handleContactMechanic = () => {
    addToast('Connecting to Mechanic', `Calling ${booking.mechanicName} at ${booking.mechanicPhone}`, 'info');
  };

  const handleCancel = () => {
    if (confirm(`Are you sure you want to cancel booking #${booking.id}?`)) {
      rejectBooking(booking.id, 'Cancelled by customer');
    }
  };

  // Status mapping
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REQUESTED':
        return (
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
            ● Requested (Awaiting Workshop)
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            ✓ Accepted by Mechanic
          </span>
        );
      case 'ASSIGNED':
        return (
          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider">
            ● Service Bay Allocated
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider animate-pulse">
            ⚙️ Service In Progress
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            ✅ Service Completed
          </span>
        );
      case 'REJECTED':
      case 'CANCELLED':
        return (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider">
            ✕ {status}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={!!trackingBookingId}
      onClose={() => setTrackingBookingId(null)}
      title={
        <div className="flex items-center gap-2">
          <span>Booking #{booking.id}</span>
          {getStatusBadge(booking.status)}
        </div>
      }
      subtitle={`Scheduled for ${booking.date} at ${booking.timeSlot}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Dynamic Status Live Banner */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            booking.status === 'COMPLETED'
              ? 'bg-emerald-50 border-emerald-200'
              : booking.status === 'IN_PROGRESS'
              ? 'bg-orange-50 border-orange-200'
              : booking.status === 'ACCEPTED'
              ? 'bg-sky-50 border-sky-200'
              : 'bg-amber-50/70 border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  booking.status === 'COMPLETED'
                    ? 'bg-emerald-500 text-white'
                    : booking.status === 'IN_PROGRESS'
                    ? 'bg-mechnik-500 text-white animate-spin'
                    : 'bg-charcoal-900 text-white'
                }`}
              >
                {booking.status === 'COMPLETED' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Wrench className="w-5 h-5 -rotate-45" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {booking.status === 'REQUESTED' && 'Waiting for Mechanic Acceptance'}
                  {booking.status === 'ACCEPTED' && 'Slot Confirmed by Mechanic'}
                  {booking.status === 'ASSIGNED' && 'Technician Assigned to Service Bay'}
                  {booking.status === 'IN_PROGRESS' && 'Mechanic is actively servicing your vehicle!'}
                  {booking.status === 'COMPLETED' && 'Servicing Finished & Vehicle Ready!'}
                  {booking.status === 'REJECTED' && 'Request was not accepted'}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {booking.status === 'REQUESTED' &&
                    'Switch to the Mechanic role above to accept this request and see the live update!'}
                  {booking.status === 'ACCEPTED' &&
                    'Mechanic will initiate servicing once the vehicle arrives in workshop.'}
                  {booking.status === 'IN_PROGRESS' &&
                    'Inspection, genuine parts replacement, and diagnostic tests are underway.'}
                  {booking.status === 'COMPLETED' &&
                    'All inspection tests passed. You can collect your vehicle.'}
                </p>
              </div>
            </div>

            {booking.status === 'COMPLETED' && (
              <button
                type="button"
                onClick={() => openReviewModal(booking)}
                className="btn-primary px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 shadow-mechnik-sm"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{booking.rating ? 'Edit Review' : 'Rate Mechanic'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Timeline Stepper */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Service Progress Timeline
          </h4>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {booking.timeline.map((step, idx) => {
              const isCompleted = step.completed;
              const isCurrent = step.current;

              return (
                <div key={idx} className="relative flex items-start gap-4">
                  <div
                    className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-mechnik-500 text-white animate-pulse ring-orange-100'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-mechnik-600'
                            : isCompleted
                            ? 'text-slate-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </h5>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vehicle & Workshop Details Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Vehicle Info with Image */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Vehicle in Service
            </span>
            <div className="flex items-center gap-3">
              {booking.vehicle.imageUrl ? (
                <img
                  src={booking.vehicle.imageUrl}
                  alt={booking.vehicle.model}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-mechnik-600 flex items-center justify-center flex-shrink-0 font-bold">
                  <Car className="w-6 h-6" />
                </div>
              )}
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {booking.vehicle.make} {booking.vehicle.model}
                </h4>
                <p className="text-xs text-slate-500 font-mono">
                  {booking.vehicle.registrationNumber || 'Unregistered'}
                  {booking.vehicle.nickname && ` • "${booking.vehicle.nickname}"`}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[9px] font-bold uppercase">
                  {booking.vehicle.type}
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Workshop Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Assigned Workshop
            </span>
            <h4 className="text-sm font-bold text-slate-900 mt-1">{booking.mechanicName}</h4>
            <p className="text-xs text-slate-600 mt-0.5">{booking.mechanicAddress}</p>
            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={handleContactMechanic}
                className="btn-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 text-slate-700"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call {booking.mechanicPhone}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Doorstep Pickup Address Banner */}
        {(booking.serviceMode === 'doorstep' || booking.pickupAddress) && (
          <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-200 text-mechnik-800 text-[10px] font-bold uppercase tracking-wider">
                Doorstep Pickup Scheduled
              </span>
              {booking.pickupLocationMode && (
                <span className="text-[10px] text-slate-500 font-medium">
                  {booking.pickupLocationMode === 'auto' ? 'Auto-detected Location' : 'Custom Address'}
                </span>
              )}
            </div>
            <div className="flex items-start gap-2 text-slate-800 mt-1">
              <MapPin className="w-4 h-4 text-mechnik-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">{booking.pickupAddress || 'Address on file'}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  The mechanic will arrive at this address to collect your vehicle at the scheduled time slot.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reported Problem, Voice Note & Uploaded Images */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Customer Problem Statement
            </span>
            <p className="text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-100">
              "{booking.issueDescription}"
            </p>
          </div>

          {/* Voice note playback */}
          {booking.voiceNote && (
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-7 h-7 rounded-full bg-mechnik-500 text-white flex items-center justify-center shadow-sm"
                >
                  {isPlayingAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                </button>
                <div>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-mechnik-500" />
                    Voice Memo ({booking.voiceNote.duration || '0:06'})
                  </span>
                  {booking.voiceNote.transcript && (
                    <p className="text-[11px] text-slate-500 italic">"{booking.voiceNote.transcript}"</p>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">Audio Note</span>
            </div>
          )}

          {/* Problem photos gallery */}
          {booking.issueImages && booking.issueImages.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
                Attached Problem Photos ({booking.issueImages.length})
              </span>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {booking.issueImages.map((imgUrl, i) => (
                  <img
                    key={i}
                    src={imgUrl}
                    alt={`Attached problem ${i + 1}`}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <span className="text-slate-500">Estimated Service Cost:</span>
            <span className="text-sm font-extrabold text-mechnik-600 font-mono">
              {booking.status === 'COMPLETED' ? `₹${booking.actualCost || 650}` : booking.estimatedCost}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {booking.status !== 'COMPLETED' && booking.status !== 'REJECTED' && (
              <button
                type="button"
                onClick={handleCancel}
                className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel Booking</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setTrackingBookingId(null)}
            className="btn-secondary px-5 py-2 text-xs font-semibold"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </Modal>
  );
};
