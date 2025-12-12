import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapPin, Search, Locate, X } from 'lucide-react';
import { Button } from '../../components/Button';
import { cn } from '../../lib/utils';

interface LocationData {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface LocationPickerProps {
  value?: LocationData;
  onChange: (location: LocationData) => void;
  className?: string;
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyBMVMVZWEBEMF5_wS3qrVy9TlVzHkLPFJE'; // Replace with your API key

export const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, className }) => {
  const [searchQuery, setSearchQuery] = useState(value?.address || '');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(value || null);
  const [mapUrl, setMapUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Generate static map URL
  const generateMapUrl = useCallback((lat: number, lng: number) => {
    const zoom = 15;
    const size = '600x300';
    const apiKey = 'AIzaSyBMVMVZWEBEMF5_wS3qrVy9TlVzHkLPFJE'; // Replace with your API key
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
  }, []);

  // Initialize map if value exists
  useEffect(() => {
    if (value?.coordinates) {
      setMapUrl(generateMapUrl(value.coordinates.lat, value.coordinates.lng));
      setSearchQuery(value.address);
      setSelectedLocation(value);
    }
  }, [value, generateMapUrl]);

  // Geocode using Google Maps Geocoding API
  const geocodeAddress = async (address: string): Promise<LocationData | null> => {
    try {
      const apiKey = 'AIzaSyBMVMVZWEBEMF5_wS3qrVy9TlVzHkLPFJE'; // Replace with your API key
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results[0]) {
        const result = data.results[0];
        const location = result.geometry.location;
        
        // Extract address components
        let city = '', state = '', zipCode = '', country = '';
        result.address_components.forEach((component: any) => {
          if (component.types.includes('locality')) city = component.long_name;
          if (component.types.includes('administrative_area_level_1')) state = component.short_name;
          if (component.types.includes('postal_code')) zipCode = component.long_name;
          if (component.types.includes('country')) country = component.long_name;
        });

        return {
          address: result.formatted_address,
          coordinates: {
            lat: location.lat,
            lng: location.lng
          },
          city,
          state,
          zipCode,
          country
        };
      }
      return null;
    } catch (err) {
      console.error('Geocoding error:', err);
      return null;
    }
  };

  // Search for address suggestions
  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const apiKey = 'AIzaSyBMVMVZWEBEMF5_wS3qrVy9TlVzHkLPFJE'; // Replace with your API key
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${apiKey}`,
        { mode: 'cors' }
      );
      
      // Note: Due to CORS, we'll use geocoding instead
      // For production, use Places API with proper backend proxy
      const results = await geocodeAddress(query);
      if (results) {
        setSuggestions([results]);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle address selection
  const handleSelectAddress = async (address: string) => {
    setError('');
    setIsSearching(true);
    
    try {
      const locationData = await geocodeAddress(address);
      
      if (locationData) {
        setSelectedLocation(locationData);
        setSearchQuery(locationData.address);
        setMapUrl(generateMapUrl(locationData.coordinates.lat, locationData.coordinates.lng));
        onChange(locationData);
        setShowSuggestions(false);
      } else {
        setError('Location not found. Please try a different address.');
      }
    } catch (err) {
      setError('Failed to find location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Get current location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsSearching(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode to get address
          const apiKey = 'AIzaSyBMVMVZWEBEMF5_wS3qrVy9TlVzHkLPFJE';
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
          );
          const data = await response.json();

          if (data.status === 'OK' && data.results[0]) {
            const result = data.results[0];
            
            let city = '', state = '', zipCode = '', country = '';
            result.address_components.forEach((component: any) => {
              if (component.types.includes('locality')) city = component.long_name;
              if (component.types.includes('administrative_area_level_1')) state = component.short_name;
              if (component.types.includes('postal_code')) zipCode = component.long_name;
              if (component.types.includes('country')) country = component.long_name;
            });

            const locationData: LocationData = {
              address: result.formatted_address,
              coordinates: { lat: latitude, lng: longitude },
              city,
              state,
              zipCode,
              country
            };

            setSelectedLocation(locationData);
            setSearchQuery(locationData.address);
            setMapUrl(generateMapUrl(latitude, longitude));
            onChange(locationData);
          }
        } catch (err) {
          setError('Failed to get address for your location');
        } finally {
          setIsSearching(false);
        }
      },
      (err) => {
        setError('Unable to get your location. Please enter address manually.');
        setIsSearching(false);
      }
    );
  };

  const handleClear = () => {
    setSelectedLocation(null);
    setSearchQuery('');
    setMapUrl('');
    setError('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium block">Property Location</label>
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery) {
                    e.preventDefault();
                    handleSelectAddress(searchQuery);
                  }
                }}
                placeholder="Enter property address..."
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                disabled={isSearching}
              />
              {searchQuery && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              type="button"
              onClick={() => searchQuery && handleSelectAddress(searchQuery)}
              disabled={isSearching || !searchQuery.trim()}
              className="px-4"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleGetCurrentLocation}
              disabled={isSearching}
              className="px-4"
              title="Use current location"
            >
              <Locate className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>

      {/* Map Preview */}
      {selectedLocation && mapUrl && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Location Preview</label>
            <div className="text-xs text-muted-foreground">
              {selectedLocation.coordinates.lat.toFixed(6)}, {selectedLocation.coordinates.lng.toFixed(6)}
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden border border-border bg-muted">
            <img
              src={mapUrl}
              alt="Location map"
              className="w-full h-48 object-cover"
              onError={() => setError('Failed to load map preview')}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <div className="flex items-start gap-2 text-white">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{selectedLocation.address}</p>
                  {selectedLocation.city && (
                    <p className="text-xs opacity-90">
                      {selectedLocation.city}, {selectedLocation.state} {selectedLocation.zipCode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Coordinates Entry */}
      <details className="text-sm">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
          Advanced: Enter coordinates manually
        </summary>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Latitude</label>
            <input
              type="number"
              step="any"
              value={selectedLocation?.coordinates.lat || ''}
              onChange={(e) => {
                const lat = parseFloat(e.target.value);
                if (!isNaN(lat) && selectedLocation) {
                  const newLocation = {
                    ...selectedLocation,
                    coordinates: { ...selectedLocation.coordinates, lat }
                  };
                  setSelectedLocation(newLocation);
                  setMapUrl(generateMapUrl(lat, selectedLocation.coordinates.lng));
                  onChange(newLocation);
                }
              }}
              placeholder="37.7749"
              className="w-full px-2 py-1.5 text-sm rounded border border-input bg-background"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Longitude</label>
            <input
              type="number"
              step="any"
              value={selectedLocation?.coordinates.lng || ''}
              onChange={(e) => {
                const lng = parseFloat(e.target.value);
                if (!isNaN(lng) && selectedLocation) {
                  const newLocation = {
                    ...selectedLocation,
                    coordinates: { ...selectedLocation.coordinates, lng }
                  };
                  setSelectedLocation(newLocation);
                  setMapUrl(generateMapUrl(selectedLocation.coordinates.lat, lng));
                  onChange(newLocation);
                }
              }}
              placeholder="-122.4194"
              className="w-full px-2 py-1.5 text-sm rounded border border-input bg-background"
            />
          </div>
        </div>
      </details>

      {isSearching && (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
          Searching location...
        </div>
      )}
    </div>
  );
};