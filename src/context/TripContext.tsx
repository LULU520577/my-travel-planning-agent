import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  TripPreferences, 
  DestinationProposal, 
  FlightOption, 
  ItineraryDay, 
  ActivityItem, 
  AccommodationOption, 
  TransitPassOption, 
  AttractionTicketOption, 
  BookingState, 
  PlanningTab,
  CurrencyCode,
  TripVibe
} from '../types/travel';
import { 
  fetchDiscoveredDestinations, 
  fetchFlightsForDestination, 
  fetchItineraryForDestination, 
  fetchLogisticsCatalog, 
  requestWetWeatherReplan, 
  executeSimulatedBooking 
} from '../services/mcpClient';

interface TripContextType {
  // Navigation
  activeTab: PlanningTab;
  setActiveTab: (tab: PlanningTab) => void;

  // Preferences
  preferences: TripPreferences;
  updatePreferences: (updates: Partial<TripPreferences>) => void;

  // Discovery
  proposals: DestinationProposal[];
  isDiscovering: boolean;
  selectedDestination: DestinationProposal | null;
  selectDestination: (dest: DestinationProposal) => void;
  refreshDiscovery: () => Promise<void>;

  // Flights & Confirmation
  flightOptions: FlightOption[];
  selectedFlight: FlightOption | null;
  isLoadingFlights: boolean;
  selectFlight: (flight: FlightOption) => void;
  confirmDestinationAndFlights: () => Promise<void>;

  // Itinerary
  itineraryDays: ItineraryDay[];
  isLoadingItinerary: boolean;
  activeDayIndex: number;
  setActiveDayIndex: (index: number) => void;
  toggleRainContingency: (dayNumber?: number) => Promise<void>;
  revertRainContingency: (dayNumber?: number) => void;
  moveActivity: (dayIndex: number, actIndex: number, direction: 'up' | 'down') => void;
  deleteActivity: (dayIndex: number, actId: string) => void;
  addActivity: (dayIndex: number, activity: Omit<ActivityItem, 'id'>) => void;
  editActivity: (dayIndex: number, actId: string, updates: Partial<ActivityItem>) => void;

  // Logistics & Bookings
  accommodations: AccommodationOption[];
  transitPasses: TransitPassOption[];
  attractionTickets: AttractionTicketOption[];
  isLoadingLogistics: boolean;
  bookingState: BookingState;
  bookItem: (params: {
    type: 'flight' | 'hotel' | 'transit' | 'ticket';
    item: any;
  }) => Promise<{ referenceCode: string }>;
  unbookItem: (type: 'hotel' | 'transit' | 'ticket', itemId: string) => void;

  // Master Financials
  budgetBreakdown: {
    allocatedBudget: number;
    committedFlights: number;
    committedHotels: number;
    committedTransit: number;
    committedTickets: number;
    committedActivities: number;
    totalCommitted: number;
    remainingBalance: number;
    isOverBudget: boolean;
  };

  // Status & Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
  resetAll: () => void;
}

const DEFAULT_PREFERENCES: TripPreferences = {
  currency: 'USD',
  totalBudget: 4800,
  originCity: 'San Francisco (SFO)',
  startDate: '2026-10-12',
  endDate: '2026-10-18',
  durationDays: 6,
  adultsCount: 2,
  kidsCount: 0,
  partySize: 2,
  selectedVibes: ['Culture & Heritage', 'Gastronomy & Street Food', 'Scenic Nature & Lakes'],
  preferredPace: 'balanced'
};

const TripContext = createContext<TripContextType | undefined>(undefined);

