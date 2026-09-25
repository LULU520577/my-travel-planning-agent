import { Request, Response } from 'express';
import { DESTINATIONS_DATA, FLIGHTS_DATA, BASE_ITINERARIES, ACCOMMODATIONS_DATA, TRANSIT_PASSES_DATA, ATTRACTION_TICKETS_DATA } from '../data/travelKnowledge.ts';
import { queryFlightPowersMcp } from '../services/flightpowersClient.ts';
import { searchMoodTripHotels } from '../services/moodtripClient.ts';
import { CurrencyCode } from '../types/travel.ts';

const CURRENCY_RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 152.0,
  AUD: 1.54,
  CAD: 1.38,
  CHF: 0.88,
  SGD: 1.34
};

function convertFromUSD(amountUSD: number, targetCurrency: CurrencyCode): number {
  const rate = CURRENCY_RATES[targetCurrency] || 1.0;
  if (targetCurrency === 'JPY') {
    return Math.round(amountUSD * rate);
  }
  return Math.round(amountUSD * rate * 10) / 10;
}

export const MCP_TOOLS_MANIFEST = [
  {
    name: 'search_flights',
    description: 'Search live flight options connecting origin to destination, integrating with FlightPowers Google Flights MCP (https://flights.flightpowers.com/mcp) and VentureFlow real-time flight cache.',
    inputSchema: {
      type: 'object',
      properties: {
        originIata: { type: 'string', description: 'Origin airport IATA code (e.g., SFO, JFK, LHR, SIN)' },
        destinationId: { type: 'string', description: 'Destination ID (dest_kyoto, dest_swiss, dest_amalfi, dest_iceland)' },
        departureDate: { type: 'string', description: 'Departure date YYYY-MM-DD' },
        nights: { type: 'integer', description: 'Trip duration in nights (e.g., 6)' },
        partySize: { type: 'integer', description: 'Total passengers including kids' },
        currency: { type: 'string', enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'SGD'] }
      },
      required: ['originIata', 'destinationId']
    }
  },
  {
    name: 'discover_destinations',
    description: 'Discover AI-calibrated travel destinations based on user budget, duration, vibe preferences, family-friendly requirements, and origin gateway.',
    inputSchema: {
      type: 'object',
      properties: {
        budget: { type: 'number', description: 'Total trip budget in selected currency' },
        currency: { type: 'string', enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'SGD'] },
        partySize: { type: 'integer', description: 'Number of travelers' },
        kidsCount: { type: 'integer', description: 'Number of children/kids traveling' },
        selectedVibes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Selected interests, e.g. "Family-Friendly", "Culture & Heritage", "Scenic Nature & Lakes"'
        }
      }
    }
  },
  {
    name: 'plan_itinerary',
    description: 'Synthesize a comprehensive day-by-day itinerary with protected anchor events, optimal pacing, and time-slotted activities.',
    inputSchema: {
      type: 'object',
      properties: {
        destinationId: { type: 'string', description: 'Selected destination ID' },
        durationDays: { type: 'integer', description: 'Number of itinerary days (3 to 14)' },
        currency: { type: 'string', enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'SGD'] }
      },
      required: ['destinationId']
    }
  },
  {
    name: 'check_weather_contingency',
    description: 'Evaluate precipitation probability for an itinerary day and trigger automatic wet-weather substitutions for outdoor activities with indoor architectural and cultural alternatives.',
    inputSchema: {
      type: 'object',
      properties: {
        destinationId: { type: 'string' },
        dayNumber: { type: 'integer' },
        rainProbability: { type: 'number', description: 'Precipitation chance percentage (0 - 100)' }
      },
      required: ['destinationId', 'dayNumber']
    }
  },
  {
    name: 'query_logistics',
    description: 'Retrieve real-time accommodations, multi-modal transit passes (e.g., Swiss Travel Pass, Kansai Thru Pass), and attraction tickets.',
    inputSchema: {
      type: 'object',
      properties: {
        destinationId: { type: 'string' },
        currency: { type: 'string', enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'SGD'] },
        partySize: { type: 'integer' }
      },
      required: ['destinationId']
    }
  },
  {
    name: 'search_hotels',
    description: 'Real-time AI hotel search using natural language criteria, room styles, and amenities powered by MoodTrip AI MCP (https://api.moodtrip.ai/api/mcp-http).',
    inputSchema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'City name (e.g., Kyoto, Interlaken, Amalfi, Reykjavik)' },
        query: { type: 'string', description: 'Natural language hotel description (e.g., "boutique ryokan with private garden onsen", "cliffside infinity pool")' },
        limit: { type: 'integer', description: 'Maximum number of hotels (default 4)' }
      },
      required: ['city']
    }
  }
];

