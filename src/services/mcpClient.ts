import { 
  CurrencyCode, 
  DestinationProposal, 
  FlightOption, 
  ItineraryDay, 
  AccommodationOption, 
  TransitPassOption, 
  AttractionTicketOption, 
  TripPreferences 
} from '../types/travel';
import { 
  DESTINATIONS_DATA, 
  FLIGHTS_DATA, 
  BASE_ITINERARIES, 
  ACCOMMODATIONS_DATA, 
  TRANSIT_PASSES_DATA, 
  ATTRACTION_TICKETS_DATA 
} from '../data/travelKnowledge';

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF ',
  SGD: 'S$'
};

export const CURRENCY_RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 152.0,
  AUD: 1.54,
  CAD: 1.38,
  CHF: 0.88,
  SGD: 1.34
};

export function formatPrice(amount: number, currency: CurrencyCode): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  if (currency === 'JPY') {
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }
  return `${symbol}${Math.round(amount).toLocaleString()}`;
}

export function convertUSD(amountUSD: number, targetCurrency: CurrencyCode): number {
  const rate = CURRENCY_RATES[targetCurrency] || 1.0;
  if (targetCurrency === 'JPY') {
    return Math.round(amountUSD * rate);
  }
  return Math.round(amountUSD * rate * 10) / 10;
}

export async function fetchDiscoveredDestinations(prefs: TripPreferences): Promise<DestinationProposal[]> {
  try {
    const res = await fetch('/api/mcp/discover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currency: prefs.currency,
        budget: prefs.totalBudget,
        partySize: prefs.partySize,
        selectedVibes: prefs.selectedVibes,
        durationDays: prefs.durationDays
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.proposals && data.proposals.length > 0) {
      return data.proposals;
    }
  } catch (err) {
    console.warn('[MCP Client] Discover fallback activated:', err);
  }

  // Resilient fallback with dynamic conversion
  return DESTINATIONS_DATA.map((dest) => ({
    ...dest,
    estimatedFlightCost: convertUSD(dest.estimatedFlightCost, prefs.currency),
    avgDailyBudget: convertUSD(dest.avgDailyBudget, prefs.currency)
  }));
}

export async function fetchFlightsForDestination(
  destinationId: string, 
  originCity: string, 
  currency: CurrencyCode, 
  partySize: number
): Promise<FlightOption[]> {
  try {
    const res = await fetch(`/api/mcp/flights?destinationId=${encodeURIComponent(destinationId)}&originCity=${encodeURIComponent(originCity)}&currency=${currency}&partySize=${partySize}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.flights && data.flights.length > 0) {
      return data.flights;
    }
  } catch (err) {
    console.warn('[MCP Client] Flights fallback activated:', err);
  }

  const base = FLIGHTS_DATA[destinationId] || FLIGHTS_DATA['dest_kyoto'];
  return base.map((fl) => {
    const price = convertUSD(fl.pricePerPerson, currency);
    return {
      ...fl,
      pricePerPerson: price,
      totalPrice: price * partySize,
      departureAirport: originCity ? `${originCity} Intl` : fl.departureAirport
    };
  });
}

export async function fetchItineraryForDestination(
  destinationId: string, 
  currency: CurrencyCode
): Promise<ItineraryDay[]> {
  try {
    const res = await fetch(`/api/mcp/itinerary?destinationId=${encodeURIComponent(destinationId)}&currency=${currency}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.itineraryDays && data.itineraryDays.length > 0) {
      return data.itineraryDays;
    }
  } catch (err) {
    console.warn('[MCP Client] Itinerary fallback activated:', err);
  }

  const base = BASE_ITINERARIES[destinationId] || BASE_ITINERARIES['dest_kyoto'];
  return base.map((day) => ({
    ...day,
    activities: day.activities.map((act) => ({
      ...act,
      cost: convertUSD(act.cost, currency),
      rainyAlternative: act.rainyAlternative ? {
        ...act.rainyAlternative,
        cost: convertUSD(act.rainyAlternative.cost, currency)
      } : undefined
    }))
  }));
}

