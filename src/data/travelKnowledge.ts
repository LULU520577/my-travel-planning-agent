import { DestinationProposal, FlightOption, AccommodationOption, TransitPassOption, AttractionTicketOption, ItineraryDay } from '../types/travel';

export const DESTINATIONS_DATA: DestinationProposal[] = [
  {
    id: 'dest_kyoto',
    name: 'Kyoto & Kansai Cultural Basin',
    city: 'Kyoto',
    country: 'Japan',
    region: 'East Asia',
    tagline: 'Centuries of Zen aesthetics, bamboo groves, lantern-lit alleys & machiya dining',
    heroImage: '/src/assets/images/dest_kyoto_1790310388465.jpg',
    vibeMatchScore: 98,
    peakSeasonIndicator: 'Shoulder',
    seasonForecast: 'Mild autumn foliage onset (19°C – 23°C), crisp evenings',
    estimatedFlightCost: 890,
    avgDailyBudget: 145,
    weatherSummary: {
      tempC: 21,
      condition: 'Pleasantly Clear with Intermittent Showers',
      rainProbability: 28,
      icon: 'cloud-sun-rain',
      forecastNotice: '35% chance of seasonal showers on Day 2 & Day 4'
    },
    highlights: [
      'Gion & Pontocho evening lantern walks',
      'Arashiyama bamboo path & tenryu-ji gardens',
      'Fushimi Inari vermilion torii gates',
      'Matcha ceremony in 300-year-old teahouse'
    ],
    mcpSource: 'Smithery AI MCP Flight & Weather Service (KIX/HND Gateway)',
    matchReasons: [
      'Strongest alignment with Culture, Gastronomy & Architecture',
      'Shoulder season avoids peak Golden Week crowds',
      'World-class indoor contingency network of covered arcades and temple halls'
    ]
  },
  {
    id: 'dest_swiss',
    name: 'Bernese Oberland & Lucerne',
    city: 'Interlaken / Lucerne',
    country: 'Switzerland',
    region: 'Central Europe',
    tagline: 'Glacial alpine crests, turquoise fjord-like lakes and panoramic cogwheel railways',
    heroImage: '/src/assets/images/dest_swiss_1790310405210.jpg',
    vibeMatchScore: 94,
    peakSeasonIndicator: 'Shoulder',
    seasonForecast: 'Alpine crisp air (15°C – 18°C), crystal lake clarity',
    estimatedFlightCost: 960,
    avgDailyBudget: 210,
    weatherSummary: {
      tempC: 17,
      condition: 'Crisp Mountain Breeze with Alpine Clouds',
      rainProbability: 35,
      icon: 'cloud-rain',
      forecastNotice: 'Occasional mountain precipitation; ideal for covered lake cruisers & thermal baths'
    },
    highlights: [
      'Mount Pilatus cogwheel railway ascent',
      'Lake Lucerne vintage steamboat traverse',
      'Lauterbrunnen 72 waterfalls valley walk',
      'Artisan Swiss fondue & raclette cellar tasting'
    ],
    mcpSource: 'Smithery AI MCP Swiss Transport & MeteoBlue Hub',
    matchReasons: [
      'Matches Scenic Nature, Mountain Hiking & Relaxation',
      'Swiss Travel Pass covers seamless multi-modal transit (train, boat, cable car)',
      'Exceptional thermal bath & indoor panorama lounge backups'
    ]
  },
  {
    id: 'dest_amalfi',
    name: 'Amalfi Coast & Gulf of Naples',
    city: 'Positano & Amalfi',
    country: 'Italy',
    region: 'Southern Europe',
    tagline: 'Sun-drenched pastel cliffs, scented lemon terraces and Mediterranean azure waters',
    heroImage: '/src/assets/images/dest_amalfi_1790310418864.jpg',
    vibeMatchScore: 91,
    peakSeasonIndicator: 'Shoulder',
    seasonForecast: 'Pleasant Mediterranean sunshine (22°C – 26°C), warm sea breezes',
    estimatedFlightCost: 820,
    avgDailyBudget: 175,
    weatherSummary: {
      tempC: 24,
      condition: 'Mostly Sunny with Sea Mist',
      rainProbability: 18,
      icon: 'sun',
      forecastNotice: 'Very low rain probability; rare coastal squalls handled by cloistered villas'
    },
    highlights: [
      'Path of the Gods clifftop panorama hike',
      'Private Gozzo boat cruise to Capri Grottos',
      'Ravello Villa Rufolo cliffside gardens',
      'Wood-fired Neapolitan pizza & limoncello workshop'
    ],
    mcpSource: 'Smithery AI MCP SkyScanner & Mediterranean Weather Gateway',
    matchReasons: [
      'Top choice for Coastal Vibe, Gastronomy & Scenic Leisure',
      'Shoulder season offers calm waters with pleasant 24°C warmth',
      'Direct coastal ferry connectivity and cliffside wine cellars'
    ]
  },
  {
    id: 'dest_iceland',
    name: 'Reykjavik & The Golden Glaciers',
    city: 'Reykjavik',
    country: 'Iceland',
    region: 'Nordic',
    tagline: 'Geothermal azure lagoons, thundering basalt falls and early aurora borealis skies',
    heroImage: '/src/assets/images/dest_iceland_1790310431505.jpg',
    vibeMatchScore: 89,
    peakSeasonIndicator: 'Off-Peak',
    seasonForecast: 'Crisp Nordic autumn (8°C – 12°C), prime auroral activity onset',
    estimatedFlightCost: 750,
    avgDailyBudget: 190,
    weatherSummary: {
      tempC: 10,
      condition: 'Brisk Northern Wind & Passing Mist',
      rainProbability: 42,
      icon: 'cloud-drizzle',
      forecastNotice: 'Variable sub-arctic weather; hot springs and lava tunnels are rain-proof'
    },
    highlights: [
      'Blue Lagoon silica mineral geothermal soak',
      'Gullfoss waterfall & Strokkur erupting geyser',
      'Thingvellir rift valley tectonic walk',
      'Reykjavik modern Nordic culinary discovery'
    ],
    mcpSource: 'Smithery AI MCP Nordic OpenMeteo & Flight Connector',
    matchReasons: [
      'Incomparable for Dramatic Nature & Geothermal Wellness',
      'Great off-peak flight pricing from North America and Europe',
      'Geothermal spas are exhilarating regardless of rain or mist'
    ]
  }
];

