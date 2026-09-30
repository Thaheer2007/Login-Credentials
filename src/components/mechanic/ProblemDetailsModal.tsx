import React, { useState } from 'react';
import { Booking } from '../../types/mechnik';
import { Modal } from '../common/Modal';
import {
  Car,
  Bike,
  Truck,
  Tractor,
  Wrench,
  Clock,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  Volume2,
  MapPin,
  Phone,
  Calendar,
  Image as ImageIcon,
  Tag,
  ShieldCheck,
  X,
  Maximize2
} from 'lucide-react';

interface ProblemDetailsModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept?: (bookingId: string) => void;
  onReject?: (bookingId: string) => void;
  onStartService?: (bookingId: string) => void;
  onCompleteService?: (bookingId: string) => void;
}

export const ProblemDetailsModal: React.FC<ProblemDetailsModalProps> = ({
  booking,
  isOpen,
  onClose,
  onAccept,
  onReject,
  onStartService,
  onCompleteService
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (!isOpen || !booking) return null;

  const getVehicleIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'bike':
      case 'motorcycle':
        return Bike;
      case 'truck':
        return Truck;
      case 'tractor':
        return Tractor;
      default:
        return Car;
    }
  };

  const VehicleIcon = getVehicleIcon(booking.vehicle.type);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="2xl"
        title={
          <div className="flex items-center gap-2">
            <span>Problem Details • #{booking.id}</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                booking.status === 'COMPLETED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : booking.status === 'IN_PROGRESS'
                  ? 'bg-orange-100 text-orange-800 animate-pulse'
                  : booking.status === 'ACCEPTED'
                  ? 'bg-sky-100 text-sky-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {booking.status === 'IN_PROGRESS' ? '⚙️ In Bay' : booking.status}
            </span>
          </div>
        }
        subtitle={`${booking.vehicle.make} ${booking.vehicle.model} • ${booking.serviceName}`}
      >
        <div className="space-y-5">
          {/* Customer & Schedule Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Customer Information
              </span>
              <p className="text-sm font-bold text-slate-900">{booking.customerName}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <a
                  href={`tel:${booking.customerPhone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-colors font-mono"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{booking.customerPhone}</span>
                </a>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Scheduled Appointment
              </span>
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-mechnik-600" />
                <span>{booking.date}</span>
              </p>
              <p className="font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                <Clock className="w-3.5 h-3.5 text-mechnik-600" />
                <span>Slot: {booking.timeSlot}</span>
              </p>
            </div>
          </div>

          {/* Service Delivery Mode & Doorstep Address */}
          <div className={`p-4 rounded-2xl border text-xs ${
            booking.serviceMode === 'doorstep' || booking.pickupAddress
              ? 'bg-orange-50/70 border-orange-200'
              : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Service Delivery Mode
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                booking.serviceMode === 'doorstep' || booking.pickupAddress
                  ? 'bg-orange-200 text-mechnik-900'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {booking.serviceMode === 'doorstep' || booking.pickupAddress
                  ? '🚗 Doorstep Pickup'
                  : '🏢 Drop at Workshop'}
              </span>
            </div>

            {booking.serviceMode === 'doorstep' || booking.pickupAddress ? (
              <div className="space-y-1 bg-white p-3 rounded-xl border border-orange-200">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-mechnik-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-mechnik-700 uppercase block">
                      Customer Pickup Location:
                    </span>
                    <p className="text-xs font-bold text-slate-900">
                      {booking.pickupAddress || 'Address on file with customer'}
                    </p>
                    {booking.pickupLocationMode && (
                      <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                        Mode: {booking.pickupLocationMode === 'auto' ? 'Auto-detected GPS location' : 'Entered by customer'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-600">
                Customer will bring their vehicle directly to your workshop facility ({booking.mechanicAddress}).
              </p>
            )}
          </div>

          {/* Vehicle Information */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Vehicle in Ticket
            </span>
            <div className="flex items-center gap-3">
              {booking.vehicle.imageUrl ? (
                <img
                  src={booking.vehicle.imageUrl}
                  alt={booking.vehicle.model}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-orange-100 text-mechnik-600 flex items-center justify-center flex-shrink-0">
                  <VehicleIcon className="w-7 h-7" />
                </div>
              )}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    {booking.vehicle.make} {booking.vehicle.model}
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                    {booking.vehicle.type}
                  </span>
                </div>
                <p className="text-slate-500 font-mono text-xs">
                  Reg No: <strong className="text-slate-800">{booking.vehicle.registrationNumber || 'Unregistered'}</strong>
                  {booking.vehicle.nickname && ` • "${booking.vehicle.nickname}"`}
                </p>
                <p className="text-[11px] text-mechnik-600 font-semibold">
                  Requested: {booking.serviceName}
                </p>
              </div>
            </div>
          </div>

          {/* Full Problem Statement */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Full Customer Problem Description
              </span>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-800 font-medium whitespace-pre-wrap leading-relaxed">
                {booking.issueDescription ? `"${booking.issueDescription}"` : 'No written description provided.'}
              </div>
            </div>

            {/* Quick Issue Tags */}
            {((booking.issueTags && booking.issueTags.length > 0) ||
              (booking.issueDescription &&
                [
                  'Brake squeaking / noise',
                  'Spongy brake pedal/lever',
                  'Engine knocking sound',
                  'Oil or fluid leakage',
                  'Starting / ignition trouble',
                  'Vibration at high speed',
                  'AC not cooling properly',
                  'Battery low / jumpstart needed'
                ].some((t) => booking.issueDescription.toLowerCase().includes(t.toLowerCase())))) && (
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-mechnik-600" />
                  <span>Reported Symptom Tags:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    booking.issueTags ||
                    [
                      'Brake squeaking / noise',
                      'Spongy brake pedal/lever',
                      'Engine knocking sound',
                      'Oil or fluid leakage',
                      'Starting / ignition trouble',
                      'Vibration at high speed',
                      'AC not cooling properly',
                      'Battery low / jumpstart needed'
                    ].filter((t) => booking.issueDescription.toLowerCase().includes(t.toLowerCase()))
                  ).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-orange-100 text-mechnik-800 text-[11px] font-semibold border border-orange-200"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Voice Memo Player */}
            {booking.voiceNote && (
              <div className="p-3 bg-white rounded-xl border border-orange-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-8 h-8 rounded-full bg-mechnik-500 text-white flex items-center justify-center shadow-sm hover:bg-mechnik-600 transition-colors"
                      title={isPlayingAudio ? 'Pause' : 'Play customer recording'}
                    >
                      {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>
                    <div>
                      <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4 text-mechnik-600" />
                        <span>Voice Recording Audio Note</span>
                      </h5>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Duration: {booking.voiceNote.duration || '0:06'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-mechnik-600 uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded">
                    {isPlayingAudio ? '▶ Playing Audio' : 'Audio Attached'}
                  </span>
                </div>

                {/* Animated Waveform */}
                {isPlayingAudio && (
                  <div className="flex items-center gap-1 justify-center py-2 bg-orange-50/50 rounded-lg">
                    {[35, 65, 90, 45, 100, 55, 80, 40, 75, 90, 60, 30].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-mechnik-500 rounded-full animate-pulse"
                        style={{ height: `${h}%`, minHeight: '10px' }}
                      />
                    ))}
                    <span className="text-[10px] text-mechnik-600 font-mono ml-2 font-bold">
                      Listening to customer sound...
                    </span>
                  </div>
                )}

                {booking.voiceNote.transcript && (
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 italic">
                    <span className="font-bold text-slate-700 not-italic block mb-0.5">Transcript:</span>
                    "{booking.voiceNote.transcript}"
                  </div>
                )}
              </div>
            )}

            {/* Problem Images Gallery with Full-Size Modal Preview */}
            {booking.issueImages && booking.issueImages.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-mechnik-600" />
                    <span>Uploaded Problem Photos ({booking.issueImages.length})</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Click photo to view full size</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {booking.issueImages.map((imgUrl, i) => (
                    <div
                      key={i}
                      onClick={() => setLightboxImage(imgUrl)}
                      className="group relative rounded-xl overflow-hidden border border-slate-200 cursor-pointer aspect-square bg-slate-100 hover:ring-2 hover:ring-mechnik-500 transition-all shadow-sm"
                    >
                      <img
                        src={imgUrl}
                        alt={`Problem damage ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-charcoal-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                        <Maximize2 className="w-5 h-5 drop-shadow" />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-charcoal-900/80 text-white text-[9px] px-1 rounded">
                        #{i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Estimated / Quoted Amount */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-slate-500">Service Ticket Estimate:</span>
              <span className="text-sm font-extrabold text-charcoal-900 font-mono">
                {booking.estimatedCost}
              </span>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-4 py-2.5 text-xs font-semibold"
            >
              Close Details
            </button>

            <div className="flex items-center gap-2">
              {booking.status === 'REQUESTED' && (
                <>
                  {onReject && (
                    <button
                      type="button"
                      onClick={() => {
                        onReject(booking.id);
                        onClose();
                      }}
                      className="px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>REJECT</span>
                    </button>
                  )}
                  {onAccept && (
                    <button
                      type="button"
                      onClick={() => {
                        onAccept(booking.id);
                        onClose();
                      }}
                      className="btn-primary px-6 py-2.5 text-xs font-bold shadow-mechnik flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ACCEPT REQUEST</span>
                    </button>
                  )}
                </>
              )}

              {(booking.status === 'ACCEPTED' || booking.status === 'ASSIGNED') && onStartService && (
                <button
                  type="button"
                  onClick={() => {
                    onStartService(booking.id);
                    onClose();
                  }}
                  className="btn-primary px-6 py-2.5 text-xs font-bold shadow-mechnik-sm flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>START SERVICE IN BAY</span>
                </button>
              )}

              {booking.status === 'IN_PROGRESS' && onCompleteService && (
                <button
                  type="button"
                  onClick={() => {
                    onCompleteService(booking.id);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>MARK AS COMPLETED</span>
                </button>
              )}

              {booking.status === 'COMPLETED' && (
                <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Service Completed & Invoiced</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Full-Size Photo Lightbox Preview */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] bg-charcoal-900/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 bg-charcoal-900/80 hover:bg-charcoal-900 text-white rounded-full p-2 shadow-lg transition-transform active:scale-95"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage}
              alt="Full size problem inspection"
              className="w-full max-h-[82vh] object-contain rounded-xl"
            />
            <div className="p-3 text-center text-xs text-slate-500 font-semibold">
              Vehicle Inspection Photo • Problem Diagnosis Ticket #{booking.id}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
