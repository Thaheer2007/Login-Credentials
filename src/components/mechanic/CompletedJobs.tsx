import React from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { RatingStars } from '../common/RatingStars';
import { CheckCircle2, Bike, Calendar } from 'lucide-react';

export const CompletedJobs: React.FC = () => {
  const { bookings } = useMechnik();
  const completedJobs = bookings.filter((b) => b.status === 'COMPLETED');

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Completed Jobs History</h1>
        <p className="text-xs text-slate-500">Delivered vehicles, customer reviews and settled earnings</p>
      </div>

      <div className="space-y-4">
        {completedJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    #{job.id} • {job.serviceName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Customer: <strong>{job.customerName}</strong> ({job.customerPhone})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-extrabold text-emerald-600 font-mono">
                  +₹{job.actualCost || 650}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                  Delivered
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Vehicle</span>
                <span className="font-bold text-slate-800">{job.vehicle.make} {job.vehicle.model}</span>
                <span className="text-[10px] text-slate-500 font-mono block">{job.vehicle.registrationNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Completed On</span>
                <span className="font-semibold text-slate-800">{job.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Customer Feedback</span>
                {job.rating ? (
                  <div className="flex items-center gap-1 mt-0.5">
                    <RatingStars rating={job.rating} size="sm" />
                    <span className="text-slate-600 italic">"{job.reviewComment || 'Great work!'}"</span>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">No review submitted yet</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
