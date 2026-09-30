import React, { useState } from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { Modal } from '../common/Modal';
import { RatingStars } from '../common/RatingStars';
import { Mechanic, Vehicle, BookingStatus } from '../../types/mechnik';
import {
  Zap,
  MapPin,
  Car,
  Bike,
  Truck,
  Tractor,
  AlertCircle,
  Search,
  CheckCircle2,
  Clock,
  Navigation,
  Loader2,
  Phone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  XCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import { detectBrowserGeolocation } from '../../services/locationService';

interface InstantBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstantBookingModal: React.FC<InstantBookingModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    vehicles,
    mechanics,
    userLocation,
    setUserLocation,
    createBooking,
    setTrackingBookingId,
    addToast
  } = useMechnik();

  // Wizard Steps:
  // 1: Confirm Location
  // 2: Select Vehicle
  // 3: Select / Describe Problem
  // 4: Find & Select Mechanic
  // 5: Booking Summary & Confirm
  // 6: Live Status Tracking
  const [step, setStep] = useState<number>(1);

  // Step 1: Location
  const [locationText, setLocationText] = useState(userLocation || 'Indiranagar, Bengaluru');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Step 2: Vehicle
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(vehicles[0] || null);
  const [customVehicleType, setCustomVehicleType] = useState('Car');
  const [customVehicleModel, setCustomVehicleModel] = useState('');
  const [customRegNumber, setCustomRegNumber] = useState('');
  const [useCustomVehicle, setUseCustomVehicle] = useState(false);

  // Step 3: Problem description
  const [problemDescription, setProblemDescription] = useState('Engine won\'t start / battery drained');
  const [urgencyLevel, setUrgencyLevel] = useState<'immediate' | 'within-1hr'>('immediate');
  const quickProblems = [
    'Engine won\'t start / Battery dead',
    'Flat tyre / Puncture',
    'Brake failure / Squealing',
    'Engine overheating & smoke',
    'Clutch wire broken',
    'Sudden breakdown on road'
  ];

  // Step 4: Mechanic Selection
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
  const [isSearchingMechanics, setIsSearchingMechanics] = useState(false);

  // Step 6: Tracking State
  const [createdBookingId, setCreatedBookingId] = useState<string>('');
  const [instantStatus, setInstantStatus] = useState<BookingStatus>('SEARCHING');

  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const res = await detectBrowserGeolocation();
      setIsDetectingLocation(false);
      setLocationText(res.locationName);
      setUserLocation(res.locationName);
      addToast('Location Updated', `📍 ${res.locationName}`, 'success');
    } catch (e: any) {
      setIsDetectingLocation(false);
      addToast('Notice', 'Unable to fetch GPS. You can type your location.', 'warning');
    }
  };

  const handleGoToMechanicSearch = () => {
    setStep(4);
    setIsSearchingMechanics(true);
    setTimeout(() => {
      setIsSearchingMechanics(false);
      // Auto preselect top matching mechanic
      if (mechanics.length > 0) {
        setSelectedMechanic(mechanics[0]);
      }
    }, 1000);
  };

  const handleConfirmInstantBooking = () => {
    if (!selectedMechanic) return;

    const targetVehicle = useCustomVehicle
      ? {
          make: customVehicleModel.split(' ')[0] || 'Vehicle',
          model: customVehicleModel || 'Standard',
          registrationNumber: customRegNumber || 'KA 01 AB 1234',
          type: customVehicleType,
          imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400'
        }
      : {
          make: selectedVehicle?.make || 'Hyundai',
          model: selectedVehicle?.model || 'Creta',
          registrationNumber: selectedVehicle?.registrationNumber || 'KA 03 MN 5678',
          type: selectedVehicle?.type || 'Car',
          imageUrl: selectedVehicle?.imageUrl
        };

    const newId = createBooking({
      mechanic: selectedMechanic,
      vehicle: targetVehicle,
      serviceName: '⚡ Instant Emergency Assistance',
      serviceCategory: 'Instant Breakdown',
      issueDescription: problemDescription,
      serviceMode: 'doorstep',
      pickupAddress: locationText,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timeSlot: 'Immediate (Within 20-30 mins)',
      estimatedCost: '₹350 - ₹700 (Inspection & Diagnostic)'
    });

    setCreatedBookingId(newId);
    setInstantStatus('MECHANIC_ASSIGNED');
    setStep(6);
    addToast('Instant Booking Created', `Mechanic assigned for #${newId}`, 'success');
  };

  const resetFlow = () => {
    setStep(1);
    setSelectedMechanic(null);
    setCreatedBookingId('');
    onClose();
  };

  // Status simulation controls for instant status testing
  const advanceInstantStatus = (next: BookingStatus) => {
    setInstantStatus(next);
    addToast('Instant Booking Status Updated', `Status changed to ${next.replace(/_/g, ' ')}`, 'info');
  };

  return (
    <Modal isOpen={isOpen} onClose={resetFlow} title="⚡ Instant Service Booking" maxWidth="lg">
      <div className="space-y-6 text-slate-800">
        {/* Progress Breadcrumbs */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-[11px] font-bold">
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-mechnik-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              1
            </span>
            <span className={step === 1 ? 'text-mechnik-600 font-extrabold' : 'text-slate-400'}>
              Location
            </span>
          </div>
          <span>→</span>
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-mechnik-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            <span className={step === 2 ? 'text-mechnik-600 font-extrabold' : 'text-slate-400'}>
              Vehicle
            </span>
          </div>
          <span>→</span>
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-mechnik-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>
            <span className={step === 3 ? 'text-mechnik-600 font-extrabold' : 'text-slate-400'}>
              Issue
            </span>
          </div>
          <span>→</span>
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                step >= 4 ? 'bg-mechnik-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              4
            </span>
            <span className={step === 4 ? 'text-mechnik-600 font-extrabold' : 'text-slate-400'}>
              Mechanic
            </span>
          </div>
          <span>→</span>
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                step >= 5 ? 'bg-mechnik-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              5
            </span>
            <span className={step >= 5 ? 'text-mechnik-600 font-extrabold' : 'text-slate-400'}>
              Confirm
            </span>
          </div>
        </div>

        {/* STEP 1: CONFIRM CURRENT LOCATION */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-start gap-3">
              <Zap className="w-5 h-5 text-mechnik-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Need a mechanic right now?</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Confirm your exact breakdown location so nearby mobile mechanics can reach you immediately.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Current Breakdown Location *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-mechnik-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="Street, area or landmark..."
                  className="w-full pl-10 pr-32 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-mechnik-500 shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetectingLocation}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  {isDetectingLocation ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Navigation className="w-3.5 h-3.5" />
                  )}
                  <span>GPS Auto-Detect</span>
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-primary px-6 py-2.5 rounded-xl font-bold text-xs shadow-mechnik flex items-center gap-2"
              >
                <span>Continue: Select Vehicle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT VEHICLE */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h4 className="text-sm font-bold text-slate-900">Which vehicle needs assistance?</h4>

            {/* Saved Vehicles List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  onClick={() => {
                    setSelectedVehicle(v);
                    setUseCustomVehicle(false);
                  }}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    !useCustomVehicle && selectedVehicle?.id === v.id
                      ? 'border-mechnik-500 bg-orange-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-100 text-mechnik-600 flex items-center justify-center flex-shrink-0">
                    {v.type === 'Car' && <Car className="w-6 h-6" />}
                    {v.type === 'Bike' && <Bike className="w-6 h-6" />}
                    {v.type === 'Truck' && <Truck className="w-6 h-6" />}
                    {v.type === 'Tractor' && <Tractor className="w-6 h-6" />}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900">{v.nickname || `${v.make} ${v.model}`}</h5>
                    <p className="text-[11px] text-slate-500">{v.registrationNumber || 'No Plate Registered'}</p>
                    <span className="text-[10px] font-bold text-mechnik-600 uppercase">{v.type}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Option to use custom vehicle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setUseCustomVehicle(!useCustomVehicle)}
                className="text-xs text-mechnik-600 font-bold hover:underline"
              >
                {useCustomVehicle ? '← Select from My Garage' : '+ Different vehicle not in my garage'}
              </button>

              {useCustomVehicle && (
                <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Type</label>
                    <select
                      value={customVehicleType}
                      onChange={(e) => setCustomVehicleType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    >
                      <option value="Car">Car</option>
                      <option value="Bike">Bike / Scooter</option>
                      <option value="Truck">Commercial Truck</option>
                      <option value="Tractor">Tractor / Agri</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Make & Model</label>
                    <input
                      type="text"
                      value={customVehicleModel}
                      onChange={(e) => setCustomVehicleModel(e.target.value)}
                      placeholder="e.g. Maruti Swift Dzire"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Reg Number</label>
                    <input
                      type="text"
                      value={customRegNumber}
                      onChange={(e) => setCustomRegNumber(e.target.value)}
                      placeholder="e.g. KA 03 AB 1234"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-primary px-6 py-2.5 rounded-xl font-bold text-xs shadow-mechnik flex items-center gap-2"
              >
                <span>Continue: Describe Problem</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SELECT / DESCRIBE PROBLEM */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h4 className="text-sm font-bold text-slate-900">What issue are you facing?</h4>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Quick Problem Select:
              </label>
              <div className="flex flex-wrap gap-2">
                {quickProblems.map((prob) => (
                  <button
                    key={prob}
                    type="button"
                    onClick={() => setProblemDescription(prob)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      problemDescription === prob
                        ? 'bg-mechnik-500 text-white font-bold shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {prob}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Describe the problem in detail:
              </label>
              <textarea
                rows={3}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Explain what happened, warning lights on dashboard, any sounds..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-mechnik-500"
              />
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleGoToMechanicSearch}
                className="btn-primary px-6 py-2.5 rounded-xl font-bold text-xs shadow-mechnik flex items-center gap-2"
              >
                <span>Find Available Mechanics Nearby</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: FIND & SELECT NEARBY MECHANIC */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Available Mechanics Nearby</h4>
                <p className="text-xs text-slate-500">
                  Ready to dispatch to <strong>{locationText}</strong>
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {mechanics.length} Available in Area
              </span>
            </div>

            {isSearchingMechanics ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full border-4 border-mechnik-500 border-t-transparent animate-spin"></div>
                <p className="text-xs font-bold text-slate-700">Scanning for active mechanics near you...</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {mechanics.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMechanic(m)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      selectedMechanic?.id === m.id
                        ? 'border-mechnik-500 bg-orange-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-black flex items-center justify-center text-sm shadow-inner">
                        {m.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-slate-900">{m.shopName}</h5>
                          {m.verified && (
                            <span title="Verified Workshop">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600">Lead: {m.name} • {m.experienceYears} yrs exp</p>
                        <div className="flex items-center gap-2 mt-1">
                          <RatingStars rating={m.rating} totalReviews={m.totalReviews} size="sm" />
                          <span className="text-[10px] text-slate-400">•</span>
                          <span className="text-[11px] font-bold text-mechnik-600">
                            ~{m.distanceKm || 1.8} km away
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        ⚡ 15-20 min arrival
                      </span>
                      <p className="text-xs text-slate-500 mt-1.5 font-medium">Doorstep Pickup</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!selectedMechanic}
                onClick={() => setStep(5)}
                className="btn-primary px-6 py-2.5 rounded-xl font-bold text-xs shadow-mechnik flex items-center gap-2 disabled:opacity-50"
              >
                <span>Review & Confirm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: BOOKING SUMMARY & CONFIRMATION */}
        {step === 5 && selectedMechanic && (
          <div className="space-y-4 animate-in fade-in">
            <h4 className="text-sm font-bold text-slate-900">Instant Booking Summary</h4>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Service Type</span>
                <span className="font-bold text-mechnik-600 uppercase">⚡ Instant Emergency Breakdown</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Location</span>
                <span className="font-bold text-slate-900">{locationText}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Vehicle</span>
                <span className="font-bold text-slate-900">
                  {useCustomVehicle
                    ? `${customVehicleModel} (${customVehicleType})`
                    : `${selectedVehicle?.make} ${selectedVehicle?.model} (${selectedVehicle?.registrationNumber})`}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Assigned Workshop</span>
                <span className="font-bold text-slate-900">{selectedMechanic.shopName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Estimated Arrival</span>
                <span className="font-bold text-emerald-700">Immediate (Within 15-25 mins)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Diagnostic Inspection Fee</span>
                <span className="font-extrabold text-sm text-slate-900 font-mono">₹350</span>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmInstantBooking}
                className="btn-primary px-8 py-3 rounded-xl font-bold text-sm shadow-mechnik flex items-center gap-2"
              >
                <span>Confirm & Dispatch Mechanic</span>
                <Zap className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: INSTANT BOOKING STATUS TRACKING */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center">
              <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-600 mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Instant Booking Confirmed!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Booking ID: <strong className="font-mono text-mechnik-600">#{createdBookingId}</strong>
              </p>
            </div>

            {/* Active Status Box */}
            <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 text-center">
              <span className="text-[10px] font-bold text-mechnik-700 uppercase tracking-wider block mb-1">
                Live Status
              </span>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                {instantStatus === 'SEARCHING' && '🔍 Searching for mechanic...'}
                {instantStatus === 'MECHANIC_ASSIGNED' && '👤 Mechanic Assigned'}
                {instantStatus === 'MECHANIC_ACCEPTED' && '✅ Mechanic Accepted Your Request'}
                {instantStatus === 'ON_THE_WAY' && '🛵 Mechanic is On The Way'}
                {instantStatus === 'SERVICE_STARTED' && '🔧 Service Started'}
                {instantStatus === 'IN_PROGRESS' && '⚙️ Service In Progress'}
                {instantStatus === 'COMPLETED' && '🎉 Service Completed!'}
                {instantStatus === 'CANCELLED' && '❌ Booking Cancelled'}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                {selectedMechanic?.shopName} • {selectedMechanic?.phone || '+91 98450 12345'}
              </p>
            </div>

            {/* Status Simulation Bar for presentation and testing */}
            <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Simulate Status Transition (Interactive Testing):
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => advanceInstantStatus('SEARCHING')}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${instantStatus === 'SEARCHING' ? 'bg-mechnik-500 text-white' : 'bg-white text-slate-700'}`}
                >
                  Searching
                </button>
                <button
                  type="button"
                  onClick={() => advanceInstantStatus('MECHANIC_ASSIGNED')}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${instantStatus === 'MECHANIC_ASSIGNED' ? 'bg-mechnik-500 text-white' : 'bg-white text-slate-700'}`}
                >
                  Assigned
                </button>
                <button
                  type="button"
                  onClick={() => advanceInstantStatus('MECHANIC_ACCEPTED')}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${instantStatus === 'MECHANIC_ACCEPTED' ? 'bg-mechnik-500 text-white' : 'bg-white text-slate-700'}`}
                >
                  Accepted
                </button>
                <button
                  type="button"
                  onClick={() => advanceInstantStatus('ON_THE_WAY')}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${instantStatus === 'ON_THE_WAY' ? 'bg-mechnik-500 text-white' : 'bg-white text-slate-700'}`}
                >
                  On The Way
                </button>
                <button
                  type="button"
                  onClick={() => advanceInstantStatus('SERVICE_STARTED')}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${instantStatus === 'SERVICE_STARTED' ? 'bg-mechnik-500 text-white' : 'bg-white text-slate-700'}`}
                >
                  Started
                </button>
                <button
                  type="button"
                  onClick={() => advanceInstantStatus('COMPLETED')}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${instantStatus === 'COMPLETED' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700'}`}
                >
                  Completed
                </button>
                <button
                  type="button"
                  onClick={() => advanceInstantStatus('CANCELLED')}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${instantStatus === 'CANCELLED' ? 'bg-red-600 text-white' : 'bg-white text-slate-700'}`}
                >
                  Cancelled
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={resetFlow}
                className="btn-primary px-6 py-2.5 rounded-xl font-bold text-xs shadow-mechnik"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
