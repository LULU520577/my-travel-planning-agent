/**
 * Core Travel Planning Data Schemas & MCP Types
 */

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'CHF' | 'SGD';

export type TripVibe = 
  | 'Culture & Heritage'
  | 'Gastronomy & Street Food'
  | 'Scenic Nature & Lakes'
  | 'Mountain Hiking'
  | 'Coastal & Relaxation'
  | 'Architecture & Design'
  | 'Nightlife & Izakaya'
  | 'Family-Friendly';

export interface TripPreferences {
  currency: CurrencyCode;
  totalBudget: number;
  originCity: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  adultsCount: number;
  kidsCount: number;
  partySize: number;
  selectedVibes: TripVibe[];
  preferredPace: 'relaxed' | 'balanced' | 'intense';
}

export interface WeatherSummary {
  tempC: number;
  condition: string;
  rainProbability: number;
  icon: string;
  forecastNotice: string;
}

export interface DestinationProposal {
  id: string;
  name: string;
  city: string;
  country: string;
  region: string;
  tagline: string;
  heroImage: string;
  vibeMatchScore: number;
  peakSeasonIndicator: 'Peak' | 'Shoulder' | 'Off-Peak';
  seasonForecast: string;
  estimatedFlightCost: number;
  avgDailyBudget: number;
  weatherSummary: WeatherSummary;
  highlights: string[];
  mcpSource: string;
  matchReasons: string[];
}

export interface FlightOption {
  id: string;
  destinationId: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopCity?: string;
  baggageIncluded: boolean;
  pricePerPerson: number;
  totalPrice: number;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business';
  emissionKg: number;
  aircraft: string;
}

export interface RainyDayAlternative {
  id: string;
  title: string;
  location: string;
  duration: string;
  cost: number;
  isIndoor: true;
  category: 'museum' | 'covered-market' | 'workshop' | 'spa' | 'culinary' | 'historic-interior';
  description: string;
  rainAdvantage: string;
  operatingHours: string;
}

export interface ActivityItem {
  id: string;
  timeSlot: string;
  title: string;
  location: string;
  duration: string;
  cost: number;
  isIndoor: boolean;
  isAnchorEvent: boolean;
  isFamilyFriendly?: boolean;
  category: 'culture' | 'food' | 'nature' | 'entertainment' | 'workshop' | 'sightseeing';
  description: string;
  rainyAlternative?: RainyDayAlternative;
  isReplacedDueToRain?: boolean;
  originalActivity?: {
    title: string;
    location: string;
    description: string;
    cost: number;
    duration: string;
  };
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  dayOfWeek: string;
  title: string;
  theme: string;
  forecast: {
    tempC: number;
    condition: string;
    isRainy: boolean;
    rainProbability: number;
  };
  isRainContingencyActive: boolean;
  activities: ActivityItem[];
}

export interface AccommodationOption {
  id: string;
  destinationId: string;
  name: string;
  type: 'Boutique Hotel' | 'Traditional Ryokan' | 'Alpine Chalet' | 'Luxury Suite' | 'Design Hotel';
  neighborhood: string;
  pricePerNight: number;
  totalNights: number;
  totalPrice: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  freeCancellationUntil: string;
  imageUrl?: string;
  isBooked: boolean;
  confirmationCode?: string;
}

export interface TransitPassOption {
  id: string;
  destinationId: string;
  name: string;
  validity: string;
  pricePerPerson: number;
  totalPrice: number;
  description: string;
  coverage: string;
  perks: string[];
  isBooked: boolean;
  confirmationCode?: string;
}

export interface AttractionTicketOption {
  id: string;
  destinationId: string;
  title: string;
  venue: string;
  entryType: 'Skip-The-Line VIP' | 'Timed Entry Pass' | 'Guided Masterclass' | 'Panoramic Access';
  pricePerPerson: number;
  totalPrice: number;
  isBooked: boolean;
  confirmationCode?: string;
  perks: string[];
}

export interface BookingState {
  flight?: FlightOption;
  hotel?: AccommodationOption;
  transitPasses: TransitPassOption[];
  attractionTickets: AttractionTicketOption[];
  bookingHistory: {
    bookingId: string;
    timestamp: string;
    itemType: 'flight' | 'hotel' | 'transit' | 'ticket';
    itemName: string;
    referenceCode: string;
    amount: number;
    currency: CurrencyCode;
    qrPayload: string;
  }[];
}

export type PlanningTab = 
  | 'discovery'
  | 'confirmation'
  | 'itinerary'
  | 'logistics'
  | 'summary';
