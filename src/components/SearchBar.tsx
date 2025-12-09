import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { Printer } from '../lib/supabase';
import { Computer } from '../hooks/useComputers';
import { TV } from '../hooks/useTVs';

interface SearchResult {
  id: string;
  name: string;
  type: 'printer' | 'computer' | 'tv';
  x_position: number;
  y_position: number;
  status: string;
}

interface SearchBarProps {
  printers: Printer[];
  computers: Computer[];
  tvs: TV[];
  onNavigateToDevice: (device: SearchResult) => void;
}

export function SearchBar({ printers, computers, tvs, onNavigateToDevice }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase();
    const allResults: SearchResult[] = [];

    // Search printers
    printers.forEach(printer => {
      if (printer.name.toLowerCase().includes(searchQuery) || 
          printer.model.toLowerCase().includes(searchQuery)) {
        allResults.push({
          id: printer.id,
          name: printer.name,
          type: 'printer',
          x_position: printer.x_position,
          y_position: printer.y_position,
          status: printer.status
        });
      }
    });

    // Search computers
    computers.forEach(computer => {
      if (computer.name.toLowerCase().includes(searchQuery) || 
          computer.model.toLowerCase().includes(searchQuery) ||
          computer.hostname.toLowerCase().includes(searchQuery)) {
        allResults.push({
          id: computer.id,
          name: computer.name,
          type: 'computer',
          x_position: computer.x_position,
          y_position: computer.y_position,
          status: computer.status
        });
      }
    });

    // Search TVs
    tvs.forEach(tv => {
      if (tv.name.toLowerCase().includes(searchQuery) || 
          tv.model.toLowerCase().includes(searchQuery)) {
        allResults.push({
          id: tv.id,
          name: tv.name,
          type: 'tv',
          x_position: tv.x_position,
          y_position: tv.y_position,
          status: tv.status
        });
      }
    });

    setResults(allResults.slice(0, 10)); // Limit to 10 results
  }, [query, printers, computers, tvs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    onNavigateToDevice(result);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'printer': return '🖨️';
      case 'computer': return '💻';
      case 'tv': return '📺';
      default: return '📍';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search devices by name..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-64 pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {results.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleResultClick(result)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
            >
              <span className="text-lg">{getDeviceIcon(result.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-gray-900 truncate">{result.name}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                    {result.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 capitalize">{result.type}</p>
              </div>
              <MapPin className="h-4 w-4 text-gray-400" />
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-center text-gray-500">
          <Search className="h-6 w-6 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">No devices found</p>
        </div>
      )}
    </div>
  );
}