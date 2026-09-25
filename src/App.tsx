/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TripProvider, useTrip } from './context/TripContext';
import { TopHeader } from './components/layout/TopHeader';
import { DiscoveryTab } from './components/tabs/DiscoveryTab';
import { ConfirmationTab } from './components/tabs/ConfirmationTab';
import { ItineraryTab } from './components/tabs/ItineraryTab';
import { LogisticsTab } from './components/tabs/LogisticsTab';
import { SummaryTab } from './components/tabs/SummaryTab';
import { ToastNotification } from './components/common/ToastNotification';

const AppContent: React.FC = () => {
  const { activeTab } = useTrip();

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-950 text-slate-100 select-none">
      {/* Pinned Top Navigation Bar adhering to the 3-zone contract */}
      <TopHeader />

      {/* Main Viewport Workspace: Non-scrolling container; inner panels scroll independently */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'discovery' && <DiscoveryTab />}
        {activeTab === 'confirmation' && <ConfirmationTab />}
        {activeTab === 'itinerary' && <ItineraryTab />}
        {activeTab === 'logistics' && <LogisticsTab />}
        {activeTab === 'summary' && <SummaryTab />}
      </div>

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