const STORAGE_KEY = 'ventureflow_travel_state_v1';

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<PlanningTab>('discovery');
  const [preferences, setPreferences] = useState<TripPreferences>(DEFAULT_PREFERENCES);
  
  const [proposals, setProposals] = useState<DestinationProposal[]>([]);
  const [isDiscovering, setIsDiscovering] = useState<boolean>(false);
  const [selectedDestination, setSelectedDestination] = useState<DestinationProposal | null>(null);

  const [flightOptions, setFlightOptions] = useState<FlightOption[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<FlightOption | null>(null);
  const [isLoadingFlights, setIsLoadingFlights] = useState<boolean>(false);

  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>([]);
  const [originalSunnyItineraryDays, setOriginalSunnyItineraryDays] = useState<ItineraryDay[]>([]);
  const [isLoadingItinerary, setIsLoadingItinerary] = useState<boolean>(false);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);

  const [accommodations, setAccommodations] = useState<AccommodationOption[]>([]);
  const [transitPasses, setTransitPasses] = useState<TransitPassOption[]>([]);
  const [attractionTickets, setAttractionTickets] = useState<AttractionTicketOption[]>([]);
  const [isLoadingLogistics, setIsLoadingLogistics] = useState<boolean>(false);

  const [bookingState, setBookingState] = useState<BookingState>({
    transitPasses: [],
    attractionTickets: [],
    bookingHistory: []
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3800);
  };

  // Hydrate from localStorage on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.preferences) setPreferences(parsed.preferences);
        if (parsed.activeTab) setActiveTab(parsed.activeTab);
        if (parsed.selectedDestination) setSelectedDestination(parsed.selectedDestination);
        if (parsed.selectedFlight) setSelectedFlight(parsed.selectedFlight);
        if (parsed.itineraryDays) {
          setItineraryDays(parsed.itineraryDays);
          setOriginalSunnyItineraryDays(parsed.originalSunnyItineraryDays || parsed.itineraryDays);
        }
        if (parsed.bookingState) setBookingState(parsed.bookingState);
      }
    } catch (e) {
      console.warn('Could not hydrate stored trip state:', e);
    }
  }, []);

  // Persist state to localStorage on changes
  useEffect(() => {
    try {
      const stateToPersist = {
        preferences,
        activeTab,
        selectedDestination,
        selectedFlight,
        itineraryDays,
        originalSunnyItineraryDays,
        bookingState
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch (e) {
      console.warn('Could not persist trip state:', e);
    }
  }, [preferences, activeTab, selectedDestination, selectedFlight, itineraryDays, originalSunnyItineraryDays, bookingState]);

  // Load destination proposals on initial boot or preference refresh
  const refreshDiscovery = async () => {
    setIsDiscovering(true);
    try {
      const results = await fetchDiscoveredDestinations(preferences);
      setProposals(results);
      if (!selectedDestination && results.length > 0) {
        setSelectedDestination(results[0]);
      }
    } catch (err) {
      console.error('Failed to discover destinations:', err);
    } finally {
      setIsDiscovering(false);
    }
  };

  useEffect(() => {
    refreshDiscovery();
  }, [preferences.currency, preferences.partySize]);

  // When selectedDestination changes, load flights and logistics
  useEffect(() => {
    if (!selectedDestination) return;

    const loadDestinationData = async () => {
      setIsLoadingFlights(true);
      setIsLoadingLogistics(true);
      try {
        const flights = await fetchFlightsForDestination(
          selectedDestination.id,
          preferences.originCity,
          preferences.currency,
          preferences.partySize
        );
        setFlightOptions(flights);
        if (flights.length > 0 && (!selectedFlight || selectedFlight.destinationId !== selectedDestination.id)) {
          setSelectedFlight(flights[0]);
        }

        const log = await fetchLogisticsCatalog(
          selectedDestination.id,
          preferences.currency,
          preferences.partySize
        );
        setAccommodations(log.accommodations);
        setTransitPasses(log.transitPasses);
        setAttractionTickets(log.attractionTickets);
      } catch (e) {
        console.error('Error loading destination catalog:', e);
      } finally {
        setIsLoadingFlights(false);
        setIsLoadingLogistics(false);
      }
    };

    loadDestinationData();
  }, [selectedDestination?.id, preferences.currency, preferences.partySize, preferences.originCity]);

  const updatePreferences = (updates: Partial<TripPreferences>) => {
    setPreferences((prev) => {
      const merged = { ...prev, ...updates };
      if (updates.adultsCount !== undefined || updates.kidsCount !== undefined) {
        const adults = updates.adultsCount !== undefined ? updates.adultsCount : prev.adultsCount;
        const kids = updates.kidsCount !== undefined ? updates.kidsCount : prev.kidsCount;
        merged.adultsCount = adults;
        merged.kidsCount = kids;
        merged.partySize = adults + kids;
      }
      return merged;
    });
  };

  const selectDestination = (dest: DestinationProposal) => {
    setSelectedDestination(dest);
    showToast(`Destination selected: ${dest.city}, ${dest.country}`);
  };

  const selectFlight = (flight: FlightOption) => {
    setSelectedFlight(flight);
    showToast(`Flight updated: ${flight.airline} (${flight.flightNumber})`);
  };

  const confirmDestinationAndFlights = async () => {
    if (!selectedDestination) return;
    setIsLoadingItinerary(true);
    try {
      const days = await fetchItineraryForDestination(selectedDestination.id, preferences.currency);
      setItineraryDays(days);
      setOriginalSunnyItineraryDays(JSON.parse(JSON.stringify(days)));
      setActiveTab('itinerary');
      showToast(`Itinerary generated for ${selectedDestination.city}!`);
    } catch (e) {
      console.error('Failed to generate base itinerary:', e);
    } finally {
      setIsLoadingItinerary(false);
    }
  };

  // Wet-Weather Contingency Toggle
  const toggleRainContingency = async (dayNumber?: number) => {
    if (!selectedDestination || itineraryDays.length === 0) return;

    const updated = await Promise.all(
      itineraryDays.map(async (day) => {
        if (dayNumber !== undefined && day.dayNumber !== dayNumber) {
          return day;
        }
        if (day.isRainContingencyActive) {
          return day; // already replanned
        }
        return await requestWetWeatherReplan(selectedDestination.id, day);
      })
    );

    setItineraryDays(updated);
    showToast(
      dayNumber 
        ? `Day ${dayNumber}: Indoor wet-weather contingency activated!` 
        : 'Smart Rainy Day contingency active: outdoor slots swapped for indoor venues!'
    );
  };

  // Non-destructive Revert back to Sunny Day Itinerary
  const revertRainContingency = (dayNumber?: number) => {
    if (originalSunnyItineraryDays.length === 0) return;

    if (dayNumber !== undefined) {
      const originalDay = originalSunnyItineraryDays.find((d) => d.dayNumber === dayNumber);
      if (originalDay) {
        setItineraryDays((prev) => 
          prev.map((d) => (d.dayNumber === dayNumber ? JSON.parse(JSON.stringify(originalDay)) : d))
        );
        showToast(`Day ${dayNumber} reverted to original outdoor plan.`);
      }
    } else {
      setItineraryDays(JSON.parse(JSON.stringify(originalSunnyItineraryDays)));
      showToast('All days reverted to sunny-day outdoor itinerary.');
    }
  };

  const moveActivity = (dayIndex: number, actIndex: number, direction: 'up' | 'down') => {
    setItineraryDays((prev) => {
      const newDays = [...prev];
      const targetDay = { ...newDays[dayIndex] };
      const acts = [...targetDay.activities];

      const newIndex = direction === 'up' ? actIndex - 1 : actIndex + 1;
      if (newIndex < 0 || newIndex >= acts.length) return prev;

      const temp = acts[actIndex];
      acts[actIndex] = acts[newIndex];
      acts[newIndex] = temp;

      targetDay.activities = acts;
      newDays[dayIndex] = targetDay;
      return newDays;
    });
  };

  const deleteActivity = (dayIndex: number, actId: string) => {
    setItineraryDays((prev) => {
      const newDays = [...prev];
      const targetDay = { ...newDays[dayIndex] };
      targetDay.activities = targetDay.activities.filter((a) => a.id !== actId);
      newDays[dayIndex] = targetDay;
      return newDays;
    });
    showToast('Activity removed from timeline');
  };

  const addActivity = (dayIndex: number, act: Omit<ActivityItem, 'id'>) => {
    const newId = `act_custom_${Date.now()}`;
    const newActivity: ActivityItem = { ...act, id: newId };
    setItineraryDays((prev) => {
      const newDays = [...prev];
      const targetDay = { ...newDays[dayIndex] };
      targetDay.activities = [...targetDay.activities, newActivity];
      newDays[dayIndex] = targetDay;
      return newDays;
    });
    showToast(`Added: ${act.title}`);
  };

  const editActivity = (dayIndex: number, actId: string, updates: Partial<ActivityItem>) => {
    setItineraryDays((prev) => {
      const newDays = [...prev];
      const targetDay = { ...newDays[dayIndex] };
      targetDay.activities = targetDay.activities.map((a) => (a.id === actId ? { ...a, ...updates } : a));
      newDays[dayIndex] = targetDay;
      return newDays;
    });
  };

  // Book Item
  const bookItem = async (params: {
    type: 'flight' | 'hotel' | 'transit' | 'ticket';
    item: any;
  }) => {
    const { type, item } = params;
    const amount = item.totalPrice || item.pricePerPerson || item.price || 0;
    const title = item.name || item.title || `${item.airline} ${item.flightNumber}`;

    const confirmation = await executeSimulatedBooking({
      itemType: type,
      itemId: item.id,
      title,
      amount,
      currency: preferences.currency
    });

    setBookingState((prev) => {
      const newHistory = [confirmation, ...prev.bookingHistory];

      if (type === 'flight') {
        return { ...prev, flight: item, bookingHistory: newHistory };
      }
      if (type === 'hotel') {
        return { ...prev, hotel: { ...item, isBooked: true, confirmationCode: confirmation.referenceCode }, bookingHistory: newHistory };
      }
      if (type === 'transit') {
        const updatedTransit = [...prev.transitPasses.filter((t) => t.id !== item.id), { ...item, isBooked: true, confirmationCode: confirmation.referenceCode }];
        return { ...prev, transitPasses: updatedTransit, bookingHistory: newHistory };
      }
      if (type === 'ticket') {
        const updatedTickets = [...prev.attractionTickets.filter((t) => t.id !== item.id), { ...item, isBooked: true, confirmationCode: confirmation.referenceCode }];
        return { ...prev, attractionTickets: updatedTickets, bookingHistory: newHistory };
      }
      return { ...prev, bookingHistory: newHistory };
    });

    showToast(`Confirmed! Ref: ${confirmation.referenceCode}`);
    return { referenceCode: confirmation.referenceCode };
  };

  const unbookItem = (type: 'hotel' | 'transit' | 'ticket', itemId: string) => {
    setBookingState((prev) => {
      if (type === 'hotel') {
        return { ...prev, hotel: undefined };
      }
      if (type === 'transit') {
        return { ...prev, transitPasses: prev.transitPasses.filter((t) => t.id !== itemId) };
      }
      if (type === 'ticket') {
        return { ...prev, attractionTickets: prev.attractionTickets.filter((t) => t.id !== itemId) };
      }
      return prev;
    });
    showToast('Reservation removed from active bookings');
  };

  // Master Financials
  const budgetBreakdown = React.useMemo(() => {
    const flightCost = selectedFlight ? selectedFlight.totalPrice : 0;
    const hotelCost = bookingState.hotel ? bookingState.hotel.totalPrice : 0;
    const transitCost = bookingState.transitPasses.reduce((acc, curr) => acc + curr.totalPrice, 0);
    const ticketsCost = bookingState.attractionTickets.reduce((acc, curr) => acc + curr.totalPrice, 0);
    
    // Sum activities cost
    const activitiesCost = itineraryDays.reduce((daySum, d) => {
      return daySum + d.activities.reduce((actSum, a) => actSum + (a.cost || 0), 0);
    }, 0);

    const totalCommitted = flightCost + hotelCost + transitCost + ticketsCost + activitiesCost;
    const remainingBalance = preferences.totalBudget - totalCommitted;

    return {
      allocatedBudget: preferences.totalBudget,
      committedFlights: flightCost,
      committedHotels: hotelCost,
      committedTransit: transitCost,
      committedTickets: ticketsCost,
      committedActivities: activitiesCost,
      totalCommitted,
      remainingBalance,
      isOverBudget: remainingBalance < 0
    };
  }, [preferences.totalBudget, selectedFlight, bookingState, itineraryDays]);

  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPreferences(DEFAULT_PREFERENCES);
    setSelectedDestination(null);
    setSelectedFlight(null);
    setItineraryDays([]);
    setOriginalSunnyItineraryDays([]);
    setBookingState({
      transitPasses: [],
      attractionTickets: [],
      bookingHistory: []
    });
    setActiveTab('discovery');
    showToast('Trip workspace reset to default');
    refreshDiscovery();
  };

  return (
    <TripContext.Provider
      value={{
        activeTab,
        setActiveTab,
        preferences,
        updatePreferences,
        proposals,
        isDiscovering,
        selectedDestination,
        selectDestination,
        refreshDiscovery,
        flightOptions,
        selectedFlight,
        isLoadingFlights,
        selectFlight,
        confirmDestinationAndFlights,
        itineraryDays,
        isLoadingItinerary,
        activeDayIndex,
        setActiveDayIndex,
        toggleRainContingency,
        revertRainContingency,
        moveActivity,
        deleteActivity,
        addActivity,
        editActivity,
        accommodations,
        transitPasses,
        attractionTickets,
        isLoadingLogistics,
        bookingState,
        bookItem,
        unbookItem,
        budgetBreakdown,
        toastMessage,
        showToast,
        resetAll
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
