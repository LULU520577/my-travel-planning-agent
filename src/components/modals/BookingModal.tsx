import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { formatPrice } from '../../services/mcpClient';
import { X, ShieldCheck, CheckCircle2, QrCode, CreditCard, Lock, Sparkles } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingTarget: {
    type: 'flight' | 'hotel' | 'transit' | 'ticket';
    item: any;
  } | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, bookingTarget }) => {
  const { bookItem, preferences } = useTrip();

  const [travelerName, setTravelerName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@ventureflow.io');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{ referenceCode: string } | null>(null);

  if (!isOpen || !bookingTarget) return null;

  const { type, item } = bookingTarget;
  const title = item.name || item.title || `${item.airline} ${item.flightNumber}`;
  const amount = item.totalPrice || item.pricePerPerson || 0;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const result = await bookItem({ type, item });
      setConfirmedBooking(result);
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white font-display">
              {confirmedBooking ? 'Reservation Voucher Confirmed' : `Secure Booking · ${type.toUpperCase()}`}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {confirmedBooking ? (
          /* Confirmation Success Voucher State */
          <div className="p-6 space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-white font-display">Booking Guaranteed</h4>
              <p className="text-xs text-slate-400">
                Official voucher issued via Smithery AI Hospitality & Ticketing Service
              </p>
            </div>

            {/* Simulated QR & Voucher Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-left space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[11px] text-slate-400">CONFIRMATION REF</span>
                <span className="text-sm font-bold text-cyan-400 tracking-wider">
                  {confirmedBooking.referenceCode}
                </span>
              </div>

              <div className="text-xs space-y-1">
                <div className="text-slate-300 font-sans font-semibold">{title}</div>
                <div className="text-slate-400 text-[11px]">Primary: {travelerName}</div>
                <div className="text-slate-400 text-[11px]">
                  Total Charged: <span className="text-white font-bold">{formatPrice(amount, preferences.currency)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified & Synced to Master Summary</span>
                </div>
                <span>Status: Confirmed</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Done & Return to Logistics
            </button>
          </div>
        ) : (
          /* Checkout Form State */
          <form onSubmit={handleConfirm} className="p-6 space-y-4 text-xs">
            {/* Item Summary Card */}
            <div className="p-3 bg-slate-950/80 rounded border border-slate-800 flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-cyan-400 font-semibold">{type}</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{title}</h4>
                {item.neighborhood && <p className="text-slate-400 text-[11px] mt-0.5">{item.neighborhood}</p>}
                {item.coverage && <p className="text-slate-400 text-[11px] mt-0.5">{item.coverage}</p>}
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] text-slate-400 uppercase">Total Rate</div>
                <div className="text-sm font-mono font-bold text-cyan-300">
                  {formatPrice(amount, preferences.currency)}
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Primary Traveler Name</label>
                <input
                  type="text"
                  required
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">Confirmation Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <span className="text-slate-300 font-medium block mb-1.5">Payment Method</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'card', label: 'Credit Card', icon: CreditCard },
                  { id: 'apple_pay', label: 'Apple Pay', icon: Sparkles },
                  { id: 'google_pay', label: 'Google Pay', icon: Lock },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`py-2 px-2.5 rounded border text-center transition-colors flex flex-col items-center gap-1 ${
                      paymentMethod === pm.id
                        ? 'bg-slate-800 border-cyan-500/80 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[11px] font-medium">{pm.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Simulated 256-bit SSL tokenization. Live vouchers are synced directly into your master trip ledger and can be revoked at any time.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Issuing Voucher...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Pay {formatPrice(amount, preferences.currency)}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
