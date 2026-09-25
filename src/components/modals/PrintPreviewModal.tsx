import React from 'react';
import { useTrip } from '../../context/TripContext';
import { formatPrice } from '../../services/mcpClient';
import { X, Printer } from 'lucide-react';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({ isOpen, onClose }) => {
  const { 
    selectedDestination, 
    selectedFlight, 
    bookingState, 
    itineraryDays, 
    preferences, 
    budgetBreakdown 
  } = useTrip();

  if (!isOpen || !selectedDestination) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Controls Bar */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Print-Ready Travel Itinerary & Voucher Dossier
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body with localized scroll */}
        <div className="p-8 overflow-y-auto space-y-6 text-xs leading-relaxed font-sans">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <div className="text-[10px] font-mono tracking-widest uppercase text-slate-500">
                VENTUREFLOW MASTER TRAVEL ITINERARY
              </div>
              <h1 className="text-2xl font-bold font-display text-slate-950 mt-1">
                {selectedDestination.name}
              </h1>
              <div className="text-slate-600 mt-0.5">
                {preferences.partySize} {preferences.partySize === 1 ? 'Traveler' : 'Travelers'} · {preferences.durationDays} Days · Origin: {preferences.originCity}
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-[10px] text-slate-400">TOTAL COMMITTED</div>
              <div className="text-lg font-bold text-slate-900">
                {formatPrice(budgetBreakdown.totalCommitted, preferences.currency)}
              </div>
            </div>
          </div>

          {/* Flights & Lodging */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded p-3 bg-slate-50">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-1">
                Flight Schedule
              </div>
              {selectedFlight ? (
                <div>
                  <div className="font-semibold text-slate-900">{selectedFlight.airline} ({selectedFlight.flightNumber})</div>
                  <div className="text-slate-600 font-mono text-[11px] mt-0.5">
                    {selectedFlight.departureTime} ({selectedFlight.departureAirport}) → {selectedFlight.arrivalTime} ({selectedFlight.arrivalAirport})
                  </div>
                  <div className="text-slate-500 text-[10px] mt-1">
                    Duration: {selectedFlight.duration} · {selectedFlight.stops === 0 ? 'Nonstop' : '1 Stop'}
                  </div>
                </div>
              ) : (
                <div className="text-slate-400">Flight unconfirmed</div>
              )}
            </div>

            <div className="border border-slate-200 rounded p-3 bg-slate-50">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-1">
                Confirmed Accommodation
              </div>
              {bookingState.hotel ? (
                <div>
                  <div className="font-semibold text-slate-900">{bookingState.hotel.name}</div>
                  <div className="text-slate-600 text-[11px] mt-0.5">
                    {bookingState.hotel.neighborhood} · {bookingState.hotel.totalNights} Nights
                  </div>
                  <div className="text-emerald-700 font-mono text-[10px] mt-1 font-semibold">
                    REF: {bookingState.hotel.confirmationCode || 'HTL-RES-001'}
                  </div>
                </div>
              ) : (
                <div className="text-slate-400">No hotel booked yet</div>
              )}
            </div>
          </div>

          {/* Daily Schedule Breakdown */}
          <div className="space-y-4">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1">
              Consolidated Itinerary Schedule
            </div>
            {itineraryDays.map((day) => (
              <div key={day.dayNumber} className="border-l-2 border-slate-300 pl-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900">
                    Day {day.dayNumber} · {day.title}
                  </div>
                  <div className="font-mono text-slate-500 text-[10px]">
                    {day.forecast.tempC}°C · {day.isRainContingencyActive ? 'Indoor Rain Plan' : 'Sunny Plan'}
                  </div>
                </div>
                <div className="space-y-1">
                  {day.activities.map((act) => (
                    <div key={act.id} className="flex items-start justify-between text-[11px]">
                      <div>
                        <span className="font-mono text-slate-500 mr-2">{act.timeSlot}:</span>
                        <span className="font-medium text-slate-800">{act.title}</span>
                        <span className="text-slate-500 ml-1">({act.location})</span>
                      </div>
                      <div className="font-mono text-slate-600">
                        {formatPrice(act.cost, preferences.currency)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Voucher Records */}
          {bookingState.bookingHistory.length > 0 && (
            <div className="pt-3 border-t border-slate-200">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-2">
                Stored Verification Reference Codes
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                {bookingState.bookingHistory.map((b) => (
                  <div key={b.bookingId} className="p-2 border border-slate-200 rounded flex justify-between bg-slate-50">
                    <span className="text-slate-700 font-semibold">{b.itemName}</span>
                    <span className="text-cyan-700 font-bold">{b.referenceCode}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
