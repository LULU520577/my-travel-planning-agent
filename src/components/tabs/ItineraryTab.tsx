import React, { useState, useEffect } from 'react';
import { useTrip } from '../../context/TripContext';
import { formatPrice } from '../../services/mcpClient';
import { AddActivityModal } from '../modals/AddActivityModal';
import { 
  Calendar, 
  CloudRain, 
  Sun, 
  CloudSun, 
  Umbrella, 
  Anchor, 
  Building, 
  MapPin, 
  Clock, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Plus, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Baby,
  Navigation,
  Route,
  Zap
} from 'lucide-react';

export const ItineraryTab: React.FC = () => {
  const { 
    selectedDestination, 
    itineraryDays, 
    activeDayIndex, 
    setActiveDayIndex, 
    toggleRainContingency, 
    revertRainContingency, 
    moveActivity, 
    deleteActivity,
    preferences, 
    setActiveTab 
  } = useTrip();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReplanning, setIsReplanning] = useState(false);

  // ThinAir Telematics Geo MCP state
  const [transitMode, setTransitMode] = useState<'transit' | 'walking' | 'driving'>('transit');
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  if (!selectedDestination || itineraryDays.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-950 text-center">
        <div className="max-w-md space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-cyan-400">
            <Calendar className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white font-display">No Itinerary Drafted Yet</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Please complete Step 2 by selecting and confirming your flights to generate your dynamic destination schedule.
          </p>
          <button
            onClick={() => setActiveTab('confirmation')}
            className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
          >
            <span>Proceed to Step 2: Flights</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  const currentDay = itineraryDays[activeDayIndex] || itineraryDays[0];

  useEffect(() => {
    if (!currentDay || !currentDay.activities || currentDay.activities.length < 2) {
      setRouteInfo(null);
      return;
    }

    const waypoints = currentDay.activities.map((a) => a.location || a.title);
    const token = localStorage.getItem('ventureflow_thinair_token') || undefined;

    let isMounted = true;
    setIsLoadingRoute(true);

    fetch('/api/mcp/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ waypoints, transitMode, token })
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success) {
          setRouteInfo(data.route);
        }
      })
      .catch((e) => console.error('ThinAir route calculation error:', e))
      .finally(() => {
        if (isMounted) setIsLoadingRoute(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentDay?.dayNumber, currentDay?.activities, transitMode]);

  const handleRainToggle = async () => {
    setIsReplanning(true);
    try {
      if (currentDay.isRainContingencyActive) {
        revertRainContingency(currentDay.dayNumber);
      } else {
        await toggleRainContingency(currentDay.dayNumber);
      }
    } finally {
      setIsReplanning(false);
    }
  };

  const handleGlobalRainToggle = async (enable: boolean) => {
    setIsReplanning(true);
    try {
      if (enable) {
        await toggleRainContingency();
      } else {
        revertRainContingency();
      }
    } finally {
      setIsReplanning(false);
    }
  };

  const isAnyDayRainActive = itineraryDays.some((d) => d.isRainContingencyActive);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
      {/* Sub-header Controls Bar */}
      <div className="h-13 px-4 sm:px-6 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between shrink-0 gap-3">
        {/* Day Selector Tabs (horizontal scrollable pills) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {itineraryDays.map((day, idx) => {
            const isActive = activeDayIndex === idx;
            return (
              <button
                key={day.dayNumber}
                onClick={() => setActiveDayIndex(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 border-cyan-500/60 shadow-xs'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span>Day {day.dayNumber}</span>
                {day.isRainContingencyActive ? (
                  <Umbrella className="w-3 h-3 text-cyan-400 shrink-0" />
                ) : day.forecast.isRainy ? (
                  <CloudRain className="w-3 h-3 text-cyan-400/70 shrink-0" />
                ) : (
                  <Sun className="w-3 h-3 text-amber-400/80 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Global Rain Contingency Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isAnyDayRainActive ? (
            <button
              onClick={() => handleGlobalRainToggle(false)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-medium transition-colors"
              title="Revert all days back to sunny-day outdoor activities"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Revert to Sunny Plan</span>
            </button>
          ) : (
            <button
              onClick={() => handleGlobalRainToggle(true)}
              disabled={isReplanning}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/60 text-[11px] font-medium transition-colors"
              title="Auto-replan outdoor slots with covered indoor venues"
            >
              <Umbrella className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">Wet-Weather Auto-Replan (All)</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('logistics')}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
          >
            <span>Bookings & Logistics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area: Day Overview Header + Activity Timeline List */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Day Header Banner & Weather Condition Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-cyan-400 font-semibold">{currentDay.date} · {currentDay.dayOfWeek}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{currentDay.theme}</span>
            </div>
            <h2 className="text-lg font-bold font-display text-white tracking-tight mt-0.5">
              {currentDay.title}
            </h2>
          </div>

          {/* Meteorological Status & Day-Specific Rain Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 rounded px-3 py-1.5 text-xs">
              <div className="flex items-center gap-1.5">
                {currentDay.forecast.isRainy ? (
                  <CloudRain className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400" />
                )}
                <span className="font-mono tabular-nums text-white font-semibold">
                  {currentDay.forecast.tempC}°C
                </span>
                <span className="text-slate-400 text-[11px] hidden sm:inline">· {currentDay.forecast.condition}</span>
              </div>
              <span className="font-mono text-[11px] text-cyan-400">
                {currentDay.forecast.rainProbability}% precip
              </span>
            </div>

            {/* Smart Wet-Weather Day Toggle Button */}
            <button
              onClick={handleRainToggle}
              disabled={isReplanning}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all border ${
                currentDay.isRainContingencyActive
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Umbrella className={`w-3.5 h-3.5 ${currentDay.isRainContingencyActive ? 'text-slate-950' : 'text-cyan-400'}`} />
              <span>
                {currentDay.isRainContingencyActive ? 'Rain Plan Active (Revert)' : 'Simulate Wet Weather'}
              </span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Add Activity</span>
            </button>
          </div>
        </div>

        {/* Rain Contingency Banner if active */}
        {currentDay.isRainContingencyActive && (
          <div className="bg-cyan-950/40 border-b border-cyan-800/40 px-6 py-2 flex items-center justify-between text-xs text-cyan-300 shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                <strong>Rain Contingency Active:</strong> Outdoor attractions have been substituted with sheltered indoor architectural & culinary equivalents. Scheduled anchor festivals are securely preserved.
              </span>
            </div>
            <button
              onClick={() => revertRainContingency(currentDay.dayNumber)}
              className="underline text-cyan-200 hover:text-white shrink-0 ml-4 font-medium"
            >
              Undo & Revert Day {currentDay.dayNumber}
            </button>
          </div>
        )}

        {/* Geospatial Routing & ETA Summary Bar (ThinAir Telematics Geo MCP) */}
        {routeInfo && (
          <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
                <Navigation className="w-3.5 h-3.5" />
                <span>ThinAir Geo ETA:</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
                <span className="text-white font-bold">{routeInfo.totalDistanceKm} km</span>
                <span className="text-slate-500">·</span>
                <span className="text-cyan-300 font-bold">{routeInfo.totalDurationMinutes} mins travel</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">{routeInfo.steps?.length || 0} transfer legs</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Upstream: geo.thinair.co/mcp
              </span>
            </div>

            {/* Transit Mode Selector */}
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800 text-[11px] font-mono">
              {(['transit', 'walking', 'driving'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTransitMode(mode)}
                  className={`px-2 py-0.5 rounded capitalize transition-colors ${
                    transitMode === mode
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Scrollable Timeline List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
          <div className="max-w-4xl mx-auto space-y-3">
            {currentDay.activities.map((activity, actIdx) => {
              return (
                <div
                  key={activity.id}
                  className={`rounded-lg border p-4 transition-all duration-200 bg-slate-900/80 ${
                    activity.isAnchorEvent
                      ? 'border-amber-500/40 bg-slate-900/90 shadow-xs'
                      : activity.isReplacedDueToRain
                      ? 'border-cyan-500/50 bg-cyan-950/15'
                      : 'border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Left: Time Slot & Badges */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-cyan-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {activity.timeSlot}
                        </span>

                        <span className="text-slate-600">·</span>
                        <span className="text-xs text-slate-400 font-mono">{activity.duration}</span>

                        {/* Anchor Event Indicator */}
                        {activity.isAnchorEvent && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/40">
                            <Anchor className="w-3 h-3 text-amber-400" />
                            <span>Protected Anchor Event</span>
                          </span>
                        )}

                        {/* Family-Friendly Indicator */}
                        {(preferences.kidsCount > 0 || preferences.selectedVibes.includes('Family-Friendly')) && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-600/40">
                            <Baby className="w-3 h-3 text-emerald-400" />
                            <span>Family Friendly</span>
                          </span>
                        )}

                        {/* Rain Replacement Indicator */}
                        {activity.isReplacedDueToRain && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                            <Umbrella className="w-3 h-3 text-cyan-400" />
                            <span>Contingency Indoor Replacement</span>
                          </span>
                        )}

                        {/* Indoor vs Outdoor badge */}
                        <span className="text-[11px] text-slate-400 font-mono">
                          {activity.isIndoor ? 'Sheltered / Indoor' : 'Open-Air / Outdoor'}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-base font-bold font-display text-white">
                        {activity.title}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {activity.description}
                      </p>

                      {/* If substituted, show original activity comparison */}
                      {activity.isReplacedDueToRain && activity.originalActivity && (
                        <div className="mt-2 p-2 rounded bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
                          <span className="text-amber-400/90 font-medium">Replaced sunny-day plan: </span>
                          <span className="line-through">{activity.originalActivity.title}</span> ({activity.originalActivity.location})
                        </div>
                      )}

                      {/* Location & Cost readout */}
                      <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{activity.location}</span>
                        </div>
                        <span>·</span>
                        <div>
                          Est. Cost: <span className="font-mono text-slate-200">{formatPrice(activity.cost, preferences.currency)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Reorder & Delete Actions */}
                    <div className="flex items-center sm:flex-col gap-1 self-end sm:self-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveActivity(activeDayIndex, actIdx, 'up')}
                          disabled={actIdx === 0}
                          title="Move Earlier in Day"
                          className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveActivity(activeDayIndex, actIdx, 'down')}
                          disabled={actIdx === currentDay.activities.length - 1}
                          title="Move Later in Day"
                          className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => deleteActivity(activeDayIndex, activity.id)}
                        title="Remove Activity"
                        className="p-1 rounded hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Custom Activity Modal */}
      <AddActivityModal
        dayIndex={activeDayIndex}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
