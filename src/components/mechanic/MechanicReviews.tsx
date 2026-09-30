import React from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { RatingStars } from '../common/RatingStars';
import { Star, MessageSquare, ShieldCheck, CheckCircle2, ThumbsUp, Calendar } from 'lucide-react';

export const MechanicReviews: React.FC = () => {
  const { mechanics, bookings } = useMechnik();
  const currentMechanic = mechanics[0]; // Active mechanic persona (Ravi Auto Care)

  // Collect reviews from mechanic's profile plus completed rated bookings
  const reviews = currentMechanic?.reviews || [];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-charcoal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-soft-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] font-bold uppercase tracking-wider">
              Customer Feedback & Ratings
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Customer Reviews & Reputation
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
            Real feedback from verified vehicle owners serviced at {currentMechanic?.shopName}.
          </p>
        </div>

        {/* Rating Score Card */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center sm:text-right">
          <div className="flex items-center justify-center sm:justify-end gap-2">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            <span className="text-3xl font-black text-white">{currentMechanic?.rating.toFixed(1)}</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">Based on {currentMechanic?.totalReviews} verified services</p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-mechnik-500" />
          <span>Recent Customer Testimonials ({reviews.length})</span>
        </h3>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
            No customer reviews posted yet. Completed jobs with ratings will appear here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-xs">
                        {rev.authorName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{rev.authorName}</h4>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {rev.date}
                        </span>
                      </div>
                    </div>
                    <RatingStars rating={rev.rating} size="sm" />
                  </div>

                  <p className="text-xs text-slate-700 mt-3 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-500">Service: {rev.serviceName}</span>
                  {rev.verifiedBooking && (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified Customer
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
