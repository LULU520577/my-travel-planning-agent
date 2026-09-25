import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { formatPrice } from '../../services/mcpClient';
import { PrintPreviewModal } from '../modals/PrintPreviewModal';
import { 
  FileCheck, 
  Plane, 
  Building, 
  Train, 
  Ticket, 
  Share2, 
  Printer, 
  Download, 
  CheckCircle2, 
  Coins, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Copy, 
  Sparkles,
  QrCode,
  AlertCircle
} from 'lucide-react';

export const SummaryTab: React.FC = () => {
  const { 
    selectedDestination, 
    selectedFlight, 
    bookingState, 
    itineraryDays, 
    preferences, 
    budgetBreakdown, 
    showToast,
    setActiveTab 
  } = useTrip();

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedDestination) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-950 text-center">
        <div className="max-w-md space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-cyan-400">
            <FileCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white font-display">No Trip Configured Yet</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Please start at Step 1 to discover destinations and assemble your dynamic trip itinerary.
          </p>
          <button
            onClick={() => setActiveTab('discovery')}
            className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
          >
            <span>Start Planning</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  const handleCopyShareLink = () => {
    try {
      const shareData = {
        dest: selectedDestination.id,
        flight: selectedFlight?.id,
        curr: preferences.currency,
        budget: preferences.totalBudget,
        party: preferences.partySize,
        days: preferences.durationDays
      };
      const encoded = btoa(JSON.stringify(shareData));
      const url = `${window.location.origin}/#trip=${encoded}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      showToast('Shareable trip link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (e) {
      showToast('Share link generated and ready to share!');
    }
  };

  const handleDownloadSummary = () => {
    const tripSummaryText = `========================================================================
VENTUREFLOW MASTER TRAVEL ITINERARY & VOUCHER DOSSIER
========================================================================
Destination: ${selectedDestination.name} (${selectedDestination.city}, ${selectedDestination.country})
Origin Gateway: ${preferences.originCity}
Party Size: ${preferences.partySize} travelers (${preferences.adultsCount ?? 2} Adults, ${preferences.kidsCount ?? 0} Kids)
Duration: ${preferences.durationDays} days
Currency: ${preferences.currency}
Total Allocated Budget: ${preferences.totalBudget} ${preferences.currency}
Total Committed Spend: ${budgetBreakdown.totalCommitted} ${preferences.currency}
Remaining Balance: ${budgetBreakdown.remainingBalance} ${preferences.currency}

------------------------------------------------------------------------
CONFIRMED FLIGHTS
------------------------------------------------------------------------
${selectedFlight ? `Airline: ${selectedFlight.airline} (${selectedFlight.flightNumber})
Route: ${selectedFlight.departureAirport} -> ${selectedFlight.arrivalAirport}
Departure: ${selectedFlight.departureTime} | Arrival: ${selectedFlight.arrivalTime}
Duration: ${selectedFlight.duration} (${selectedFlight.stops === 0 ? 'Nonstop' : '1 Stop'})
Cabin: ${selectedFlight.cabinClass} | Price: ${selectedFlight.totalPrice} ${preferences.currency}` : 'No flight confirmed'}

------------------------------------------------------------------------
CONFIRMED ACCOMMODATION
------------------------------------------------------------------------
${bookingState.hotel ? `Property: ${bookingState.hotel.name} (${bookingState.hotel.type})
Neighborhood: ${bookingState.hotel.neighborhood}
Total Nights: ${bookingState.hotel.totalNights} | Total: ${bookingState.hotel.totalPrice} ${preferences.currency}
Booking Reference: ${bookingState.hotel.confirmationCode || 'HTL-RES-001'}` : 'No accommodation booked'}

------------------------------------------------------------------------
TRANSIT & PASSES
------------------------------------------------------------------------
${bookingState.transitPasses.length > 0 ? bookingState.transitPasses.map((t) => `- ${t.name} (Ref: ${t.confirmationCode}) - ${t.totalPrice} ${preferences.currency}`).join('\n') : 'None'}

------------------------------------------------------------------------
ATTRACTION PASSES
------------------------------------------------------------------------
${bookingState.attractionTickets.length > 0 ? bookingState.attractionTickets.map((t) => `- ${t.title} (${t.entryType}) (Ref: ${t.confirmationCode}) - ${t.totalPrice} ${preferences.currency}`).join('\n') : 'None'}

------------------------------------------------------------------------
DAY-BY-DAY ITINERARY TIMELINE
------------------------------------------------------------------------
${itineraryDays.map((d) => `
[Day ${d.dayNumber}] ${d.title} (${d.isRainContingencyActive ? 'Indoor Rain Contingency' : 'Sunny Plan'})
${d.activities.map((a) => `  * ${a.timeSlot}: ${a.title} (${a.location}) - Cost: ${a.cost} ${preferences.currency}`).join('\n')}
`).join('\n')}

========================================================================
Generated via VentureFlow Travel Studio (Smithery AI MCP Gateway)
========================================================================
`;

    const blob = new Blob([tripSummaryText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VentureFlow_${selectedDestination.city.replace(/\s+/g, '_')}_Itinerary.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Itinerary file downloaded to your device!');
  };

  const percentageSpent = Math.min(100, Math.round((budgetBreakdown.totalCommitted / preferences.totalBudget) * 100));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
      {/* Sub-header Action Bar */}
      <div className="h-12 px-6 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between shrink-0 gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-cyan-400 uppercase tracking-wider">Step 5</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-white font-medium">Trip Summary & Multi-Format Sharing</span>
        </div>

        {/* Export & Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyShareLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copiedLink ? 'Link Copied!' : 'Shareable Link'}</span>
          </button>

          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Print-Ready View</span>
          </button>

          <button
            onClick={handleDownloadSummary}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Summary</span>
          </button>
        </div>
      </div>

      {/* Main Master Summary View with localized vertical scroll */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Master Dossier Top Hero Banner */}
          <div className="rounded-lg border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="relative h-44 sm:h-52">
              <img
                src={selectedDestination.heroImage}
                alt={selectedDestination.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <span>
                      {preferences.partySize} {preferences.partySize === 1 ? 'Traveler' : 'Travelers'}
                      {preferences.kidsCount ? ` (${preferences.adultsCount ?? (preferences.partySize - preferences.kidsCount)} Adults, ${preferences.kidsCount} ${preferences.kidsCount === 1 ? 'Kid' : 'Kids'})` : ''}
                    </span>
                    <span>·</span>
                    <span>{preferences.durationDays} Days</span>
                    <span>·</span>
                    <span>Origin: {preferences.originCity}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1 drop-shadow-sm">
                    {selectedDestination.name}
                  </h1>
                </div>

                <div className="text-left sm:text-right font-mono bg-slate-950/80 backdrop-blur-xs p-3 rounded border border-slate-800 shrink-0">
                  <div className="text-[10px] uppercase text-slate-400">Committed Ledger Total</div>
                  <div className="text-xl font-bold text-cyan-300">
                    {formatPrice(budgetBreakdown.totalCommitted, preferences.currency)}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    of {formatPrice(budgetBreakdown.allocatedBudget, preferences.currency)} Allocated
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Ledger & Budget Utilization Progress Bar */}
          <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Coins className="w-4 h-4 text-cyan-400" />
                  <span>Master Financial Ledger</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time budget tracking normalized in {preferences.currency}.
                </p>
              </div>

              <div className={`text-xs font-mono font-semibold px-2.5 py-1 rounded border ${
                budgetBreakdown.isOverBudget 
                  ? 'bg-rose-950/70 border-rose-600/50 text-rose-300' 
                  : 'bg-emerald-950/70 border-emerald-600/50 text-emerald-300'
              }`}>
                {budgetBreakdown.isOverBudget 
                  ? `Over Budget by ${formatPrice(Math.abs(budgetBreakdown.remainingBalance), preferences.currency)}`
                  : `${formatPrice(budgetBreakdown.remainingBalance, preferences.currency)} Remaining Surplus`}
              </div>
            </div>

            {/* Budget Meter Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
                <div
                  style={{ width: `${Math.min(100, (budgetBreakdown.committedFlights / preferences.totalBudget) * 100)}%` }}
                  className="bg-indigo-500 h-full"
                  title="Flights"
                />
                <div
                  style={{ width: `${Math.min(100, (budgetBreakdown.committedHotels / preferences.totalBudget) * 100)}%` }}
                  className="bg-cyan-500 h-full"
                  title="Hotels"
                />
                <div
                  style={{ width: `${Math.min(100, (budgetBreakdown.committedTransit / preferences.totalBudget) * 100)}%` }}
                  className="bg-emerald-500 h-full"
                  title="Transit"
                />
                <div
                  style={{ width: `${Math.min(100, (budgetBreakdown.committedTickets / preferences.totalBudget) * 100)}%` }}
                  className="bg-amber-500 h-full"
                  title="Tickets"
                />
                <div
                  style={{ width: `${Math.min(100, (budgetBreakdown.committedActivities / preferences.totalBudget) * 100)}%` }}
                  className="bg-purple-500 h-full"
                  title="Activities"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Flights: {formatPrice(budgetBreakdown.committedFlights, preferences.currency)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span>Lodging: {formatPrice(budgetBreakdown.committedHotels, preferences.currency)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Transit: {formatPrice(budgetBreakdown.committedTransit, preferences.currency)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Tickets: {formatPrice(budgetBreakdown.committedTickets, preferences.currency)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Activities: {formatPrice(budgetBreakdown.committedActivities, preferences.currency)}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Master 2-Column Grid: Confirmed Bookings vs Itinerary Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Booked Logistics Dossier */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Confirmed Reservations & Vouchers</span>
              </h3>

              {/* Flight Confirmation Card */}
              {selectedFlight ? (
                <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-cyan-400 font-semibold uppercase flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5" />
                      <span>Confirmed Flight</span>
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {formatPrice(selectedFlight.totalPrice, preferences.currency)}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white font-display">
                    {selectedFlight.airline} · {selectedFlight.flightNumber}
                  </h4>

                  <div className="text-xs font-mono text-slate-300">
                    {selectedFlight.departureTime} ({selectedFlight.departureAirport}) → {selectedFlight.arrivalTime} ({selectedFlight.arrivalAirport})
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Cabin: {selectedFlight.cabinClass}</span>
                    <span>Aircraft: {selectedFlight.aircraft}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg border border-dashed border-slate-800 text-xs text-slate-500 text-center">
                  No flight locked in yet.
                </div>
              )}

              {/* Hotel Confirmation Card */}
              {bookingState.hotel ? (
                <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-cyan-400 font-semibold uppercase flex items-center gap-1">
                      <Building className="w-3.5 h-3.5" />
                      <span>Confirmed Lodging</span>
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {formatPrice(bookingState.hotel.totalPrice, preferences.currency)}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white font-display">
                    {bookingState.hotel.name}
                  </h4>

                  <div className="text-xs text-slate-300">
                    {bookingState.hotel.neighborhood} · {bookingState.hotel.totalNights} Nights
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="text-emerald-400">REF: {bookingState.hotel.confirmationCode || 'HTL-CONF-092'}</span>
                    <span>Free cancel: {bookingState.hotel.freeCancellationUntil}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg border border-dashed border-slate-800 text-xs text-slate-500 text-center">
                  No accommodation booked yet. (Select in Step 4)
                </div>
              )}

              {/* Transit Passes & Tickets List */}
              {(bookingState.transitPasses.length > 0 || bookingState.attractionTickets.length > 0) && (
                <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/80 space-y-3">
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold uppercase">
                    Transit & Experience Passes
                  </span>
                  <div className="space-y-2">
                    {bookingState.transitPasses.map((t) => (
                      <div key={t.id} className="flex items-center justify-between text-xs border-b border-slate-800/60 pb-1.5">
                        <div>
                          <div className="font-semibold text-white">{t.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">REF: {t.confirmationCode}</div>
                        </div>
                        <div className="font-mono text-cyan-300 font-semibold">
                          {formatPrice(t.totalPrice, preferences.currency)}
                        </div>
                      </div>
                    ))}
                    {bookingState.attractionTickets.map((t) => (
                      <div key={t.id} className="flex items-center justify-between text-xs border-b border-slate-800/60 pb-1.5">
                        <div>
                          <div className="font-semibold text-white">{t.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono">REF: {t.confirmationCode}</div>
                        </div>
                        <div className="font-mono text-cyan-300 font-semibold">
                          {formatPrice(t.totalPrice, preferences.currency)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Consolidated Itinerary Highlights */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Daily Itinerary Schedule ({itineraryDays.length} Days)</span>
              </h3>

              <div className="space-y-3">
                {itineraryDays.map((day) => (
                  <div
                    key={day.dayNumber}
                    className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-400">Day {day.dayNumber}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-xs font-semibold text-white">{day.title}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {day.forecast.tempC}°C · {day.isRainContingencyActive ? 'Indoor Rain Plan' : 'Sunny Plan'}
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      {day.activities.map((act) => (
                        <div key={act.id} className="flex items-start justify-between text-xs text-slate-300">
                          <div className="flex items-start gap-1.5 flex-1 pr-2">
                            <span className="text-cyan-400 font-mono text-[11px] shrink-0">{act.timeSlot.split(' - ')[0]}:</span>
                            <span className="truncate">{act.title}</span>
                            {act.isAnchorEvent && (
                              <span className="text-[10px] text-amber-400 font-mono shrink-0">[Anchor]</span>
                            )}
                          </div>
                          <span className="font-mono text-[11px] text-slate-400 shrink-0">
                            {formatPrice(act.cost, preferences.currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Preview Modal */}
      <PrintPreviewModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  );
};