export const FLIGHTS_DATA: Record<string, FlightOption[]> = {
  dest_kyoto: [
    {
      id: 'fl_kyo_01',
      destinationId: 'dest_kyoto',
      airline: 'Japan Airlines (JAL)',
      flightNumber: 'JL 067',
      departureAirport: 'SFO (San Francisco Intl)',
      arrivalAirport: 'KIX (Kansai Intl, Osaka/Kyoto)',
      departureTime: '11:45 AM',
      arrivalTime: '03:30 PM (+1d)',
      duration: '11h 45m',
      stops: 0,
      baggageIncluded: true,
      pricePerPerson: 920,
      totalPrice: 920,
      cabinClass: 'Economy',
      emissionKg: 540,
      aircraft: 'Boeing 787-9 Dreamliner'
    },
    {
      id: 'fl_kyo_02',
      destinationId: 'dest_kyoto',
      airline: 'All Nippon Airways (ANA)',
      flightNumber: 'NH 107',
      departureAirport: 'SFO (San Francisco Intl)',
      arrivalAirport: 'ITM (Osaka Itami / Kyoto Express)',
      departureTime: '01:15 PM',
      arrivalTime: '05:40 PM (+1d)',
      duration: '12h 25m',
      stops: 1,
      stopCity: 'Tokyo (HND)',
      baggageIncluded: true,
      pricePerPerson: 865,
      totalPrice: 865,
      cabinClass: 'Economy',
      emissionKg: 510,
      aircraft: 'Boeing 777-300ER'
    },
    {
      id: 'fl_kyo_03',
      destinationId: 'dest_kyoto',
      airline: 'Singapore Airlines',
      flightNumber: 'SQ 035',
      departureAirport: 'SFO (San Francisco Intl)',
      arrivalAirport: 'KIX (Kansai Intl)',
      departureTime: '10:00 PM',
      arrivalTime: '06:15 AM (+2d)',
      duration: '14h 15m',
      stops: 1,
      stopCity: 'Tokyo (NRT)',
      baggageIncluded: true,
      pricePerPerson: 1040,
      totalPrice: 1040,
      cabinClass: 'Premium Economy',
      emissionKg: 620,
      aircraft: 'Airbus A350-900'
    }
  ],
  dest_swiss: [
    {
      id: 'fl_swi_01',
      destinationId: 'dest_swiss',
      airline: 'SWISS International Air Lines',
      flightNumber: 'LX 039',
      departureAirport: 'SFO (San Francisco Intl)',
      arrivalAirport: 'ZRH (Zurich Airport / Lucerne Link)',
      departureTime: '07:20 PM',
      arrivalTime: '03:40 PM (+1d)',
      duration: '11h 20m',
      stops: 0,
      baggageIncluded: true,
      pricePerPerson: 980,
      totalPrice: 980,
      cabinClass: 'Economy',
      emissionKg: 530,
      aircraft: 'Boeing 777-300ER'
    },
    {
      id: 'fl_swi_02',
      destinationId: 'dest_swiss',
      airline: 'Lufthansa',
      flightNumber: 'LH 455',
      departureAirport: 'SFO (San Francisco Intl)',
      arrivalAirport: 'ZRH (Zurich Airport)',
      departureTime: '02:40 PM',
      arrivalTime: '11:15 AM (+1d)',
      duration: '12h 35m',
      stops: 1,
      stopCity: 'Frankfurt (FRA)',
      baggageIncluded: true,
      pricePerPerson: 890,
      totalPrice: 890,
      cabinClass: 'Economy',
      emissionKg: 560,
      aircraft: 'Airbus A340-600'
    }
  ],
  dest_amalfi: [
    {
      id: 'fl_ama_01',
      destinationId: 'dest_amalfi',
      airline: 'ITA Airways & Delta',
      flightNumber: 'AZ 609',
      departureAirport: 'SFO (San Francisco Intl)',
      arrivalAirport: 'NAP (Naples Capodichino Intl)',
      departureTime: '04:10 PM',
      arrivalTime: '01:50 PM (+1d)',
      duration: '13h 40m',
      stops: 1,
      stopCity: 'Rome (FCO)',
      baggageIncluded: true,
      pricePerPerson: 840,
      totalPrice: 840,
      cabinClass: 'Economy',
      emissionKg: 580,
      aircraft: 'Airbus A350-900'
    },
    {
      id: 'fl_ama_02',
      destinationId: 'dest_amalfi',
      airline: 'Air France',
      flightNumber: 'AF 083',
      departureAirport: 'SFO (San Francisco Intl)',
      arrivalAirport: 'NAP (Naples Intl)',
      departureTime: '03:30 PM',
      arrivalTime: '02:20 PM (+1d)',
      duration: '14h 50m',
      stops: 1,
      stopCity: 'Paris (CDG)',
      baggageIncluded: true,
      pricePerPerson: 810,
      totalPrice: 810,
      cabinClass: 'Economy',
      emissionKg: 590,
      aircraft: 'Boeing 777-200'
    }
  ],
  dest_iceland: [
    {
      id: 'fl_ice_01',
      destinationId: 'dest_iceland',
      airline: 'Icelandair',
      flightNumber: 'FI 680',
      departureAirport: 'SFO (San Francisco Intl)',
      arrivalAirport: 'KEF (Keflavik Intl, Reykjavik)',
      departureTime: '03:15 PM',
      arrivalTime: '06:45 AM (+1d)',
      duration: '8h 30m',
      stops: 0,
      baggageIncluded: true,
      pricePerPerson: 750,
      totalPrice: 750,
      cabinClass: 'Economy',
      emissionKg: 430,
      aircraft: 'Boeing 737 MAX 8'
    }
  ]
};