export async function requestWetWeatherReplan(
  destinationId: string, 
  day: ItineraryDay
): Promise<ItineraryDay> {
  try {
    const res = await fetch('/api/mcp/wet-weather-replan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destinationId,
        itineraryDay: day
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.replannedDay) {
      return data.replannedDay;
    }
  } catch (err) {
    console.warn('[MCP Client] Weather replan fallback activated:', err);
  }

  // Client-side fallback: Replan replacing non-anchor outdoor items
  const clonedDay = JSON.parse(JSON.stringify(day)) as ItineraryDay;
  clonedDay.activities = clonedDay.activities.map((act) => {
    if (act.isAnchorEvent || act.isIndoor || !act.rainyAlternative) {
      return act;
    }
    const alt = act.rainyAlternative;
    return {
      id: `repl_${act.id}`,
      timeSlot: act.timeSlot,
      title: `[Rain Plan] ${alt.title}`,
      location: alt.location,
      duration: alt.duration,
      cost: alt.cost,
      isIndoor: true,
      isAnchorEvent: false,
      category: act.category,
      description: `${alt.description} (${alt.rainAdvantage})`,
      rainyAlternative: alt,
      isReplacedDueToRain: true,
      originalActivity: {
        title: act.title,
        location: act.location,
        description: act.description,
        cost: act.cost,
        duration: act.duration
      }
    };
  });
  clonedDay.isRainContingencyActive = true;
  return clonedDay;
}

export async function fetchLogisticsCatalog(
  destinationId: string, 
  currency: CurrencyCode, 
  partySize: number
): Promise<{
  accommodations: AccommodationOption[];
  transitPasses: TransitPassOption[];
  attractionTickets: AttractionTicketOption[];
}> {
  try {
    const res = await fetch(`/api/mcp/logistics?destinationId=${encodeURIComponent(destinationId)}&currency=${currency}&partySize=${partySize}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.accommodations) {
      return {
        accommodations: data.accommodations,
        transitPasses: data.transitPasses,
        attractionTickets: data.attractionTickets
      };
    }
  } catch (err) {
    console.warn('[MCP Client] Logistics fallback activated:', err);
  }

  const accs = (ACCOMMODATIONS_DATA[destinationId] || ACCOMMODATIONS_DATA['dest_kyoto']).map((acc) => {
    const p = convertUSD(acc.pricePerNight, currency);
    return {
      ...acc,
      pricePerNight: p,
      totalPrice: p * acc.totalNights
    };
  });

  const passes = (TRANSIT_PASSES_DATA[destinationId] || TRANSIT_PASSES_DATA['dest_kyoto']).map((tp) => {
    const p = convertUSD(tp.pricePerPerson, currency);
    return {
      ...tp,
      pricePerPerson: p,
      totalPrice: p * partySize
    };
  });

  const tickets = (ATTRACTION_TICKETS_DATA[destinationId] || ATTRACTION_TICKETS_DATA['dest_kyoto']).map((att) => {
    const p = convertUSD(att.pricePerPerson, currency);
    return {
      ...att,
      pricePerPerson: p,
      totalPrice: p * partySize
    };
  });

  return {
    accommodations: accs,
    transitPasses: passes,
    attractionTickets: tickets
  };
}

export async function executeSimulatedBooking(params: {
  itemType: 'flight' | 'hotel' | 'transit' | 'ticket';
  itemId: string;
  title: string;
  amount: number;
  currency: CurrencyCode;
}) {
  try {
    const res = await fetch('/api/mcp/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.booking) {
      return data.booking;
    }
  } catch (err) {
    console.warn('[MCP Client] Booking fallback activated:', err);
  }

  const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
  const ref = `VF-${params.itemType.toUpperCase().substring(0, 3)}-${randomHex}`;
  return {
    bookingId: `bk_${Date.now()}`,
    itemType: params.itemType,
    itemId: params.itemId,
    itemName: params.title,
    referenceCode: ref,
    amount: params.amount,
    currency: params.currency,
    timestamp: new Date().toISOString(),
    status: 'confirmed' as const,
    qrPayload: `VENTUREFLOW:${ref}:${params.itemId}:${params.amount}${params.currency}`
  };
}
