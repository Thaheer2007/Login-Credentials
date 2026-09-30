import React from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useMechnik();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderClass = 'border-l-4 border-emerald-500 bg-white text-slate-800 shadow-xl';
        let iconClass = 'text-emerald-500';

        if (toast.type === 'error') {
          Icon = XCircle;
          borderClass = 'border-l-4 border-red-500 bg-white text-slate-800 shadow-xl';
          iconClass = 'text-red-500';
        } else if (toast.type === 'warning') {
          Icon = AlertCircle;
          borderClass = 'border-l-4 border-amber-500 bg-white text-slate-800 shadow-xl';
          iconClass = 'text-amber-500';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-l-4 border-mechnik-500 bg-white text-slate-800 shadow-xl';
          iconClass = 'text-mechnik-500';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border border-slate-100 ${borderClass} transition-all duration-300 animate-in slide-in-from-right-8`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconClass}`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 leading-tight">{toast.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