export const BASE_ITINERARIES: Record<string, ItineraryDay[]> = {
  dest_kyoto: [
    {
      dayNumber: 1,
      date: 'Day 1',
      dayOfWeek: 'Monday',
      title: 'Historic Higashiyama & Twilight Gion',
      theme: 'Preserved Edo Architecture & Teahouse Culture',
      forecast: {
        tempC: 22,
        condition: 'Sunny & Pleasant',
        isRainy: false,
        rainProbability: 15
      },
      isRainContingencyActive: false,
      activities: [
        {
          id: 'act_k1_1',
          timeSlot: '09:00 AM - 11:30 AM',
          title: 'Kiyomizu-dera Temple & Wooden Veranda',
          location: 'Higashiyama, Kyoto',
          duration: '2.5 hrs',
          cost: 10,
          isIndoor: false,
          isAnchorEvent: false,
          category: 'culture',
          description: 'Explore the cantilevered wooden stage offering panoramic views across Kyoto and the sacred Otowa waterfall spring.',
          rainyAlternative: {
            id: 'rain_k1_1',
            title: 'Sanjusangendo Hall of 1001 Kannon Statues',
            location: 'Higashiyama interior',
            duration: '2 hrs',
            cost: 8,
            isIndoor: true,
            category: 'historic-interior',
            description: 'Step into Japan’s longest wooden hall housing 1,001 life-sized gilded statues of the Goddess of Mercy, completely sheltered from rain.',
            rainAdvantage: 'Completely indoor, meditative cedar scent, zero weather exposure',
            operatingHours: '08:30 AM - 05:00 PM'
          }
        },
        {
          id: 'act_k1_2',
          timeSlot: '12:00 PM - 02:00 PM',
          title: 'Ninenzaka & Sannenzaka Paved Walkways',
          location: 'Old Town Higashiyama',
          duration: '2 hrs',
          cost: 25,
          isIndoor: false,
          isAnchorEvent: false,
          category: 'sightseeing',
          description: 'Stroll cobblestone pedestrian alleys lined with traditional Japanese pottery shops, artisanal incense makers, and traditional tatami Starbucks.',
          rainyAlternative: {
            id: 'rain_k1_2',
            title: 'Kyoto Museum of Crafts & Design (Miyako Messe)',
            location: 'Okazaki Cultural District',
            duration: '2 hrs',
            cost: 15,
            isIndoor: true,
            category: 'museum',
            description: 'Witness live master demonstrations of 74 traditional Kyoto craft divisions: Nishijin silk weaving, lacquerware, and bamboo crafting under a modern glass roof.',
            rainAdvantage: 'Interactive indoor artisan demonstrations & curated sheltered gallery',
            operatingHours: '09:30 AM - 05:00 PM'
          }
        },
        {
          id: 'act_k1_3',
          timeSlot: '03:30 PM - 05:30 PM',
          title: 'Kodai-ji Zen Rock Garden & Bamboo Grove',
          location: 'Higashiyama Ward',
          duration: '2 hrs',
          cost: 12,
          isIndoor: false,
          isAnchorEvent: false,
          category: 'nature',
          description: 'Contemplate manicured raked gravel gardens, tranquil reflection ponds, and an intimate towering bamboo sanctuary.',
          rainyAlternative: {
            id: 'rain_k1_3',
            title: 'Artisan Matcha Tea Ceremony in Camellia Machiya',
            location: 'Ninenzaka Covered Teahouse',
            duration: '1.5 hrs',
            cost: 30,
            isIndoor: true,
            category: 'culinary',
            description: 'Immerse in an authentic, tranquil Urasenke tea ceremony inside a historic wooden machiya, listening to the gentle patter of raindrops against bamboo eaves.',
            rainAdvantage: 'Intimate rain acoustics, heated tatami room, warm artisanal matcha',
            operatingHours: '10:00 AM - 06:00 PM'
          }
        },
        {
          id: 'act_k1_4',
          timeSlot: '07:00 PM - 09:30 PM',
          title: 'Gion Evening Lantern Stroll & Geiko Heritage',
          location: 'Hanamikoji Street & Shirakawa Canal',
          duration: '2.5 hrs',
          cost: 45,
          isIndoor: false,
          isAnchorEvent: true, // Fixed Anchor
          category: 'culture',
          description: 'Special seasonal heritage walk through wooden geisha districts as red paper lanterns illuminate willow-lined canals (Protected Anchor Event).'
        }
      ]
    },
    {
      dayNumber: 2,
      date: 'Day 2',
      dayOfWeek: 'Tuesday',
      title: 'Arashiyama Bamboo & Sagano Scenic Trail',
      theme: 'Verdant Forests, River Valleys & Zen Aesthetics',
      forecast: {
        tempC: 18,
        condition: 'Overcast with 65% Rain Forecast',
        isRainy: true,
        rainProbability: 65
      },
      isRainContingencyActive: false,
      activities: [
        {
          id: 'act_k2_1',
          timeSlot: '08:30 AM - 10:30 AM',
          title: 'Arashiyama Sagano Bamboo Grove Walkway',
          location: 'Ukyo Ward, Kyoto',
          duration: '2 hrs',
          cost: 0,
          isIndoor: false,
          isAnchorEvent: false,
          category: 'nature',
          description: 'Early morning walk through the soaring jade-green bamboo stalks swaying in the morning mist.',
          rainyAlternative: {
            id: 'rain_k2_1',
            title: 'Kyoto Railway Museum (State-of-the-Art Covered Complex)',
            location: 'Umekoji Park Covered Complex',
            duration: '2 hrs',
            cost: 14,
            isIndoor: true,
            category: 'museum',
            description: 'Vast, architect-designed indoor rail heritage pavilion featuring 53 real steam and Shinkansen bullet trains with interactive indoor simulators.',
            rainAdvantage: '100% weather-proof colossal hall with glass viewing platforms',
            operatingHours: '10:00 AM - 05:00 PM'
          }
        },
        {
          id: 'act_k2_2',
          timeSlot: '11:00 AM - 01:30 PM',
          title: 'Tenryu-ji Sogenchi Landscape Garden & River Trail',
          location: 'Arashiyama',
          duration: '2.5 hrs',
          cost: 12,
          isIndoor: false,
          isAnchorEvent: false,
          category: 'culture',
          description: '14th-century pond garden framed by Mount Arashiyama, with weeping maples reflecting on tranquil waters.',
          rainyAlternative: {
            id: 'rain_k2_2',
            title: 'Nishiki Market Covered Arcade Gastronomy Safari',
            location: 'Central Kyoto Covered Arcade',
            duration: '2.5 hrs',
            cost: 35,
            isIndoor: true,
            category: 'covered-market',
            description: 'Kyoto’s 400-year-old "Kitchen" protected under a multi-colored stained glass awning: savor wagyu skewers, tamagoyaki, and sesame mochi dry and warm.',
            rainAdvantage: '5 blocks of completely covered roofed gourmet stalls, vibrant atmosphere',
            operatingHours: '09:30 AM - 06:00 PM'
          }
        },
        {
          id: 'act_k2_3',
          timeSlot: '03:00 PM - 05:30 PM',
          title: 'Hozugawa River Open-Air Boat Descent',
          location: 'Kameoka to Arashiyama',
          duration: '2.5 hrs',
          cost: 40,
          isIndoor: false,
          isAnchorEvent: false,
          category: 'nature',
          description: 'Traditional flat-bottom pole boat ride descending 16 kilometers of scenic mountain gorges and rapids.',
          rainyAlternative: {
            id: 'rain_k2_3',
            title: 'Kyoto National Museum & Heisei Chishinkan Wing',
            location: 'Higashiyama Cultural District',
            duration: '2 hrs',
            cost: 16,
            isIndoor: true,
            category: 'museum',
            description: 'Yoshio Taniguchi-designed museum wing showcasing National Treasures: illuminated Heian scrolls, Samurai armor, and Zen calligraphy.',
            rainAdvantage: 'Temperature-controlled architectural masterpiece with indoor cafe',
            operatingHours: '09:30 AM - 05:00 PM'
          }
        },
        {
          id: 'act_k2_4',
          timeSlot: '07:00 PM - 09:30 PM',
          title: 'Pontocho Alley Izakaya & Kaiseki Tasting',
          location: 'Pontocho, Kamogawa',
          duration: '2.5 hrs',
          cost: 65,
          isIndoor: true,
          isAnchorEvent: true, // Fixed Anchor
          category: 'food',
          description: 'Curated multi-course seasonal Kyoto dining in an atmospheric narrow alley overlooking the Kamogawa river.'
        }
      ]
    },
    {
      dayNumber: 3,
      date: 'Day 3',
      dayOfWeek: 'Wednesday',
      title: 'Vermilion Shrines & Sacred Fushimi Woods',
      theme: 'Spiritual Shinto Trails, Sake Breweries & Ancient Gates',
      forecast: {
        tempC: 20,
        condition: 'Clear Sky with Golden Sunlight',
        isRainy: false,
        rainProbability: 20
      },
      isRainContingencyActive: false,
      activities: [
        {
          id: 'act_k3_1',
          timeSlot: '07:30 AM - 10:30 AM',
          title: 'Fushimi Inari-Taisha Thousand Torii Path',
          location: 'Fushimi Ward, Kyoto',
          duration: '3 hrs',
          cost: 0,
          isIndoor: false,
          isAnchorEvent: false,
          category: 'culture',
          description: 'Hike through tunnels of 10,000 vibrant vermilion torii gates winding up the sacred forested mountain of Inari.',
          rainyAlternative: {
            id: 'rain_k3_1',
            title: 'Gekkeikan Okura Sake Museum & Tasting Cellar',
            location: 'Fushimi Brewery District',
            duration: '2 hrs',
            cost: 18,
            isIndoor: true,
            category: 'culinary',
            description: 'Tour 1637 timber sake cellars fed by pristine underground Fushimi spring water, with sake sommelier tasting flight of unpasteurized junmai daiginjo.',
            rainAdvantage: 'Cozy indoor wooden storehouse, complimentary tasting glass and 5 sakes',
            operatingHours: '09:30 AM - 04:30 PM'
          }
        },
        {
          id: 'act_k3_2',
          timeSlot: '12:00 PM - 02:30 PM',
          title: 'Nijo Castle & Ninomaru Palace Nightingale Floors',
          location: 'Nakagyo Ward, Kyoto',
          duration: '2.5 hrs',
          cost: 15,
          isIndoor: true,
          isAnchorEvent: false,
          category: 'culture',
          description: 'Shogun palace renowned for "nightingale floors" designed to chirp like birds when walked upon to thwart ninjas, plus Kano school gilded murals.'
        },
        {
          id: 'act_k3_3',
          timeSlot: '04:00 PM - 06:00 PM',
          title: 'Kamo Riverbank Sunset Cycling & Terrace Drinks',
          location: 'Kamogawa River Trail',
          duration: '2 hrs',
          cost: 15,
          isIndoor: false,
          isAnchorEvent: false,
          category: 'sightseeing',
          description: 'Breeze along scenic willow paths alongside locals and herons, watching the twilight settle over the eastern hills.',
          rainyAlternative: {
            id: 'rain_k3_3',
            title: 'Kurama Natural Onsen Hot Springs & Cedar Bath',
            location: 'Kurama Mountain Retreat (Indoor Bath Pavilion)',
            duration: '2.5 hrs',
            cost: 25,
            isIndoor: true,
            category: 'spa',
            description: 'Relax in natural volcanic mineral waters inside a covered wooden cedar onsen pavilion, watching raindrops drift into the mist of the pine forest.',
            rainAdvantage: 'Steaming hot baths in cool rain, panoramic covered mountain view',
            operatingHours: '10:00 AM - 09:00 PM'
          }
        },
        {
          id: 'act_k3_4',
          timeSlot: '07:30 PM - 10:00 PM',
          title: 'Traditional Gion Corner Kyo-Mai Cultural Performance',
          location: 'Yasaka Hall, Gion',
          duration: '2 hrs',
          cost: 35,
          isIndoor: true,
          isAnchorEvent: true, // Fixed Anchor
          category: 'entertainment',
          description: 'Live performance of 7 classical Japanese performing arts: Kyo-mai dance, Bunraku puppets, Gagaku imperial court music, and Kyogen farce.'
        }
      ]
    }
  ],
  dest_swiss: [
    {
      dayNumber: 1,
      date: 'Day 1',
      dayOfWeek: 'Monday',
      title: 'Lucerne Lake Vistas & Historic Chapel Bridge',
      theme: 'Lakeside Belle Époque Elegance & Medieval Towers',
      forecast: {
        tempC: 17,
        condition: 'Partly Cloudy with Lake Breeze',
        isRainy: false,
        rainProbability: 25
      },
      isRainContingencyActive: false,
      activities: [
        {
          id: 'act_s1_1',
          timeSlot: '09:00 AM - 11:30 AM',
          title: 'Old Town Lucerne & 14th-Century Chapel Bridge',
          location: 'Lucerne Historic Core',
          duration: '2.5 hrs',
          cost: 0,
          isIndoor: false,
          isAnchorEvent: false,
          category: 'sightseeing',
          description: 'Walk Europe’s oldest covered wooden footbridge and explore painted historic frescoed facades in the medieval quarter.',
          rainyAlternative: {
            id: 'rain_s1_1',
            title: 'Swiss Museum of Transport (Verkehrshaus der Schweiz)',
            location: 'Lidostrasse 5, Lucerne',
            duration: '2.5 hrs',
            cost: 32,
            isIndoor: true,
            category: 'museum',
            description: 'Switzerland’s most visited museum with over 3,000 transport items, planetarium, and Lindt Swiss Chocolate Adventure ride.',
            rainAdvantage: 'Extensive indoor interconnected pavilions with Swiss Chocolate ride',
            operatingHours: '10:00 AM - 05:00 PM'
          }
        },
        {
          id: 'act_s1_2',
          timeSlot: '01:00 PM - 04:30 PM',
          title: 'Mount Pilatus "Golden Round Trip" Cogwheel Railway',
          location: 'Alpnachstad to Pilatus Kulm (2,132m)',
          duration: '3.5 hrs',
          cost: 78,
          isIndoor: false,
          isAnchorEvent: true, // Fixed Anchor
          category: 'nature',
          description: 'World’s steepest cogwheel railway climbing 48% gradients to panoramic summit terrace overlooking 73 Alpine peaks.'
        },
        {
          id: 'act_s1_3',
          timeSlot: '06:30 PM - 09:30 PM',
          title: 'Cellar Fondue & Raclette at Wirtshaus Taube',
          location: 'Reuss Riverfront, Lucerne',
          duration: '2.5 hrs',
          cost: 55,
          isIndoor: true,
          isAnchorEvent: false,
          category: 'food',
          description: 'Warm Swiss Alpine comfort cuisine: melted Gruyère and Vacherin Fribourgeois cheese fondue with crusty rustic bread and Swiss white wine.'
        }
      ]
    },
    {
      dayNumber: 2,
      date: 'Day 2',
      dayOfWeek: 'Tuesday',
      title: 'Lauterbrunnen Valley of 72 Waterfalls & Wengen',
      theme: 'Glacier Cirques, Sheer Cliffs & Alpine Meadows',
      forecast: {
        tempC: 14,
        condition: 'Mountain Rain & Heavy Low Cloud Deck',
        isRainy: true,
        rainProbability: 75
      },
      isRainContingencyActive: false,
      activities: [
        {
          id: 'act_s2_1',
          timeSlot: '09:00 AM - 12:00 PM',
          title: 'Staubbach & Trümmelbach Underground Glacial Falls',
          location: 'Lauterbrunnen Valley',
          duration: '3 hrs',
          cost: 16,
          isIndoor: false,
          isAnchorEvent: false,
          category: 'nature',
          description: 'Hike beneath the dramatic 300-meter Staubbach cascade that inspired Goethe, continuing along pastoral wildflower meadows.',
          rainyAlternative: {
            id: 'rain_s2_1',
            title: 'Subterranean Trümmelbach Chasm Gallery (Carved Inside Mountain)',
            location: 'Inside Black Monk Mountain, Lauterbrunnen',
            duration: '2.5 hrs',
            cost: 18,
            isIndoor: true,
            category: 'historic-interior',
            description: 'Enter the heart of the mountain via funicular to witness 20,000 liters/sec of glacier meltwater roaring through illuminated caverns, completely dry from surface rain.',
            rainAdvantage: 'Fully subterranean rock cavern unaffected by rain; dramatic acoustics',
            operatingHours: '09:00 AM - 05:00 PM'
          }
        },
        {
          id: 'act_s2_2',
          timeSlot: '01:30 PM - 04:00 PM',
          title: 'Wengen Alpine Balcony Trail Walk',
          location: 'Jungfrau Region',
          duration: '2.5 hrs',
          cost: 15,
          isIndoor: false,
          isAnchorEvent: false,
          category: 'nature',
          description: 'Car-free mountain terrace walk facing the formidable Eiger, Mönch and Jungfrau north face towers.',
          rainyAlternative: {
            id: 'rain_s2_2',
            title: 'Victoria-Jungfrau Grand Hotel Mineral Thermal Spa',
            location: 'Interlaken Grand Spa',
            duration: '3 hrs',
            cost: 45,
            isIndoor: true,
            category: 'spa',
            description: 'Luxury 5,500m² indoor Roman-style bathing oasis with heated hydrotherapy pools, bio-saunas, and warm herbal salt steam grottoes.',
            rainAdvantage: 'Opulent heated indoor thermal pools with vaulted glass atrium',
            operatingHours: '08:00 AM - 09:00 PM'
          }
        },
        {
          id: 'act_s2_3',
          timeSlot: '06:00 PM - 09:00 PM',
          title: 'Lake Brienz Twilight Cruise & Alpine Hearth Dinner',
          location: 'Interlaken Ost Pier',
          duration: '3 hrs',
          cost: 65,
          isIndoor: true,
          isAnchorEvent: true, // Fixed Anchor
          category: 'food',
          description: 'Enclosed salon aboard a historic paddle steamer serving fresh lake trout and local Valais wines as mist blankets the fjord.'
        }
      ]
    }
  ],
  dest_amalfi: [
    {
      dayNumber: 1,
      date: 'Day 1',
      dayOfWeek: 'Monday',
      title: 'Positano Pastel Cascades & Coastal Vistas',
      theme: 'Mediterranean Terraces & Glamorous Marina',
      forecast: {
        tempC: 25,
        condition: 'Clear Blue Skies',
        isRainy: false,
        rainProbability: 10
      },
      isRainContingencyActive: false,
      activities: [
        {
          id: 'act_a1_1',
          timeSlot: '09:30 AM - 12:00 PM',
          title: 'Positano Cliffside Stairways & Church of Santa Maria Assunta',
          location: 'Positano Center',
          duration: '2.5 hrs',
          cost: 0,
          isIndoor: false,
          isAnchorEvent: false,
          category: 'sightseeing',
          description: 'Wind down fragrant wisteria stairs to the majolica-tiled Byzantine domed church and black sand beach.',
          rainyAlternative: {
            id: 'rain_a1_1',
            title: 'Museo Archeologico Romano (Subterranean Roman Villa)',
            location: 'Positano Piazza Flavio Gioia',
            duration: '1.5 hrs',
            cost: 15,
            isIndoor: true,
            category: 'museum',
            description: 'Descend beneath Positano church into an exquisitely preserved 1st-century AD Roman luxury villa with vivid frescoed triclinium buried by Vesuvius.',
            rainAdvantage: 'Underground temperature-controlled archaeological jewel',
            operatingHours: '09:00 AM - 07:00 PM'
          }
        },
        {
          id: 'act_a1_2',
          timeSlot: '02:00 PM - 05:30 PM',
          title: 'Private Gozzo Boat Coastal Cruise to Faraglioni',
          location: 'Positano Marina Grande',
          duration: '3.5 hrs',
          cost: 95,
          isIndoor: false,
          isAnchorEvent: true, // Anchor
          category: 'sightseeing',
          description: 'Wooden boat sailing past hidden emerald sea caves, the Li Galli islands, and dramatic limestone sea stacks.'
        },
        {
          id: 'act_a1_3',
          timeSlot: '07:30 PM - 10:00 PM',
          title: 'Cliffside Ristorante La Sponda Candlelit Dinner',
          location: 'Sirenuse Terraces, Positano',
          duration: '2.5 hrs',
          cost: 85,
          isIndoor: true,
          isAnchorEvent: false,
          category: 'food',
          description: 'Michelin-starred Mediterranean dining illuminated by 400 beeswax candles overlooking the sparkling village.'
        }
      ]
    }
  ],
  dest_iceland: [
    {
      dayNumber: 1,
      date: 'Day 1',
      dayOfWeek: 'Monday',
      title: 'Geothermal Marvels & Basalt Reykjavik',
      theme: 'Tectonic Plates, Silica Pools & Modern Nordic Design',
      forecast: {
        tempC: 11,
        condition: 'Brisk Nordic Mist',
        isRainy: true,
        rainProbability: 55
      },
      isRainContingencyActive: false,
      activities: [
        {
          id: 'act_i1_1',
          timeSlot: '09:00 AM - 12:00 PM',
          title: 'Thingvellir National Park Tectonic Rift Walk',
          location: 'Thingvellir Valley',
          duration: '3 hrs',
          cost: 0,
          isIndoor: false,
          isAnchorEvent: false,
          category: 'nature',
          description: 'Walk between the North American and Eurasian tectonic plates through the dramatic Almannagjá chasm.',
          rainyAlternative: {
            id: 'rain_i1_1',
            title: 'Perlan Wonders of Iceland & Real Ice Cave',
            location: 'Oskjuhlid, Reykjavik',
            duration: '2.5 hrs',
            cost: 38,
            isIndoor: true,
            category: 'museum',
            description: 'Venture inside a 100-meter long real ice cave crafted with 350 tons of pure mountain snow, plus an immersive 8K northern lights planetarium show.',
            rainAdvantage: 'Completely indoor sub-zero glacier simulation & glass dome cafe',
            operatingHours: '09:00 AM - 08:00 PM'
          }
        },
        {
          id: 'act_i1_2',
          timeSlot: '01:30 PM - 04:30 PM',
          title: 'Blue Lagoon Geothermal Mineral Retreat',
          location: 'Grindavík Lava Field',
          duration: '3 hrs',
          cost: 85,
          isIndoor: false,
          isAnchorEvent: true, // Fixed Anchor
          category: 'nature',
          description: 'Soak in warm 38°C milky-blue geothermal mineral waters rich in silica and algae surrounded by black lava fields (invigorating rain or shine).'
        },
        {
          id: 'act_i1_3',
          timeSlot: '07:00 PM - 09:30 PM',
          title: 'Harpa Concert Hall & New Nordic Seafood Feast',
          location: 'Reykjavik Old Harbour',
          duration: '2.5 hrs',
          cost: 75,
          isIndoor: true,
          isAnchorEvent: false,
          category: 'food',
          description: 'Admire Olafur Eliasson’s geometric glass facade followed by Arctic char and langoustine bisque by the harbour.'
        }
      ]
    }
  ]
};

