import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, X, Plane, Search, Check } from 'lucide-react';

export interface AirportGateway {
  code: string;
  city: string;
  name: string;
  country: string;
  formatted: string;
}

export const POPULAR_GATEWAYS: AirportGateway[] = [
  { code: 'SFO', city: 'San Francisco', name: 'San Francisco International', country: 'United States', formatted: 'San Francisco (SFO)' },
  { code: 'SIN', city: 'Singapore', name: 'Singapore Changi Airport', country: 'Singapore', formatted: 'Singapore Changi (SIN)' },
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy International', country: 'United States', formatted: 'New York (JFK)' },
  { code: 'EWR', city: 'New York / Newark', name: 'Newark Liberty International', country: 'United States', formatted: 'New York Newark (EWR)' },
  { code: 'LHR', city: 'London', name: 'London Heathrow Airport', country: 'United Kingdom', formatted: 'London Heathrow (LHR)' },
  { code: 'LGW', city: 'London', name: 'London Gatwick Airport', country: 'United Kingdom', formatted: 'London Gatwick (LGW)' },
  { code: 'HND', city: 'Tokyo', name: 'Tokyo Haneda Airport', country: 'Japan', formatted: 'Tokyo Haneda (HND)' },
  { code: 'NRT', city: 'Tokyo', name: 'Narita International Airport', country: 'Japan', formatted: 'Tokyo Narita (NRT)' },
  { code: 'FRA', city: 'Frankfurt', name: 'Frankfurt Airport', country: 'Germany', formatted: 'Frankfurt (FRA)' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle Airport', country: 'France', formatted: 'Paris (CDG)' },
  { code: 'AMS', city: 'Amsterdam', name: 'Amsterdam Airport Schiphol', country: 'Netherlands', formatted: 'Amsterdam (AMS)' },
  { code: 'ZRH', city: 'Zurich', name: 'Zurich Airport', country: 'Switzerland', formatted: 'Zurich (ZRH)' },
  { code: 'SYD', city: 'Sydney', name: 'Kingsford Smith Airport', country: 'Australia', formatted: 'Sydney (SYD)' },
  { code: 'MEL', city: 'Melbourne', name: 'Melbourne Airport', country: 'Australia', formatted: 'Melbourne (MEL)' },
  { code: 'LAX', city: 'Los Angeles', name: 'Los Angeles International', country: 'United States', formatted: 'Los Angeles (LAX)' },
  { code: 'ORD', city: 'Chicago', name: "O'Hare International Airport", country: 'United States', formatted: 'Chicago (ORD)' },
  { code: 'SEA', city: 'Seattle', name: 'Seattle-Tacoma International', country: 'United States', formatted: 'Seattle (SEA)' },
  { code: 'YYZ', city: 'Toronto', name: 'Toronto Pearson International', country: 'Canada', formatted: 'Toronto (YYZ)' },
  { code: 'YVR', city: 'Vancouver', name: 'Vancouver International', country: 'Canada', formatted: 'Vancouver (YVR)' },
  { code: 'HKG', city: 'Hong Kong', name: 'Hong Kong International', country: 'Hong Kong', formatted: 'Hong Kong (HKG)' },
  { code: 'TPE', city: 'Taipei', name: 'Taiwan Taoyuan International', country: 'Taiwan', formatted: 'Taipei Taoyuan (TPE)' },
  { code: 'ICN', city: 'Seoul', name: 'Incheon International Airport', country: 'South Korea', formatted: 'Seoul Incheon (ICN)' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai International Airport', country: 'United Arab Emirates', formatted: 'Dubai (DXB)' },
  { code: 'DOH', city: 'Doha', name: 'Hamad International Airport', country: 'Qatar', formatted: 'Doha (DOH)' },
  { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi Airport', country: 'Thailand', formatted: 'Bangkok (BKK)' },
  { code: 'FCO', city: 'Rome', name: 'Leonardo da Vinci-Fiumicino', country: 'Italy', formatted: 'Rome Fiumicino (FCO)' },
  { code: 'KUL', city: 'Kuala Lumpur', name: 'Kuala Lumpur International', country: 'Malaysia', formatted: 'Kuala Lumpur (KUL)' }
];

interface OriginGatewayInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const OriginGatewayInput: React.FC<OriginGatewayInputProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Commit current text if user typed free text and clicked away
        if (inputValue.trim() && inputValue !== value) {
          onChange(inputValue.trim());
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [inputValue, value, onChange]);

  // Filter similar items based on input value
  const filteredGateways = useMemo(() => {
    const query = inputValue.trim().toLowerCase();
    if (!query) {
      return POPULAR_GATEWAYS.slice(0, 8);
    }

    return POPULAR_GATEWAYS.filter((g) => {
      const matchCode = g.code.toLowerCase().includes(query);
      const matchCity = g.city.toLowerCase().includes(query);
      const matchName = g.name.toLowerCase().includes(query);
      const matchCountry = g.country.toLowerCase().includes(query);
      const matchFormatted = g.formatted.toLowerCase().includes(query);
      return matchCode || matchCity || matchName || matchCountry || matchFormatted;
    });
  }, [inputValue]);

  const handleSelectGateway = (gateway: AirportGateway) => {
    setInputValue(gateway.formatted);
    onChange(gateway.formatted);
    setIsOpen(false);
  };

  const handleCustomUse = () => {
    if (inputValue.trim()) {
      onChange(inputValue.trim());
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredGateways.length > 0) {
        handleSelectGateway(filteredGateways[0]);
      } else {
        handleCustomUse();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Free Text Input with Icon and Clear button */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={inputValue}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type any origin city, IATA code, or airport..."
          className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 pr-8 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
        />

        {inputValue ? (
          <button
            type="button"
            onClick={() => {
              setInputValue('');
              onChange('');
              setIsOpen(true);
            }}
            title="Clear Gateway"
            className="absolute right-2 p-0.5 text-slate-400 hover:text-white rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <Search className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 pointer-events-none" />
        )}
      </div>

      {/* Dropdown Suggestions List with Similar Words */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-slate-900 border border-slate-700/90 rounded-md shadow-2xl overflow-hidden max-h-64 overflow-y-auto animate-in fade-in duration-100">
          <div className="p-1.5 space-y-0.5">
            {/* Custom option prompt if user types something specific */}
            {inputValue.trim() && !POPULAR_GATEWAYS.some(g => g.formatted.toLowerCase() === inputValue.trim().toLowerCase()) && (
              <button
                type="button"
                onClick={handleCustomUse}
                className="w-full text-left px-2.5 py-2 rounded text-xs hover:bg-slate-800 text-cyan-300 flex items-center justify-between border-b border-slate-800/80 mb-1"
              >
                <div className="flex items-center gap-2 truncate">
                  <Plane className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">
                    Use custom gateway: <strong className="text-white">"{inputValue.trim()}"</strong>
                  </span>
                </div>
                <span className="text-[10px] text-cyan-400 font-mono shrink-0 ml-2">Custom</span>
              </button>
            )}

            {/* Filtered Similar Gateways */}
            {filteredGateways.length > 0 ? (
              filteredGateways.map((g) => {
                const isSelected = value.toLowerCase() === g.formatted.toLowerCase();
                return (
                  <button
                    key={g.code + g.city}
                    type="button"
                    onClick={() => handleSelectGateway(g)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between group ${
                      isSelected
                        ? 'bg-slate-800 text-cyan-300 font-medium'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono font-bold text-cyan-400 text-[11px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 shrink-0">
                        {g.code}
                      </span>
                      <div className="truncate">
                        <span className="text-slate-100 font-medium">{g.city}</span>
                        <span className="text-slate-500 text-[11px] ml-1.5 truncate">
                          · {g.name}, {g.country}
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-2" />}
                  </button>
                );
              })
            ) : (
              <div className="p-2.5 text-center text-xs text-slate-400">
                <span>No pre-configured airport matched. Press Enter to use </span>
                <span className="text-cyan-300 font-mono">"{inputValue.trim()}"</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