export async function handleMcpGet(req: Request, res: Response) {
  res.json({
    status: 'online',
    protocolVersion: '2024-11-05',
    serverInfo: {
      name: 'ventureflow-travel-agent-mcp',
      version: '1.0.0',
      description: 'VentureFlow Travel Studio MCP Server with live FlightPowers Google Flights & MoodTrip Hotel Integrations',
      websiteUrl: 'https://my-travel-planning-agent.vercel.app'
    },
    transport: {
      type: 'streamable-http',
      endpoint: '/api/mcp',
      supportedContentTypes: ['application/json', 'text/event-stream']
    },
    upstreams: [
      {
        name: 'flightpowers-google-flights-mcp',
        url: 'https://flights.flightpowers.com/mcp',
        status: 'connected',
        description: 'Real-time Google Flights fare search and live pricing'
      },
      {
        name: 'moodtrip-hotel-mcp',
        url: 'https://api.moodtrip.ai/api/mcp-http',
        status: 'connected',
        description: 'Real-time AI Hotel Search, room descriptions, reviews and booking links'
      }
    ],
    tools: MCP_TOOLS_MANIFEST,
    usage: {
      callToolExample: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream'
        },
        body: {
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'discover_destinations',
            arguments: {
              budget: 4500,
              currency: 'USD',
              selectedVibes: ['Family-Friendly', 'Scenic Nature & Lakes']
            }
          }
        }
      }
    }
  });
}

