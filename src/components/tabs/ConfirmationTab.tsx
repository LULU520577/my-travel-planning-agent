import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { formatPrice } from '../../services/mcpClient';
import { OriginGatewayInput } from '../common/OriginGatewayInput';
import { 
  Plane, 
  MapPin, 
  Clock, 
  Luggage, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  AlertCircle,
  Sparkles,
  TrendingDown,
  Building,
  Navigation,
  Edit2
} from 'lucide-react';

export const ConfirmationTab: React.FC = () => {
  const { 
    selectedDestination, 
    flightOptions, 
    selectedFlight, 
    selectFlight, 
    isLoadingFlights, 
    confirmDestinationAndFlights, 
    isLoadingItinerary,
    preferences, 
    updatePreferences,
    setActiveTab 
  } = useTrip();

  const [isEditingOrigin, setIsEditingOrigin] = useState(false);

  if (!selectedDestination) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-950 text-center">
        <div className="max-w-md space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-cyan-400">
            <MapPin className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white font-display">No Destination Selected Yet</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Please select a destination from the Discovery panel first to review available live flights and generate your dynamic itinerary.
          </p>
          <button
            onClick={() => setActiveTab('discovery')}
            className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
          >
            <span>Return to Discovery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
      {/* Sub-header Context Bar */}
      <div className="h-12 px-6 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-cyan-400 uppercase tracking-wider">Step 2</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-white font-medium">Flight Selection & Destination Lock-In</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400 font-mono">
            {preferences.partySize} {preferences.partySize === 1 ? 'passenger' : 'passengers'}
            {preferences.kidsCount ? ` (${preferences.adultsCount ?? (preferences.partySize - preferences.kidsCount)} Adults, ${preferences.kidsCount} ${preferences.kidsCount === 1 ? 'Kid' : 'Kids'})` : ''}
          </span>
        </div>

        <button
          onClick={() => setActiveTab('discovery')}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
        >
          <span>Change Destination</span>
        </button>
      </div>

      {/* Main Two-Column Layout with localized vertical scroll */}
      <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
        {/* Left Column: Destination Deep Dive Dossier */}
        <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-slate-900/40 p-5 overflow-y-auto space-y-5 shrink-0">
          {/* Destination Header Card */}
          <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
            <div className="relative h-40">
              <img
                src={selectedDestination.heroImage}
                alt={selectedDestination.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[11px] font-mono text-cyan-400 font-medium">Selected Destination</span>
                <h3 className="text-lg font-bold text-white font-display leading-tight">
                  {selectedDestination.name}
                </h3>
              </div>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed">
                {selectedDestination.tagline}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
                <div className="p-2 bg-slate-950/60 rounded border border-slate-800/80">
                  <div className="text-slate-400">Match Index</div>
                  <div className="text-cyan-300 font-semibold mt-0.5">{selectedDestination.vibeMatchScore}% Concordance</div>
                </div>
                <div className="p-2 bg-slate-950/60 rounded border border-slate-800/80">
                  <div className="text-slate-400">Seasonal Climate</div>
                  <div className="text-amber-300 font-semibold mt-0.5">{selectedDestination.weatherSummary.tempC}°C Avg</div>
                </div>
              </div>

              {/* Match Factors */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Why This Destination Fits
                </div>
                <ul className="space-y-1 text-slate-300">
                  {selectedDestination.matchReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Wet-weather readiness badge */}
              <div className="p-2.5 rounded bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Wet-Weather contingency pipeline is pre-calibrated. Outdoor sights can be automatically swapped for indoor architectural gems.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Flight Options & Base Confirmation Action */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
          {/* Header Bar */}
          <div className="p-5 border-b border-slate-800/80 bg-slate-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="flex-1 max-w-lg">
              <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                <Plane className="w-4 h-4 text-cyan-400" />
                <span>Smithery AI MCP Live Flight Options</span>
              </h2>
              {isEditingOrigin ? (
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-72">
                    <OriginGatewayInput
                      value={preferences.originCity}
                      onChange={(originCity) => updatePreferences({ originCity })}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingOrigin(false)}
                    className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>Connecting</span>
                  <span className="font-mono text-cyan-300 font-semibold">{preferences.originCity}</span>
                  <span>to {selectedDestination.city} gateway.</span>
                  <button
                    onClick={() => setIsEditingOrigin(true)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 underline flex items-center gap-0.5 ml-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Change Origin</span>
                  </button>
                </p>
              )}
            </div>

            {/* Direct Confirmation Action Button */}
            <button
              onClick={confirmDestinationAndFlights}
              disabled={isLoadingItinerary || !selectedFlight}
              className="px-5 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoadingItinerary ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Base Itinerary...</span>
                </>
              ) : (
                <>
                  <span>Confirm Flight & Build Itinerary</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Scrollable Flight List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {isLoadingFlights ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <div className="text-xs text-slate-400 font-mono">Querying Smithery Flight MCP Server...</div>
              </div>
            ) : flightOptions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No flights found for this routing. Please try a different origin city.
              </div>
            ) : (
              flightOptions.map((flight) => {
                const isSelected = selectedFlight?.id === flight.id;
                return (
                  <div
                    key={flight.id}
                    onClick={() => selectFlight(flight)}
                    className={`rounded-lg border p-4.5 transition-all cursor-pointer bg-slate-900/70 hover:bg-slate-900 ${
                      isSelected
                        ? 'border-cyan-500 bg-slate-900 shadow-sm ring-1 ring-cyan-500/40'
                        : 'border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Airline & Route Info */}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{flight.airline}</span>
                          <span className="font-mono text-xs text-slate-400">· {flight.flightNumber}</span>
                          <span className="font-mono text-[11px] text-slate-500">· {flight.aircraft}</span>
                        </div>

                        {/* Schedule Timeline */}
                        <div className="flex items-center gap-4 text-xs font-mono">
                          <div>
                            <div className="text-white font-bold text-sm">{flight.departureTime}</div>
                            <div className="text-slate-400 text-[11px] truncate max-w-44">{flight.departureAirport}</div>
                          </div>

                          <div className="flex flex-col items-center px-2">
                            <span className="text-[10px] text-slate-400">{flight.duration}</span>
                            <div className="w-20 sm:w-28 h-px bg-slate-700 relative my-1">
                              <Plane className="w-3 h-3 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <span className={`text-[10px] ${flight.stops === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {flight.stops === 0 ? 'Direct Nonstop' : `1 Stop (${flight.stopCity})`}
                            </span>
                          </div>

                          <div>
                            <div className="text-white font-bold text-sm">{flight.arrivalTime}</div>
                            <div className="text-slate-400 text-[11px] truncate max-w-44">{flight.arrivalAirport}</div>
                          </div>
                        </div>

                        {/* Flight Features */}
                        <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                          <div className="flex items-center gap-1">
                            <Luggage className="w-3 h-3 text-emerald-400" />
                            <span>{flight.baggageIncluded ? 'Checked Bag Included (23kg)' : 'Cabin Bag Only'}</span>
                          </div>
                          <span>·</span>
                          <div>Class: <span className="text-slate-200">{flight.cabinClass}</span></div>
                          <span>·</span>
                          <div>Carbon: <span className="font-mono text-slate-400">{flight.emissionKg} kg CO₂</span></div>
                        </div>
                      </div>

                      {/* Right: Pricing & Radio Selection */}
                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                        <div className="text-right">
                          <div className="text-[11px] text-slate-400">Total for {preferences.partySize} {preferences.partySize === 1 ? 'person' : 'people'}</div>
                          <div className="text-base font-bold font-mono text-cyan-300">
                            {formatPrice(flight.totalPrice, preferences.currency)}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {formatPrice(flight.pricePerPerson, preferences.currency)} / person
                          </div>
                        </div>

                        <div className="mt-2">
                          <span className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                            isSelected
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}>
                            {isSelected ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                                <span>Selected</span>
                              </>
                            ) : (
                              <span>Choose Flight</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
