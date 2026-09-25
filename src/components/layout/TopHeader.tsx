import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { PlanningTab, CurrencyCode } from '../../types/travel';
import { formatPrice } from '../../services/mcpClient';
import { McpStatusModal } from '../modals/McpStatusModal';
import { 
  Compass, 
  Plane, 
  CalendarDays, 
  CreditCard, 
  FileCheck, 
  RotateCcw,
  Sparkles,
  Server
} from 'lucide-react';

export const TopHeader: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    preferences, 
    updatePreferences, 
    selectedDestination, 
    budgetBreakdown,
    resetAll 
  } = useTrip();

  const [isMcpModalOpen, setIsMcpModalOpen] = useState(false);

  const tabs: { id: PlanningTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'discovery', label: '1. Discovery', icon: Compass },
    { id: 'confirmation', label: '2. Flights & Destination', icon: Plane },
    { id: 'itinerary', label: '3. Dynamic Itinerary', icon: CalendarDays },
    { id: 'logistics', label: '4. Bookings & Logistics', icon: CreditCard },
    { id: 'summary', label: '5. Master Summary', icon: FileCheck },
  ];

  const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'SGD'];

  return (
    <header className="h-14 bg-slate-900/95 border-b border-slate-800 px-4 md:px-6 flex items-center justify-between shrink-0 select-none z-30">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <a 
          href="#discovery" 
          onClick={(e) => { e.preventDefault(); setActiveTab('discovery'); }}
          className="font-display font-bold text-lg tracking-tight text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-mono font-bold text-white shadow-sm">
            VF
          </span>
          <span className="text-white font-semibold">VentureFlow</span>
        </a>

        {selectedDestination && (
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-800 text-xs text-slate-400">
            <span className="text-slate-300 font-medium">{selectedDestination.city}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{selectedDestination.country}</span>
          </div>
        )}
      </div>

      {/* Zone 2: 5 clean navigation tabs (single line, zero-pill text with active bottom border or clean state) */}
      <nav className="flex items-center gap-1 sm:gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-slate-800 text-cyan-400 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="hidden md:inline">{tab.label}</span>
              <span className="inline md:hidden">{tab.id.slice(0, 4)}</span>
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Financial status readout & action controls */}
      <div className="flex items-center gap-3">
        {/* MCP Live Status Pill */}
        <button
          onClick={() => setIsMcpModalOpen(true)}
          title="Open Model Context Protocol Hub (VentureFlow + FlightPowers)"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-[11px] font-mono text-cyan-300 transition-colors shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <Server className="w-3 h-3 text-cyan-400" />
          <span>MCP Hub</span>
        </button>

        {/* Currency Selector */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded border border-slate-700/60 text-xs">
          <label htmlFor="currency-select" className="text-slate-400 text-[11px] uppercase tracking-wider">
            Curr
          </label>
          <select
            id="currency-select"
            value={preferences.currency}
            onChange={(e) => updatePreferences({ currency: e.target.value as CurrencyCode })}
            className="bg-transparent text-slate-200 font-mono text-xs focus:outline-none cursor-pointer"
          >
            {currencies.map((curr) => (
              <option key={curr} value={curr} className="bg-slate-900 text-slate-100">
                {curr}
              </option>
            ))}
          </select>
        </div>

        {/* Budget Meter */}
        <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Committed</div>
            <div className={`font-mono tabular-nums text-xs font-medium ${
              budgetBreakdown.isOverBudget ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {formatPrice(budgetBreakdown.totalCommitted, preferences.currency)}
              <span className="text-slate-500 ml-1">/ {formatPrice(budgetBreakdown.allocatedBudget, preferences.currency)}</span>
            </div>
          </div>
        </div>

        {/* Reset Workspace Button */}
        <button
          onClick={resetAll}
          title="Reset Trip Planning Workspace"
          className="p-1.5 text-slate-400 hover:text-rose-300 hover:bg-slate-800/80 rounded transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <McpStatusModal isOpen={isMcpModalOpen} onClose={() => setIsMcpModalOpen(false)} />
    </header>
  );
};