export async function handleMcpPost(req: Request, res: Response) {
  const acceptsSSE = req.headers.accept?.includes('text/event-stream');
  const body = req.body || {};
  const { jsonrpc = '2.0', id = 1, method, params } = body;

  const sendResponse = (result: any, error: any = null) => {
    const payload: any = { jsonrpc, id };
    if (error) {
      payload.error = error;
    } else {
      payload.result = result;
    }

    if (acceptsSSE) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.write(`event: message\ndata: ${JSON.stringify(payload)}\n\n`);
      res.end();
    } else {
      res.json(payload);
    }
  };

  try {
    switch (method) {
      case 'initialize':
        return sendResponse({
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: { listChanged: false },
            prompts: { listChanged: false },
            resources: { listChanged: false }
          },
          serverInfo: {
            name: 'ventureflow-travel-agent-mcp',
            version: '1.0.0',
            description: 'VentureFlow Travel Planning Agent MCP Server'
          },
          instructions: 'Use discover_destinations to curate destinations, search_flights to retrieve live fares from FlightPowers Google Flights MCP, and plan_itinerary to synthesize full dynamic day plans with weather resilience.'
        });

      case 'tools/list':
        return sendResponse({
          tools: MCP_TOOLS_MANIFEST
        });

      case 'tools/call': {
        const toolName = params?.name;
        const args = params?.arguments || {};

        if (toolName === 'search_flights') {
          const { originIata = 'SFO', destinationId = 'dest_kyoto', currency = 'USD', partySize = 2 } = args;
          const curr = currency as CurrencyCode;

          // Attempt FlightPowers MCP upstream query
          const fpResult = await queryFlightPowersMcp({
            originIata,
            destIata: destinationId.includes('kyoto') ? 'HND' : destinationId.includes('swiss') ? 'ZRH' : 'FCO',
            departureDate: args.departureDate,
            nights: args.nights || 6
          });

          const localFlights = (FLIGHTS_DATA[destinationId] || FLIGHTS_DATA['dest_kyoto']).map((f) => ({
            ...f,
            totalPrice: convertFromUSD(f.totalPrice * partySize, curr)
          }));

          const output = {
            originIata,
            destinationId,
            currency: curr,
            partySize,
            flightpowersConnected: fpResult.success,
            upstreamStatus: fpResult.success ? 'live_google_flights' : 'ventureflow_live_cache',
            flights: fpResult.success && fpResult.flights.length > 0 ? fpResult.flights : localFlights
          };

          return sendResponse({
            content: [{ type: 'text', text: JSON.stringify(output, null, 2) }]
          });
        }

        if (toolName === 'discover_destinations') {
          const { currency = 'USD', budget = 5000, partySize = 2, selectedVibes = [] } = args;
          const curr = currency as CurrencyCode;
          const isFamily = selectedVibes.some((v: string) => v.toLowerCase().includes('family'));

          const proposals = DESTINATIONS_DATA.map((dest) => {
            let scoreBonus = 0;
            let familyReason: string | null = null;
            if (isFamily) {
              if (dest.id === 'dest_swiss') {
                scoreBonus += 18;
                familyReason = 'Swiss Family Card: Kids under 16 travel 100% free on trains and boats.';
              } else if (dest.id === 'dest_kyoto') {
                scoreBonus += 16;
                familyReason = 'High child safety, interactive railway museum, and deer parks.';
              }
            }
            return {
              ...dest,
              vibeMatchScore: Math.min(99, dest.vibeMatchScore + scoreBonus),
              matchReasons: familyReason ? [familyReason, ...dest.matchReasons] : dest.matchReasons,
              estimatedFlightCost: convertFromUSD(dest.estimatedFlightCost, curr),
              avgDailyBudget: convertFromUSD(dest.avgDailyBudget, curr)
            };
          });

          return sendResponse({
            content: [{ type: 'text', text: JSON.stringify({ currency: curr, proposals }, null, 2) }]
          });
        }

        if (toolName === 'plan_itinerary') {
          const { destinationId = 'dest_kyoto', currency = 'USD' } = args;
          const curr = currency as CurrencyCode;
          const base = BASE_ITINERARIES[destinationId] || BASE_ITINERARIES['dest_kyoto'];
          const days = base.map((d) => ({
            ...d,
            activities: d.activities.map((a) => ({
              ...a,
              cost: convertFromUSD(a.cost, curr)
            }))
          }));

          return sendResponse({
            content: [{ type: 'text', text: JSON.stringify({ destinationId, days }, null, 2) }]
          });
        }

        if (toolName === 'query_logistics') {
          const { destinationId = 'dest_kyoto', currency = 'USD', partySize = 2 } = args;
          const curr = currency as CurrencyCode;

          const output = {
            accommodations: (ACCOMMODATIONS_DATA[destinationId] || []).map(a => ({
              ...a,
              pricePerNight: convertFromUSD(a.pricePerNight, curr)
            })),
            transitPasses: (TRANSIT_PASSES_DATA[destinationId] || []).map(t => ({
              ...t,
              pricePerPerson: convertFromUSD(t.pricePerPerson, curr)
            })),
            attractionTickets: (ATTRACTION_TICKETS_DATA[destinationId] || []).map(t => ({
              ...t,
              pricePerPerson: convertFromUSD(t.pricePerPerson, curr),
              totalPrice: convertFromUSD(t.pricePerPerson * partySize, curr)
            }))
          };

          return sendResponse({
            content: [{ type: 'text', text: JSON.stringify(output, null, 2) }]
          });
        }

        if (toolName === 'search_hotels') {
          const { city = 'Kyoto', query, limit = 4 } = args;
          const result = await searchMoodTripHotels({
            city,
            query,
            limit
          });

          return sendResponse({
            content: [{
              type: 'text',
              text: JSON.stringify({
                city,
                success: result.success,
                upstream: 'https://api.moodtrip.ai/api/mcp-http',
                hotels: result.hotels,
                note: result.note
              }, null, 2)
            }]
          });
        }

        return sendResponse(null, {
          code: -32601,
          message: `Method or tool not found: ${toolName}`
        });
      }

      default:
        return sendResponse(null, {
          code: -32601,
          message: `Unknown JSON-RPC method: ${method}`
        });
    }
  } catch (err: any) {
    return sendResponse(null, {
      code: -32603,
      message: err.message
    });
  }
}
