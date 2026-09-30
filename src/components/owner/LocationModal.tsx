import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { Modal } from '../common/Modal';
import { MapPin, Navigation, Search, Check, AlertCircle, X, Loader2 } from 'lucide-react';
import { detectBrowserGeolocation, searchLocations } from '../../services/locationService';
import { POPULAR_LOCATIONS, LocationItem } from '../../data/locationsData';

export const LocationModal: React.FC = () => {
  const {
    userLocation,
    setUserLocation,
    locationMode,
    setLocationMode,
    isLocationModalOpen,
    setIsLocationModalOpen,
    addToast
  } = useMechnik();

  const [isDetecting, setIsDetecting] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isLocationModalOpen) {
      setGeoError(null);
      setSearchQuery('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isLocationModalOpen]);

  // Compute suggestions based on user query
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    return searchLocations(searchQuery);
  }, [searchQuery]);

  if (!isLocationModalOpen) return null;

  // Real Geolocation Auto-Detection
  const handleAutoDetect = async () => {
    setIsDetecting(true);
    setGeoError(null);

    try {
      const result = await detectBrowserGeolocation();
      setIsDetecting(false);
      setUserLocation(result.locationName);
      setLocationMode('auto');
      addToast('Location Auto-Detected', `📍 ${result.locationName}`, 'success');
      setIsLocationModalOpen(false);
    } catch (err: any) {
      setIsDetecting(false);
      const friendlyMsg = 'Unable to detect your location. Please choose a location manually.';
      setGeoError(friendlyMsg);
      addToast('Detection Failed', friendlyMsg, 'warning');
    }
  };

  const handleSelectLocation = (locName: string) => {
    setUserLocation(locName);
    setLocationMode('manual');
    addToast('Location Updated', `📍 ${locName}`, 'success');
    setIsLocationModalOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (suggestions.length > 0) {
      handleSelectLocation(suggestions[0].name);
    } else {
      handleSelectLocation(searchQuery.trim());
    }
  };

  // Popular presets for quick one-click selection
  const topPresets = POPULAR_LOCATIONS.filter((l) =>
    [
      'blr-indiranagar',
      'blr-koramangala',
      'blr-whitefield',
      'blr-hsr',
      'hyd-hyderabad',
      'chn-chennai',
      'cbe-coimbatore',
      'pun-pune'
    ].includes(l.id)
  );

  return (
    <Modal
      isOpen={isLocationModalOpen}
      onClose={() => setIsLocationModalOpen(false)}
      title={
        <div className="flex items-center gap-2 text-slate-900">
          <MapPin className="w-5 h-5 text-mechnik-500" />
          <span>Select Your Location</span>
        </div>
      }
      subtitle="Choose how your vehicle service location is determined"
      maxWidth="md"
    >
      <div className="space-y-5 pt-2">
        {/* Current Active Location Pill */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Current Active Location
            </span>
            <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-4 h-4 text-mechnik-500" />
              {userLocation}
            </span>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
              locationMode === 'auto'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-orange-100 text-orange-800'
            }`}
          >
            {locationMode === 'auto' ? '● GPS Auto-Detected' : '✏️ Manually Set'}
          </span>
        </div>

        {/* Option A: Auto-Detect My Location */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-900 block">Option A: Browser Geolocation</span>
          <button
            type="button"
            onClick={handleAutoDetect}
            disabled={isDetecting}
            className="w-full p-3.5 rounded-2xl border-2 border-mechnik-500/80 bg-orange-50/60 hover:bg-orange-100/70 text-slate-900 font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-mechnik-sm disabled:opacity-75"
          >
            {isDetecting ? (
              <Loader2 className="w-4 h-4 text-mechnik-600 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4 text-mechnik-600" />
            )}
            <span>{isDetecting ? 'Detecting your location...' : 'Auto-detect my location'}</span>
          </button>

          {geoError && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{geoError}</p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  You can type your area, locality, or PIN code below.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 absolute">
            Or Choose Manually
          </span>
        </div>

        {/* Option B: Choose Another Location with Autocomplete */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-900 block">
            Option B: Search Location / Address
          </label>

          {/* Search Input Field */}
          <form onSubmit={handleCustomSubmit} className="relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search area, locality, city, landmark, or PIN (e.g. Kor, Hyder, 641001)..."
                className="w-full pl-9 pr-8 py-3 rounded-xl border-2 border-slate-200 focus:border-mechnik-500 bg-white text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-mechnik-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* AUTOCOMPLETE SUGGESTIONS DROPDOWN */}
            {searchQuery.trim().length > 0 && (
              <div className="mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl divide-y divide-slate-100 z-30 animate-in fade-in zoom-in-95">
                {suggestions.length > 0 ? (
                  suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectLocation(item.name)}
                      className="w-full px-3.5 py-2.5 text-left hover:bg-orange-50/70 transition-colors flex items-start gap-2.5 group"
                    >
                      <MapPin className="w-4 h-4 text-mechnik-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-mechnik-700">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {item.area !== item.name && item.area ? `${item.area} • ` : ''}
                          {item.landmark ? `${item.landmark} • ` : ''}
                          {item.pincode ? `PIN: ${item.pincode}` : item.state}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-left">
                    <button
                      type="button"
                      onClick={() => handleSelectLocation(searchQuery.trim())}
                      className="w-full px-2 py-1.5 rounded-lg text-left text-xs hover:bg-orange-50 text-slate-800 flex items-center gap-2"
                    >
                      <MapPin className="w-3.5 h-3.5 text-mechnik-500" />
                      <span>Use custom location: <strong>"{searchQuery.trim()}"</strong></span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Popular Cities & Neighborhood Presets */}
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-slate-500 block mb-2">
              Popular Cities & Neighborhoods:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {topPresets.map((loc) => {
                const isCurrent = userLocation.toLowerCase() === loc.name.toLowerCase();
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelectLocation(loc.name)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'border-mechnik-500 bg-orange-50 font-bold text-mechnik-700 shadow-sm ring-1 ring-mechnik-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="truncate pr-1">
                      <div className="truncate font-semibold">{loc.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {loc.area} • PIN: {loc.pincode}
                      </div>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-mechnik-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
