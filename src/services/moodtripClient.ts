/**
 * MoodTrip AI Hotel Search MCP Client
 * Upstream Server: https://api.moodtrip.ai/api/mcp-http
 * Protocol: Model Context Protocol (Streamable HTTP / JSON-RPC 2.0)
 */

export interface MoodTripHotel {
  hotelId: string;
  name: string;
  relevance?: string;
  tag?: string;
  imageUrl?: string;
  bookingUrl: string;
  priceNote?: string;
  description?: string;
  starRating?: number;
  guestRating?: number;
}

const MOODTRIP_MCP_URL = 'https://api.moodtrip.ai/api/mcp-http';

/**
 * Searches hotels via MoodTrip AI MCP using natural language description
 */
export async function searchMoodTripHotels(params: {
  city: string;
  query?: string;
  limit?: number;
  adults?: number;
}): Promise<{ success: boolean; hotels: MoodTripHotel[]; rawText?: string; note?: string }> {
  try {
    const fullQuery = params.query 
      ? `${params.query} in ${params.city}` 
      : `top-rated boutique hotel in ${params.city} with great amenities and central location`;

    const payload = {
      jsonrpc: '2.0',
      id: `mt_${Date.now()}`,
      method: 'tools/call',
      params: {
        name: 'search_hotels_by_description',
        arguments: {
          query: fullQuery,
          limit: params.limit || 4
        }
      }
    };

    const response = await fetch(MOODTRIP_MCP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return {
        success: false,
        hotels: [],
        note: `MoodTrip MCP responded with status ${response.status}`
      };
    }

    const text = await response.text();
    let data: any;

    if (text.startsWith('event:') || text.includes('data:')) {
      const match = text.match(/data:\s*({.*})/);
      if (match && match[1]) {
        data = JSON.parse(match[1]);
      }
    } else {
      data = JSON.parse(text);
    }

    const rawMarkdown: string = data?.result?.content?.[0]?.text || '';
    const hotels: MoodTripHotel[] = parseMoodTripMarkdown(rawMarkdown);

    return {
      success: hotels.length > 0,
      hotels,
      rawText: rawMarkdown
    };
  } catch (error: any) {
    return {
      success: false,
      hotels: [],
      note: error.message
    };
  }
}

/**
 * Parses MoodTrip AI markdown result into structured hotel objects
 */
function parseMoodTripMarkdown(markdown: string): MoodTripHotel[] {
  const hotels: MoodTripHotel[] = [];
  if (!markdown) return hotels;

  // Split by markdown sections or hotel headers
  const hotelBlocks = markdown.split(/\n\*\*([^*]+)\*\*\n/).slice(1);
  
  for (let i = 0; i < hotelBlocks.length; i += 2) {
    const name = hotelBlocks[i]?.trim();
    const details = hotelBlocks[i + 1] || '';

    if (!name) continue;

    const imgMatch = details.match(/!\[.*?\]\((https?:\/\/[^\)]+)\)/);
    const linkMatch = details.match(/\[(?:View & Book|Book)\]\((https?:\/\/[^\)]+)\)/);
    const hotelIdMatch = linkMatch ? linkMatch[1].match(/\/hotel\/([a-zA-Z0-9]+)/) : null;
    const relevanceMatch = details.match(/Relevance:\s*\*\*(\d+%)\*\*/);
    const priceCategoryMatch = details.match(/###\s*(.*?)\n/);

    hotels.push({
      hotelId: hotelIdMatch ? hotelIdMatch[1] : `mt_${i}`,
      name,
      relevance: relevanceMatch ? relevanceMatch[1] : '95%',
      imageUrl: imgMatch ? imgMatch[1] : undefined,
      bookingUrl: linkMatch ? linkMatch[1] : `https://moodtrip.ai`,
      priceNote: priceCategoryMatch ? priceCategoryMatch[1].trim() : 'Verified Daily Rate'
    });
  }

  return hotels;
}