export const ACCOMMODATIONS_DATA: Record<string, AccommodationOption[]> = {
  dest_kyoto: [
    {
      id: 'acc_kyo_01',
      destinationId: 'dest_kyoto',
      name: 'Kyoto Machiya Gion Heritage Villa',
      type: 'Traditional Ryokan',
      neighborhood: 'Gion / Higashiyama',
      pricePerNight: 240,
      totalNights: 4,
      totalPrice: 960,
      rating: 4.94,
      reviewCount: 320,
      amenities: ['Private Hinoki Cedar Bath', 'Tatami Living Rooms', 'Zen Garden View', 'Artisan Kaiseki Breakfast', 'High-Speed Wi-Fi'],
      freeCancellationUntil: '48 hours before check-in',
      isBooked: false
    },
    {
      id: 'acc_kyo_02',
      destinationId: 'dest_kyoto',
      name: 'The Celestine Kyoto Gion',
      type: 'Boutique Hotel',
      neighborhood: 'Higashiyama Ward',
      pricePerNight: 195,
      totalNights: 4,
      totalPrice: 780,
      rating: 4.88,
      reviewCount: 450,
      amenities: ['Grand Public Onsen Bath', 'Concierge Tour Desk', 'Signature Bar Omiya', 'Complimentary Evening Sake Tasting'],
      freeCancellationUntil: '24 hours before check-in',
      isBooked: false
    },
    {
      id: 'acc_kyo_03',
      destinationId: 'dest_kyoto',
      name: 'Ace Hotel Kyoto by Kengo Kuma',
      type: 'Design Hotel',
      neighborhood: 'ShinPuhKan, Nakagyo',
      pricePerNight: 280,
      totalNights: 4,
      totalPrice: 1120,
      rating: 4.91,
      reviewCount: 290,
      amenities: ['Tivoli Audio in Rooms', 'Stumptown Coffee Bar', 'Kengo Kuma Wooden Architecture', 'Rooftop Cocktail Lounge'],
      freeCancellationUntil: '72 hours before check-in',
      isBooked: false
    }
  ],
  dest_swiss: [
    {
      id: 'acc_swi_01',
      destinationId: 'dest_swiss',
      name: 'Hotel des Balances Historic Riverfront',
      type: 'Boutique Hotel',
      neighborhood: 'Lucerne Old Town',
      pricePerNight: 310,
      totalNights: 4,
      totalPrice: 1240,
      rating: 4.92,
      reviewCount: 280,
      amenities: ['Balcony Overlooking Chapel Bridge', 'Fine Dining Terrace', 'Complimentary Lake Pass', 'Nespresso Suites'],
      freeCancellationUntil: '3 days prior to arrival',
      isBooked: false
    },
    {
      id: 'acc_swi_02',
      destinationId: 'dest_swiss',
      name: 'Eiger Alpine Chalet & Spa Suites',
      type: 'Alpine Chalet',
      neighborhood: 'Wengen Alpine Terrace',
      pricePerNight: 260,
      totalNights: 4,
      totalPrice: 1040,
      rating: 4.89,
      reviewCount: 310,
      amenities: ['Car-free Alpine Setting', 'Panoramic Sauna', 'Ski-in & Trailhead Access', 'Swiss Mountain Breakfast Included'],
      freeCancellationUntil: '5 days prior to arrival',
      isBooked: false
    }
  ],
  dest_amalfi: [
    {
      id: 'acc_ama_01',
      destinationId: 'dest_amalfi',
      name: 'Villa TreVille Clifftop Retreat',
      type: 'Luxury Suite',
      neighborhood: 'Positano Coastal Clifftop',
      pricePerNight: 360,
      totalNights: 4,
      totalPrice: 1440,
      rating: 4.96,
      reviewCount: 190,
      amenities: ['Private Funicular to Beach', 'Infinity Seawater Plunge Pool', 'Organic Estate Breakfast', 'Private Boat Shuttle'],
      freeCancellationUntil: '7 days prior to arrival',
      isBooked: false
    }
  ],
  dest_iceland: [
    {
      id: 'acc_ice_01',
      destinationId: 'dest_iceland',
      name: 'The Reykjavik EDITION Hotel',
      type: 'Design Hotel',
      neighborhood: 'Old Harbour District',
      pricePerNight: 290,
      totalNights: 4,
      totalPrice: 1160,
      rating: 4.91,
      reviewCount: 240,
      amenities: ['Harbour Sunset Views', 'Subterranean Spa & Hamam', 'Rooftop Northern Lights Bar', 'Custom Le Labo Scents'],
      freeCancellationUntil: '48 hours prior to arrival',
      isBooked: false
    }
  ]
};

