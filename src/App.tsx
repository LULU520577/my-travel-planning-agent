/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TripProvider, useTrip } from './context/TripContext';
import { TopHeader } from './components/layout/TopHeader';
import { DiscoveryTab } from './components/tabs/DiscoveryTab';
import { ConfirmationTab } from './components/tabs/ConfirmationTab';
import { ItineraryTab } from './components/tabs/ItineraryTab';
import { LogisticsTab } from './components/tabs/LogisticsTab';
import { SummaryTab } from './components/tabs/SummaryTab';
import { ToastNotification } from './components/common/ToastNotification';
import { AskPanel } from './components/agent/AskPanel';
import { Bot } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab } = useTrip();
  const [isAskPanelOpen, setIsAskPanelOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-950 text-slate-100 select-none relative">
      {/* Pinned Top Navigation Bar adhering to the 3-zone contract */}
      <TopHeader 
        onToggleAskPanel={() => setIsAskPanelOpen((prev) => !prev)}
        isAskPanelOpen={isAskPanelOpen}
      />

      {/* Main Viewport Workspace: Non-scrolling container; inner panels scroll independently */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'discovery' && <DiscoveryTab />}
        {activeTab === 'confirmation' && <ConfirmationTab />}
        {activeTab === 'itinerary' && <ItineraryTab />}
        {activeTab === 'logistics' && <LogisticsTab />}
        {activeTab === 'summary' && <SummaryTab />}
      </div>

      {/* Floating Ask Agent Quick Launcher Button */}
      {!isAskPanelOpen && (
        <button
          onClick={() => setIsAskPanelOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-indigo-900/40 hover:scale-105 active:scale-95 transition-all border border-indigo-400/40"
          title="Ask Agent (Gemini 3.8 Flash + MCP)"
        >
          <Bot className="w-4 h-4 text-white animate-pulse" />
          <span>Ask Agent</span>
        </button>
      )}

      {/* Slide-over Ask Panel (POST /api/ask) */}
      <AskPanel
        isOpen={isAskPanelOpen}
        onClose={() => setIsAskPanelOpen(false)}
      />

      {/* Floating Status Notification */}
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <TripProvider>
      <AppContent />
    </TripProvider>
  );
}
