import React, { useState } from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { RatingStars } from '../common/RatingStars';
import {
  Bike,
  Wrench,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Star,
  FileText,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const MyBookings: React.FC = () => {
  const { bookings, setTrackingBookingId, openReviewModal, setActiveTab } = useMechnik();
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'upcoming' | 'active' | 'completed' | 'cancelled'>('all');

  const filteredBookings = bookings.filter((b) => {
    if (activeSubTab === 'all') return true;
    if (activeSubTab === 'upcoming') return b.status === 'REQUESTED' || b.status === 'ACCEPTED';
    if (activeSubTab === 'active') return b.status === 'IN_PROGRESS' || b.status === 'ASSIGNED';
    if (activeSubTab === 'completed') return b.status === 'COMPLETED';
    if (activeSubTab === 'cancelled') return b.status === 'CANCELLED' || b.status === 'REJECTED';
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
          <p className="text-xs text-slate-500">Track current service appointments and view completed service records</p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('find-mechanic')}
          className="btn-primary px-4 py-2.5 text-xs font-bold self-start sm:self-auto shadow-mechnik-sm"
        >
          + Book New Service
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'all', label: `All (${bookings.length})` },
          {
            id: 'upcoming',
            label: `Upcoming (${bookings.filter((b) => b.status === 'REQUESTED' || b.status === 'ACCEPTED').length})`
          },
          {
            id: 'active',
            label: `In Progress (${bookings.filter((b) => b.status === 'IN_PROGRESS' || b.status === 'ASSIGNED').length})`
          },
          {
            id: 'completed',
            label: `Completed (${bookings.filter((b) => b.status === 'COMPLETED').length})`
          },
          {
            id: 'cancelled',
            label: `Cancelled (${bookings.filter((b) => b.status === 'CANCELLED' || b.status === 'REJECTED').length})`
          }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeSubTab === tab.id
                ? 'bg-mechnik-500 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Bike className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Bookings in this Category</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You do not have any services matching this status tab.
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 p-5 shadow-soft transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-mechnik-500 flex items-center justify-center font-bold flex-shrink-0">
                    <Wrench className="w-5 h-5 -rotate-45" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-mechnik-600">
                        #{booking.id}
                      </span>
                      <span className="text-slate-400">•</span>
                      <h3 className="text-sm font-bold text-slate-900">{booking.serviceName}</h3>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Workshop: <strong>{booking.mechanicName}</strong> ({booking.mechanicAddress})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      booking.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : booking.status === 'IN_PROGRESS'
                        ? 'bg-orange-100 text-orange-800 animate-pulse'
                        : booking.status === 'ACCEPTED'
                        ? 'bg-sky-100 text-sky-800'
                        : booking.status === 'REQUESTED'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>

              {/* Details Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Vehicle</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {booking.vehicle.imageUrl && (
                      <img
                        src={booking.vehicle.imageUrl}
                        alt={booking.vehicle.model}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                      />
                    )}
                    <div>
                      <span className="font-bold text-slate-800 block">
                        {booking.vehicle.make} {booking.vehicle.model}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        {booking.vehicle.registrationNumber || 'Unregistered'}
                        {booking.vehicle.nickname && ` • "${booking.vehicle.nickname}"`}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Schedule</span>
                  <span className="font-bold text-slate-800">{booking.date}</span>
                  <span className="text-[10px] text-slate-500 block">{booking.timeSlot}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Mode</span>
                  <span className="font-bold text-slate-800 capitalize">
                    {booking.serviceMode === 'doorstep' ? 'Doorstep Pickup' : 'Workshop Drop'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Amount</span>
                  <span className="font-extrabold text-charcoal-900 font-mono text-sm">
                    {booking.status === 'COMPLETED' ? `₹${booking.actualCost || 650}` : booking.estimatedCost}
                  </span>
                </div>
              </div>

              {/* Rating if completed and rated */}
              {booking.rating && (
                <div className="py-2.5 px-3 bg-slate-50 rounded-xl text-xs flex items-center justify-between border border-slate-100 my-1">
                  <div className="flex items-center gap-2">
                    <RatingStars rating={booking.rating} size="sm" />
                    <span className="text-slate-600 italic">"{booking.reviewComment}"</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Reviewed ✓</span>
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {booking.status === 'REQUESTED' && 'Waiting for mechanic to accept'}
                  {booking.status === 'ACCEPTED' && 'Slot confirmed. Mechanic ready for bike'}
                  {booking.status === 'IN_PROGRESS' && 'Mechanic is actively servicing your bike'}
                  {booking.status === 'COMPLETED' && 'Servicing completed'}
                </span>

                <div className="flex items-center gap-2">
                  {booking.status === 'COMPLETED' && (
                    <button
                      type="button"
                      onClick={() => openReviewModal(booking)}
                      className="btn-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1 text-amber-600 hover:text-amber-700"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{booking.rating ? 'Edit Review' : 'Rate Mechanic'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setTrackingBookingId(booking.id)}
                    className="btn-primary px-4 py-1.5 text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>Track Status</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