export const TRANSIT_PASSES_DATA: Record<string, TransitPassOption[]> = {
  dest_kyoto: [
    {
      id: 'tp_kyo_01',
      destinationId: 'dest_kyoto',
      name: 'JR Kansai-Hiroshima Area Rapid Pass (5-Day)',
      validity: '5 Consecutive Days',
      pricePerPerson: 110,
      totalPrice: 110,
      description: 'Unlimited rides on Shinkansen bullet trains (Shin-Osaka to Hiroshima), Haruka Airport Express, and all Kansai JR lines.',
      coverage: 'Kyoto, Osaka, Nara, Kobe, Himeji & KIX Airport',
      perks: ['Haruka Reserved Airport Express Seat', 'Unlimited Sanyo Shinkansen', 'Free JR Ferry to Miyajima Island'],
      isBooked: false
    },
    {
      id: 'tp_kyo_02',
      destinationId: 'dest_kyoto',
      name: 'Kyoto City Subway & Municipal Bus Unlimited Pass',
      validity: '3 Days',
      pricePerPerson: 22,
      totalPrice: 22,
      description: 'Hop-on hop-off access to Kyoto subway lines and all municipal green buses connecting all 17 UNESCO World Heritage shrines.',
      coverage: 'All Kyoto Metropolitan Zones & Arashiyama',
      perks: ['Contactless Mobile Card Integration', 'Discounts at 30+ Kyoto Museums', 'Fast-Track boarding'],
      isBooked: false
    }
  ],
  dest_swiss: [
    {
      id: 'tp_swi_01',
      destinationId: 'dest_swiss',
      name: 'Swiss Travel Pass Flex (4-Day All-Inclusive)',
      validity: '4 Days within 1 Month',
      pricePerPerson: 295,
      totalPrice: 295,
      description: 'The golden key to Switzerland: unlimited travel by train, bus, and lake boat, plus free entry to more than 500 museums nationwide.',
      coverage: 'Entire Swiss National Network (SBB, BLS, PostBus, Lake Ferries)',
      perks: ['Free Mount Rigi & Stanserhorn Mountain Railways', '50% discount on Mount Pilatus & Jungfraujoch', 'Free admission to 500+ museums'],
      isBooked: false
    }
  ],
  dest_amalfi: [
    {
      id: 'tp_ama_01',
      destinationId: 'dest_amalfi',
      name: 'Amalfi Coast Coastal Ferry & SITA Bus Hop-On Pass',
      validity: '3 Days',
      pricePerPerson: 48,
      totalPrice: 48,
      description: 'Unlimited coastal catamaran ferries between Salerno, Amalfi, Positano, and Sorrento, bypassing cliffside traffic jams.',
      coverage: 'Positano, Amalfi, Minori, Maiori, Capri Shuttle link',
      perks: ['Skip coastal road traffic', 'Scenic sea cliff photo views', 'Flexible departure times'],
      isBooked: false
    }
  ],
  dest_iceland: [
    {
      id: 'tp_ice_01',
      destinationId: 'dest_iceland',
      name: 'Reykjavik City Card & Flybus Airport Premium Express',
      validity: '72 Hours',
      pricePerPerson: 55,
      totalPrice: 55,
      description: 'Direct door-to-door transfer between Keflavik Airport and Reykjavik hotels, plus unlimited city geothermal thermal pools and museums.',
      coverage: 'Greater Reykjavik & Keflavik International Airport',
      perks: ['Free entry to 7 public geothermal pools', 'Unlimited city buses', 'Free Viðey Island ferry'],
      isBooked: false
    }
  ]
};

