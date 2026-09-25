import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { formatPrice } from '../../services/mcpClient';
import { BookingModal } from '../modals/BookingModal';
import { 
  Building, 
  Train, 
  Ticket, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Trash2,
  Sparkles,
  CreditCard,
  Search,
  ExternalLink,
  Zap,
  Loader2
} from 'lucide-react';

export const LogisticsTab: React.FC = () => {
  const { 
    selectedDestination, 
    accommodations, 
    transitPasses, 
    attractionTickets, 
    bookingState, 
    unbookItem, 
    preferences, 
    setActiveTab 
  } = useTrip();

  const [activeCategory, setActiveCategory] = useState<'all' | 'hotels' | 'transit' | 'tickets'>('all');
  const [modalTarget, setModalTarget] = useState<{
    type: 'flight' | 'hotel' | 'transit' | 'ticket';
    item: any;
  } | null>(null);

  // MoodTrip AI Hotel MCP state
  const [moodtripHotels, setMoodtripHotels] = useState<any[]>([]);
  const [moodtripQuery, setMoodtripQuery] = useState('');
  const [isSearchingMoodtrip, setIsSearchingMoodtrip] = useState(false);
  const [hasSearchedMoodtrip, setHasSearchedMoodtrip] = useState(false);

  const handleSearchMoodtrip = async (customQuery?: string) => {
    if (!selectedDestination) return;
    const query = customQuery !== undefined ? customQuery : moodtripQuery;
    setIsSearchingMoodtrip(true);
    try {
      const res = await fetch(`/api/mcp/hotels?city=${encodeURIComponent(selectedDestination.city)}&query=${encodeURIComponent(query)}&limit=4`);
      const data = await res.json();
      if (data.success && data.hotels) {
        setMoodtripHotels(data.hotels);
      }
    } catch (e) {
      console.error('MoodTrip search error:', e);
    } finally {
      setIsSearchingMoodtrip(false);
      setHasSearchedMoodtrip(true);
    }
  };

  if (!selectedDestination) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-950 text-center">
        <div className="max-w-md space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-cyan-400">
            <Building className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white font-display">No Destination Locked In</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Please pick a destination in Step 1 and verify flights in Step 2 to view curated accommodations, transit passes, and attraction tickets.
          </p>
          <button
            onClick={() => setActiveTab('discovery')}
            className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
          >
            <span>Go to Discovery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  const isHotelBooked = (id: string) => bookingState.hotel?.id === id;
  const isTransitBooked = (id: string) => bookingState.transitPasses.some((t) => t.id === id);
  const isTicketBooked = (id: string) => bookingState.attractionTickets.some((t) => t.id === id);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
      {/* Sub-header Filter & Navigation Bar */}
      <div className="h-12 px-6 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between shrink-0 gap-4">
        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-slate-800 text-cyan-300 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Logistics
          </button>
          <button
            onClick={() => setActiveCategory('hotels')}
            className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeCategory === 'hotels'
                ? 'bg-slate-800 text-cyan-300 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-3 h-3" />
            <span>Accommodations</span>
          </button>
          <button
            onClick={() => setActiveCategory('transit')}
            className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeCategory === 'transit'
                ? 'bg-slate-800 text-cyan-300 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Train className="w-3 h-3" />
            <span>Transit & Rail Passes</span>
          </button>
          <button
            onClick={() => setActiveCategory('tickets')}
            className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeCategory === 'tickets'
                ? 'bg-slate-800 text-cyan-300 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ticket className="w-3 h-3" />
            <span>Attraction VIP</span>
          </button>
        </div>

        {/* Master Summary CTA */}
        <button
          onClick={() => setActiveTab('summary')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
        >
          <span>Trip Summary & Share</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Scrollable Catalog Grid */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Section 1: Accommodations & Boutique Stays */}
          {(activeCategory === 'all' || activeCategory === 'hotels') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Building className="w-4 h-4 text-cyan-400" />
                    <span>Curated Accommodations & Ryokans</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Recommended properties in {selectedDestination.city} for {preferences.durationDays - 1 || 4} nights.
                  </p>
                </div>
              </div>

              {/* MoodTrip AI Hotel MCP Live Search Bar */}
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white">MoodTrip AI Live Hotel Search</span>
                      <span className="text-[10px] text-slate-400 ml-2 font-mono">Upstream: api.moodtrip.ai/api/mcp-http</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    MCP Protocol Active
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={moodtripQuery}
                      onChange={(e) => setMoodtripQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSearchMoodtrip(); }}
                      placeholder={`Describe your stay in ${selectedDestination.city} (e.g. "boutique ryokan with private garden onsen", "cliffside suite")...`}
                      className="w-full bg-slate-950 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    onClick={() => handleSearchMoodtrip()}
                    disabled={isSearchingMoodtrip}
                    className="px-3.5 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                  >
                    {isSearchingMoodtrip ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-3.5 h-3.5" />
                        <span>Search MoodTrip</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick prompt suggestions */}
                <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-400">
                  <span className="text-slate-500 text-[10px] uppercase font-mono">Suggested Vibe Prompts:</span>
                  {[
                    'Boutique stay with scenic views',
                    'Historic Ryokan with Onsen',
                    'Family suite with kids space',
                    'Luxury retreat with fine dining'
                  ].map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setMoodtripQuery(prompt);
                        handleSearchMoodtrip(prompt);
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {/* MoodTrip live search results */}
                {moodtripHotels.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <div className="text-[11px] font-mono text-indigo-300 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>MoodTrip AI Search Results ({moodtripHotels.length} live properties):</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {moodtripHotels.map((hotel, idx) => (
                        <div key={idx} className="rounded-lg border border-indigo-900/60 bg-slate-950/80 p-3 flex flex-col justify-between space-y-2.5">
                          <div className="space-y-2">
                            {hotel.imageUrl && (
                              <div className="h-28 rounded overflow-hidden bg-slate-900">
                                <img
                                  src={hotel.imageUrl}
                                  alt={hotel.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                />
                              </div>
                            )}
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                                Relevance: {hotel.relevance || '98%'}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {hotel.priceNote || 'Live Rate'}
                              </span>
                            </div>
                            <h5 className="text-xs font-bold text-white line-clamp-1">{hotel.name}</h5>
                          </div>

                          <a
                            href={hotel.bookingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded bg-indigo-600/80 hover:bg-indigo-600 text-white font-medium text-[11px] transition-colors"
                          >
                            <span>View & Book on MoodTrip</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accommodations.map((acc) => {
                  const booked = isHotelBooked(acc.id);
                  return (
                    <div
                      key={acc.id}
                      className={`rounded-lg border p-4.5 flex flex-col justify-between transition-all bg-slate-900/80 ${
                        booked
                          ? 'border-emerald-500/80 ring-1 ring-emerald-500/40 bg-emerald-950/15'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[11px] font-mono text-cyan-400 font-medium">
                            {acc.type}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] font-mono text-amber-300">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{acc.rating}</span>
                            <span className="text-slate-500">({acc.reviewCount})</span>
                          </div>
                        </div>

                        <h4 className="text-base font-bold font-display text-white">{acc.name}</h4>
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{acc.neighborhood}</span>
                        </div>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {acc.amenities.map((amenity, i) => (
                            <span
                              key={i}
                              className="text-[11px] text-slate-300 bg-slate-950/70 border border-slate-800 px-2 py-0.5 rounded"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>

                        <div className="text-[11px] text-emerald-400/90 pt-1">
                          ✓ Free cancellation until {acc.freeCancellationUntil}
                        </div>
                      </div>

                      {/* Pricing & Booking CTA */}
                      <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold font-mono text-cyan-300">
                            {formatPrice(acc.totalPrice, preferences.currency)}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {formatPrice(acc.pricePerNight, preferences.currency)} / night ({acc.totalNights} nights)
                          </div>
                        </div>

                        {booked ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Booked</span>
                            </span>
                            <button
                              onClick={() => unbookItem('hotel', acc.id)}
                              className="p-1.5 rounded hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                              title="Cancel Reservation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setModalTarget({ type: 'hotel', item: acc })}
                            className="px-3.5 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                          >
                            Book Room
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Transit Passes & Rail Cards */}
          {(activeCategory === 'all' || activeCategory === 'transit') && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Train className="w-4 h-4 text-cyan-400" />
                  <span>Public Transit & Regional Rail Passes</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  High-speed bullet trains, subways, ferries and local transit passes for your party.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transitPasses.map((pass) => {
                  const booked = isTransitBooked(pass.id);
                  return (
                    <div
                      key={pass.id}
                      className={`rounded-lg border p-4.5 flex flex-col justify-between transition-all bg-slate-900/80 ${
                        booked
                          ? 'border-emerald-500/80 ring-1 ring-emerald-500/40 bg-emerald-950/15'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-cyan-400 font-semibold">{pass.validity}</span>
                          <span className="text-[11px] text-slate-400">{pass.coverage}</span>
                        </div>

                        <h4 className="text-base font-bold font-display text-white">{pass.name}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{pass.description}</p>

                        <div className="space-y-1 pt-1">
                          {pass.perks.map((perk, i) => (
                            <div key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                              <span className="text-cyan-400 font-bold">›</span>
                              <span>{perk}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold font-mono text-cyan-300">
                            {formatPrice(pass.totalPrice, preferences.currency)}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {formatPrice(pass.pricePerPerson, preferences.currency)} / person ({preferences.partySize} travelers)
                          </div>
                        </div>

                        {booked ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Pass Issued</span>
                            </span>
                            <button
                              onClick={() => unbookItem('transit', pass.id)}
                              className="p-1.5 rounded hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                              title="Cancel Pass"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setModalTarget({ type: 'transit', item: pass })}
                            className="px-3.5 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                          >
                            Get Pass
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: Attraction Ticketing & Fast-Track Passes */}
          {(activeCategory === 'all' || activeCategory === 'tickets') && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-cyan-400" />
                  <span>Attraction VIP & Timed Entry Passes</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Skip ticket lines at top cultural institutions, imperial monuments, and wellness retreats.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attractionTickets.map((ticket) => {
                  const booked = isTicketBooked(ticket.id);
                  return (
                    <div
                      key={ticket.id}
                      className={`rounded-lg border p-4.5 flex flex-col justify-between transition-all bg-slate-900/80 ${
                        booked
                          ? 'border-emerald-500/80 ring-1 ring-emerald-500/40 bg-emerald-950/15'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-cyan-400 font-semibold">{ticket.entryType}</span>
                          <span className="text-[11px] text-slate-400">{ticket.venue}</span>
                        </div>

                        <h4 className="text-base font-bold font-display text-white">{ticket.title}</h4>

                        <div className="space-y-1 pt-1">
                          {ticket.perks.map((perk, i) => (
                            <div key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                              <span className="text-cyan-400 font-bold">›</span>
                              <span>{perk}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold font-mono text-cyan-300">
                            {formatPrice(ticket.totalPrice, preferences.currency)}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {formatPrice(ticket.pricePerPerson, preferences.currency)} / ticket ({preferences.partySize} travelers)
                          </div>
                        </div>

                        {booked ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Reserved</span>
                            </span>
                            <button
                              onClick={() => unbookItem('ticket', ticket.id)}
                              className="p-1.5 rounded hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                              title="Cancel Ticket"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setModalTarget({ type: 'ticket', item: ticket })}
                            className="px-3.5 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                          >
                            Reserve Pass
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Checkout Modal */}
      <BookingModal
        isOpen={!!modalTarget}
        onClose={() => setModalTarget(null)}
        bookingTarget={modalTarget}
      />
    </div>
  );
};
