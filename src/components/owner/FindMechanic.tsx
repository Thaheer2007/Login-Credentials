import React, { useState, useMemo, useEffect } from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { RatingStars } from '../common/RatingStars';
import {
  Search,
  Filter,
  MapPin,
  ShieldCheck,
  Star,
  SlidersHorizontal,
  Wrench,
  Clock,
  ArrowUpDown,
  Car,
  Bike,
  Truck,
  Tractor,
  Sparkles,
  Check
} from 'lucide-react';

export const FindMechanic: React.FC = () => {
  const {
    mechanics,
    setSelectedMechanic,
    openBookingModal,
    selectedVehicleTypeFilter,
    setSelectedVehicleTypeFilter,
    userLocation,
    setIsLocationModalOpen
  } = useMechnik();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>(selectedVehicleTypeFilter || 'all');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'nearest' | 'highest-rated' | 'lowest-price'>('recommended');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Sync if global vehicle filter changed from hero bar
  useEffect(() => {
    if (selectedVehicleTypeFilter) {
      setSelectedVehicleType(selectedVehicleTypeFilter);
    }
  }, [selectedVehicleTypeFilter]);

  const servicesList = [
    { id: 'all', label: 'All Services' },
    { id: 'general-service', label: 'General Service' },
    { id: 'brake-repair', label: 'Brake Repair' },
    { id: 'oil-change', label: 'Oil Change' },
    { id: 'battery', label: 'Battery' },
    { id: 'tyre-service', label: 'Tyres' },
    { id: 'electrical', label: 'Electrical' }
  ];

  const vehicleTypes = [
    { id: 'all', label: 'All Vehicles' },
    { id: 'Car', label: 'Cars (Sedan/SUV/Hatchback)' },
    { id: 'Bike', label: 'Bikes & Scooters' },
    { id: 'Truck', label: 'Commercial Trucks & Pickups' },
    { id: 'Tractor', label: 'Tractors & Agri Equipment' },
    { id: 'Other', label: 'Other Vehicles & EVs' }
  ];

  // Filtering & Sorting
  const filteredMechanics = useMemo(() => {
    return mechanics
      .filter((m) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = m.name.toLowerCase().includes(q);
          const matchArea = m.area.toLowerCase().includes(q);
          const matchServices = m.servicesOffered.some((s) => s.serviceName.toLowerCase().includes(q));
          if (!matchName && !matchArea && !matchServices) return false;
        }

        // Service filter
        if (selectedService !== 'all') {
          const hasService = m.servicesOffered.some((s) => s.serviceId === selectedService);
          if (!hasService) return false;
        }

        // Vehicle type filter
        if (selectedVehicleType !== 'all') {
          const supports = m.supportedVehicles.includes(selectedVehicleType as any);
          if (!supports) return false;
        }

        // Min rating
        if (m.rating < minRating) return false;

        // Max distance
        if (m.distanceKm > maxDistance) return false;

        // Verified
        if (verifiedOnly && !m.verified) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'nearest') {
          return a.distanceKm - b.distanceKm;
        }
        if (sortBy === 'highest-rated') {
          return b.rating - a.rating;
        }
        if (sortBy === 'lowest-price') {
          const aMin = Math.min(...a.servicesOffered.map((s) => s.minPrice));
          const bMin = Math.min(...b.servicesOffered.map((s) => s.minPrice));
          return aMin - bMin;
        }
        if (a.verified && !b.verified) return -1;
        if (!a.verified && b.verified) return 1;
        return b.rating - a.rating;
      });
  }, [mechanics, searchQuery, selectedService, selectedVehicleType, minRating, maxDistance, verifiedOnly, sortBy]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Find a Mechanic</h1>
          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-mechnik-500" />
            <span>Showing verified workshops near</span>
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="font-bold text-mechnik-600 hover:text-mechnik-700 underline cursor-pointer"
            >
              {userLocation}
            </button>
          </div>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="md:hidden btn-secondary px-3 py-2 text-xs flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              <option value="recommended">Recommended</option>
              <option value="nearest">Nearest</option>
              <option value="highest-rated">Highest Rated</option>
              <option value="lowest-price">Lowest Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search service, mechanic or vehicle type (e.g. Brakes, Car Oil Change, Ravi Auto Care)..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-200/90 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-mechnik-500/30 focus:border-mechnik-500 shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Quick Service Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {servicesList.map((svc) => (
          <button
            key={svc.id}
            type="button"
            onClick={() => setSelectedService(svc.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedService === svc.id
                ? 'bg-mechnik-500 text-white shadow-mechnik-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {svc.label}
          </button>
        ))}
      </div>

      {/* Main Content Layout: Filters Sidebar + Results List */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Filter Sidebar */}
        <div className={`md:block ${showFiltersMobile ? 'block' : 'hidden'} md:col-span-1 space-y-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft h-fit`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-mechnik-500" />
              <span>Filter Results</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                setSelectedService('all');
                setSelectedVehicleType('all');
                setSelectedVehicleTypeFilter('all');
                setMinRating(0);
                setMaxDistance(10);
                setVerifiedOnly(false);
                setSearchQuery('');
              }}
              className="text-[11px] text-mechnik-600 hover:underline font-medium"
            >
              Reset
            </button>
          </div>

          {/* Verified Toggle */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-mechnik-500 focus:ring-mechnik-500 border-slate-300"
              />
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Verified Workshops Only
              </span>
            </label>
          </div>

          {/* Vehicle Type Filter */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Vehicle Category
            </label>
            <select
              value={selectedVehicleType}
              onChange={(e) => {
                setSelectedVehicleType(e.target.value);
                setSelectedVehicleTypeFilter(e.target.value);
              }}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-mechnik-500/20"
            >
              {vehicleTypes.map((vt) => (
                <option key={vt.id} value={vt.id}>
                  {vt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Distance Filter */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
              <span>Distance Radius</span>
              <span className="text-mechnik-600 font-mono">Within {maxDistance} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
              className="w-full accent-mechnik-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1 km</span>
              <span>5 km</span>
              <span>10 km</span>
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Customer Rating
            </label>
            <div className="space-y-1.5">
              {[
                { val: 0, label: 'Any Rating' },
                { val: 4.5, label: '4.5 ★ & above' },
                { val: 4.0, label: '4.0 ★ & above' }
              ].map((opt) => (
                <label key={opt.val} className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === opt.val}
                    onChange={() => setMinRating(opt.val)}
                    className="text-mechnik-500 focus:ring-mechnik-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Mechanic Cards List */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong>{filteredMechanics.length}</strong> workshops
              {selectedVehicleType !== 'all' && ` for ${selectedVehicleType}s`}
            </span>
            {selectedService !== 'all' && (
              <span className="text-mechnik-600 font-medium">Service: {selectedService}</span>
            )}
          </div>

          {filteredMechanics.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-mechnik-500 flex items-center justify-center mx-auto mb-3">
                <Wrench className="w-6 h-6 -rotate-45" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Workshops Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No garages match your current filters. Try expanding your distance radius or selecting "All Vehicles".
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedService('all');
                  setSelectedVehicleType('all');
                  setSelectedVehicleTypeFilter('all');
                  setMinRating(0);
                  setMaxDistance(10);
                  setVerifiedOnly(false);
                  setSearchQuery('');
                }}
                className="mt-4 btn-secondary px-4 py-2 text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredMechanics.map((mechanic) => {
              const startingPrice = Math.min(...mechanic.servicesOffered.map((s) => s.minPrice));

              return (
                <div
                  key={mechanic.id}
                  className="bg-white rounded-2xl border border-slate-200/80 hover:border-mechnik-500/70 p-5 shadow-soft hover:shadow-soft-lg transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 group"
                >
                  {/* Left: Avatar & Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={mechanic.avatarUrl}
                      alt={mechanic.ownerName}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm flex-shrink-0"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-mechnik-600 transition-colors">
                          {mechanic.name}
                        </h3>
                        {mechanic.verified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase">
                            <ShieldCheck className="w-3 h-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                            Pending Review
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mt-0.5">
                        Lead: <strong>{mechanic.ownerName}</strong> • {mechanic.experienceYears}+ years exp
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                        <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{mechanic.rating}</span>
                          <span className="text-slate-400 font-normal">({mechanic.totalReviews})</span>
                        </div>
                        <span className="flex items-center gap-1 text-slate-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-mechnik-500" />
                          {mechanic.distanceKm} km away • {mechanic.area}
                        </span>
                        <span className="text-[11px] text-emerald-600 font-semibold">
                          ● {mechanic.availabilityNote}
                        </span>
                      </div>

                      {/* Supported vehicle badges */}
                      <div className="flex flex-wrap items-center gap-1 mt-2.5">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold mr-1">Vehicles:</span>
                        {mechanic.supportedVehicles.map((vType, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-orange-50 text-mechnik-700 font-semibold border border-orange-100"
                          >
                            {vType}
                          </span>
                        ))}
                      </div>

                      {/* Services badges */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {mechanic.servicesOffered.map((svc) => (
                          <span
                            key={svc.serviceId}
                            className="text-[10px] px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                          >
                            {svc.serviceName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Pricing & Actions */}
                  <div className="w-full sm:w-44 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-5 gap-3 flex-shrink-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Estimated from
                      </span>
                      <span className="text-lg font-extrabold text-charcoal-900 font-mono">
                        ₹{startingPrice}
                      </span>
                    </div>

                    <div className="flex sm:flex-col gap-2 w-auto sm:w-full">
                      <button
                        type="button"
                        onClick={() => setSelectedMechanic(mechanic)}
                        className="btn-secondary px-3 py-2 text-xs font-semibold w-full"
                      >
                        View Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => openBookingModal(mechanic)}
                        className="btn-primary px-3 py-2 text-xs font-bold w-full shadow-mechnik-sm"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