export const ATTRACTION_TICKETS_DATA: Record<string, AttractionTicketOption[]> = {
  dest_kyoto: [
    {
      id: 'att_kyo_01',
      destinationId: 'dest_kyoto',
      title: 'teamLab Biovoid / Botanical Garden Immersive Pass',
      venue: 'Kyoto Botanical Pavilion',
      entryType: 'Timed Entry Pass',
      pricePerPerson: 28,
      totalPrice: 28,
      perks: ['Instant QR mobile voucher', 'Guaranteed twilight entry slot', 'Weatherproof indoor/covered interactive zones'],
      isBooked: false
    },
    {
      id: 'att_kyo_02',
      destinationId: 'dest_kyoto',
      title: 'Nijo Castle & Ninomaru Palace VIP Audio Guide Tour',
      venue: 'Nijo Imperial Castle',
      entryType: 'Skip-The-Line VIP',
      pricePerPerson: 20,
      totalPrice: 20,
      perks: ['Skip ticket queue', 'High-fidelity bilingual audio tour', 'Exclusive garden terrace access'],
      isBooked: false
    }
  ],
  dest_swiss: [
    {
      id: 'att_swi_01',
      destinationId: 'dest_swiss',
      title: 'Mount Pilatus "Dragon Ride" Aerial Cableway Pass',
      venue: 'Mount Pilatus Summit',
      entryType: 'Panoramic Access',
      pricePerPerson: 65,
      totalPrice: 65,
      perks: ['Cockpit-style floor-to-ceiling glass cabin', 'Fast-lane boarding', 'Peak terrace panoramic telescope access'],
      isBooked: false
    }
  ],
  dest_amalfi: [
    {
      id: 'att_ama_01',
      destinationId: 'dest_amalfi',
      title: 'Pompeii Archaeological Park Priority Access & Archaeologist Guide',
      venue: 'Pompeii Scavi',
      entryType: 'Guided Masterclass',
      pricePerPerson: 45,
      totalPrice: 45,
      perks: ['Skip ticket lines', '2-hour certified archaeologist guide', 'Access to newly restored domus villas'],
      isBooked: false
    }
  ],
  dest_iceland: [
    {
      id: 'att_ice_01',
      destinationId: 'dest_iceland',
      title: 'Blue Lagoon Premium Geothermal Experience',
      venue: 'Blue Lagoon Retreat',
      entryType: 'Timed Entry Pass',
      pricePerPerson: 95,
      totalPrice: 95,
      perks: ['Silica mud mask at Mask Bar', 'Use of towel and bathrobe', 'First drink of choice at swim-up bar'],
      isBooked: false
    }
  ]
};
