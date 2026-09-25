import React from 'react';
import { useTrip } from '../../context/TripContext';
import { TripVibe, DestinationProposal, TripPreferences } from '../../types/travel';
import { formatPrice } from '../../services/mcpClient';
import { OriginGatewayInput } from '../common/OriginGatewayInput';
import { 
  Compass, 
  Sparkles, 
  Users, 
  Calendar, 
  MapPin, 
  Coins, 
  Check, 
  CloudSun, 
  CloudRain, 
  Sun, 
  ArrowRight, 
  RefreshCw, 
  TrendingUp, 
  ShieldCheck,
  Baby
} from 'lucide-react';

const ALL_VIBES: TripVibe[] = [
  'Family-Friendly',
  'Culture & Heritage',
  'Gastronomy & Street Food',
  'Scenic Nature & Lakes',
  'Mountain Hiking',
  'Coastal & Relaxation',
  'Architecture & Design',
  'Nightlife & Izakaya'
];

export const DiscoveryTab: React.FC = () => {
  const { 
    preferences, 
    updatePreferences, 
    proposals, 
    isDiscovering, 
    selectedDestination, 
    selectDestination, 
    refreshDiscovery,
    setActiveTab 
  } = useTrip();

  const handleVibeToggle = (vibe: TripVibe) => {
    const exists = preferences.selectedVibes.includes(vibe);
    const updated = exists 
      ? preferences.selectedVibes.filter((v) => v !== vibe)
      : [...preferences.selectedVibes, vibe];
    updatePreferences({ selectedVibes: updated });
  };

  const getWeatherIcon = (iconName: string) => {
    if (iconName === 'sun') return <Sun className="w-4 h-4 text-amber-400" />;
    if (iconName === 'cloud-rain') return <CloudRain className="w-4 h-4 text-cyan-400" />;
    return <CloudSun className="w-4 h-4 text-amber-300" />;
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-slate-950">
      {/* Left Column: Fixed-width workspace form panel with localized vertical scroll */}
      <aside className="w-full md:w-88 lg:w-96 border-b md:border-b-0 md:border-r border-slate-800/80 bg-slate-900/60 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-5 space-y-6">
          {/* Header Title */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Step 1 · Parameter Discovery</span>
            </div>
            <h1 className="text-xl font-bold font-display text-white tracking-tight">
              Trip Parameters
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Smithery AI MCP matches real-time flight vectors, seasonal meteorology & budget constraints.
            </p>
          </div>

          {/* Form Inputs */}
          <div className="space-y-4">
            {/* Total Budget */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-300 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-slate-400" />
                  Total Trip Budget
                </span>
                <span className="font-mono tabular-nums text-cyan-300 font-semibold text-sm">
                  {formatPrice(preferences.totalBudget, preferences.currency)}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="15000"
                step="250"
                value={preferences.totalBudget}
                onChange={(e) => updatePreferences({ totalBudget: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>{formatPrice(1000, preferences.currency)}</span>
                <span>{formatPrice(7500, preferences.currency)}</span>
                <span>{formatPrice(15000, preferences.currency)}</span>
              </div>
            </div>

            {/* Origin Airport with Free Text & Similar Word Selector */}
            <div>
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between gap-1.5 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Departure Origin Gateway
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Free Text / Airport Code</span>
              </label>
              <OriginGatewayInput
                value={preferences.originCity}
                onChange={(originCity) => updatePreferences({ originCity })}
              />
            </div>

            {/* Party Composition: Adults & Kids */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  Travel Party
                </span>
                <span className="font-mono text-cyan-300 text-[11px] font-semibold">
                  {preferences.partySize} total ({preferences.adultsCount ?? 2} {preferences.adultsCount === 1 ? 'Adult' : 'Adults'}, {preferences.kidsCount ?? 0} {preferences.kidsCount === 1 ? 'Kid' : 'Kids'})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Adults Stepper */}
                <div>
                  <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                    <span>Adults</span>
                    <span className="text-[10px] text-slate-500 font-mono">18+</span>
                  </div>
                  <div className="flex items-center border border-slate-700/80 rounded bg-slate-900 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updatePreferences({ adultsCount: Math.max(1, (preferences.adultsCount ?? 2) - 1) })}
                      className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center font-mono text-xs text-slate-200 py-1">
                      {preferences.adultsCount ?? 2}
                    </div>
                    <button
                      type="button"
                      onClick={() => updatePreferences({ adultsCount: Math.min(8, (preferences.adultsCount ?? 2) + 1) })}
                      className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Kids Stepper */}
                <div>
                  <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-cyan-400 font-medium">
                      <Baby className="w-3 h-3" />
                      <span>Kids</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">0-17</span>
                  </div>
                  <div className="flex items-center border border-slate-700/80 rounded bg-slate-900 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updatePreferences({ kidsCount: Math.max(0, (preferences.kidsCount ?? 0) - 1) })}
                      className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center font-mono text-xs text-slate-200 py-1">
                      {preferences.kidsCount ?? 0}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newKids = Math.min(6, (preferences.kidsCount ?? 0) + 1);
                        const updates: Partial<TripPreferences> = { kidsCount: newKids };
                        // If family-friendly not selected, automatically include it
                        if (!preferences.selectedVibes.includes('Family-Friendly')) {
                          updates.selectedVibes = ['Family-Friendly', ...preferences.selectedVibes];
                        }
                        updatePreferences(updates);
                      }}
                      className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Duration Stepper */}
              <div>
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between gap-1.5 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Trip Duration
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">{preferences.durationDays} Days / {preferences.durationDays - 1} Nights</span>
                </label>
                <div className="flex items-center border border-slate-700/80 rounded bg-slate-900 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => updatePreferences({ durationDays: Math.max(3, preferences.durationDays - 1) })}
                    className="px-3 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center font-mono text-xs text-slate-200 py-1">
                    {preferences.durationDays} Days
                  </div>
                  <button
                    type="button"
                    onClick={() => updatePreferences({ durationDays: Math.min(14, preferences.durationDays + 1) })}
                    className="px-3 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Travel Pace */}
            <div>
              <span className="text-xs font-medium text-slate-300 block mb-1.5">
                Itinerary Rhythm
              </span>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 border border-slate-800 rounded">
                {(['relaxed', 'balanced', 'intense'] as const).map((pace) => (
                  <button
                    key={pace}
                    type="button"
                    onClick={() => updatePreferences({ preferredPace: pace })}
                    className={`text-[11px] py-1 capitalize rounded transition-colors ${
                      preferences.preferredPace === pace
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {pace}
                  </button>
                ))}
              </div>
            </div>

            {/* Trip Vibes & Interests */}
            <div>
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Interests & Vibe Priorities
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ALL_VIBES.map((vibe) => {
                  const active = preferences.selectedVibes.includes(vibe);
                  return (
                    <button
                      key={vibe}
                      type="button"
                      onClick={() => handleVibeToggle(vibe)}
                      className={`text-xs px-2.5 py-1 rounded transition-colors text-left flex items-center gap-1.5 border ${
                        active
                          ? 'bg-slate-800 border-cyan-500/50 text-cyan-300 font-medium'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {active && <Check className="w-3 h-3 text-cyan-400 shrink-0" />}
                      <span>{vibe}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Trigger Refresh */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={refreshDiscovery}
              disabled={isDiscovering}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/60 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isDiscovering ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isDiscovering ? 'Connecting to Smithery MCP...' : 'Recalculate Live Proposals'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Right Column: Destination Proposals Grid with localized vertical scroll */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
        {/* Sub-header status bar */}
        <div className="h-11 px-6 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Smithery MCP Live Hub</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono text-cyan-400 font-semibold">{proposals.length} Destination Proposals</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">Real-time GDS & Meteo calibration</span>
          </div>

          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Wet-Weather contingency ready</span>
          </div>
        </div>

        {/* Scrollable Proposals Container */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {proposals.map((dest) => {
                const isSelected = selectedDestination?.id === dest.id;
                return (
                  <div
                    key={dest.id}
                    className={`rounded-lg border transition-all duration-200 flex flex-col overflow-hidden bg-slate-900/80 ${
                      isSelected
                        ? 'border-cyan-500/80 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                        : 'border-slate-800/90 hover:border-slate-700'
                    }`}
                  >
                    {/* Destination Image Banner */}
                    <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
                      <img
                        src={dest.heroImage}
                        alt={`${dest.city}, ${dest.country}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Clean SVG fallback container
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                      {/* Header overlay metadata */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="bg-slate-900/90 backdrop-blur-xs text-cyan-300 font-mono text-[11px] font-semibold px-2 py-0.5 rounded border border-slate-700/60">
                          {dest.vibeMatchScore}% Vibe Match
                        </span>
                        <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                          dest.peakSeasonIndicator === 'Shoulder'
                            ? 'bg-amber-950/70 border-amber-600/50 text-amber-300'
                            : 'bg-emerald-950/70 border-emerald-600/50 text-emerald-300'
                        }`}>
                          {dest.peakSeasonIndicator} Season
                        </span>
                      </div>

                      {/* Bottom Image title */}
                      <div className="absolute bottom-3 left-4 right-4">
                        <div className="text-xs text-slate-300 font-medium">{dest.country} · {dest.region}</div>
                        <h2 className="text-xl font-bold font-display text-white tracking-tight drop-shadow-sm">
                          {dest.name}
                        </h2>
                      </div>
                    </div>

                    {/* Body content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      {/* Tagline & Weather */}
                      <div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-3">
                          {dest.tagline}
                        </p>

                        {/* Live Weather Forecast Bar */}
                        <div className="bg-slate-950/70 border border-slate-800 rounded p-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            {getWeatherIcon(dest.weatherSummary.icon)}
                            <span className="font-mono tabular-nums text-slate-200 font-medium">
                              {dest.weatherSummary.tempC}°C
                            </span>
                            <span className="text-slate-400 hidden sm:inline">· {dest.weatherSummary.condition}</span>
                          </div>
                          <div className="text-right text-[11px] font-mono text-cyan-400">
                            {dest.weatherSummary.rainProbability}% rain prob
                          </div>
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="space-y-1.5">
                        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                          Curated Highlights
                        </div>
                        <ul className="text-xs text-slate-300 space-y-1">
                          {dest.highlights.slice(0, 3).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-cyan-400 font-bold shrink-0">›</span>
                              <span className="truncate">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pricing Estimates and CTA */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Est. Flight / Person</div>
                          <div className="font-mono tabular-nums text-sm font-semibold text-white">
                            {formatPrice(dest.estimatedFlightCost, preferences.currency)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              selectDestination(dest);
                              setActiveTab('confirmation');
                            }}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold transition-all ${
                              isSelected
                                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm'
                                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                            }`}
                          >
                            <span>{isSelected ? 'View & Lock Flights' : 'Select Destination'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
