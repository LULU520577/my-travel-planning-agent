import React from 'react';
import { useTrip } from '../../context/TripContext';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toastMessage } = useTrip();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="bg-slate-900 border border-cyan-500/60 text-white shadow-xl rounded-lg px-4 py-2.5 flex items-center gap-2.5 max-w-md pointer-events-auto">
        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
        <span className="text-xs font-medium text-slate-200">{toastMessage}</span>
      </div>
    </div>
  );
};
