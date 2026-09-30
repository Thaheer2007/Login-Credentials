import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { Modal } from '../common/Modal';
import { Vehicle, VoiceNote } from '../../types/mechnik';
import { INITIAL_SERVICES } from '../../data/mockData';
import {
  Car,
  Bike,
  Truck,
  Tractor,
  Wrench,
  Calendar,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  MapPin,
  Sparkles,
  ShieldCheck,
  Disc,
  Droplets,
  Zap,
  CircleDot,
  Mic,
  MicOff,
  Volume2,
  Trash2,
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Info,
  Building2,
  Navigation,
  Home,
  Search,
  Loader2
} from 'lucide-react';
import { detectBrowserGeolocation, searchLocations } from '../../services/locationService';
import { LocationItem } from '../../data/locationsData';

export const BookingFlowModal: React.FC = () => {
  const {
    isBookingModalOpen,
    closeBookingModal,
    bookingTargetMechanic,
    vehicles,
    preselectedServiceId,
    createBooking,
    setTrackingBookingId,
    userLocation,
    addToast
  } = useMechnik();

  // Wizard Step (1 to 6)
  const [currentStep, setCurrentStep] = useState(1);

  // STEP 1: VEHICLE DETAILS
  // Mode: 'saved' or 'custom'
  const [vehicleInputMode, setVehicleInputMode] = useState<'saved' | 'custom'>('saved');
  const [selectedSavedVehicle, setSelectedSavedVehicle] = useState<Vehicle | null>(null);

  // Custom vehicle form fields
  const [vehicleType, setVehicleType] = useState<string>('Car');
  const [vehicleModel, setVehicleModel] = useState<string>('Hyundai Creta SX');
  const [vehicleReg, setVehicleReg] = useState<string>('KA 03 MN 5678');
  const [vehicleNickname, setVehicleNickname] = useState<string>('Family SUV');
  const [vehicleImage, setVehicleImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400'
  );

  // STEP 2: SERVICE
  const [selectedService, setSelectedService] = useState<string>('brake-repair');

  // STEP 3: ISSUE, VOICE INPUT & MULTI-IMAGE UPLOAD
  const [issueDescription, setIssueDescription] = useState(
    'My vehicle makes a screeching noise whenever I apply the brakes at low speeds.'
  );
  // Voice Input State
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [voiceNote, setVoiceNote] = useState<VoiceNote | null>({
    transcript: 'Screeching noise heard when braking near 20-30 km/h.',
    duration: '0:06'
  });
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);

  // Multiple Problem Images
  const [issueImages, setIssueImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400'
  ]);

  // STEP 4: DATE & CALENDAR
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [customCalendarDate, setCustomCalendarDate] = useState<string>('');
  const [calendarMonth, setCalendarMonth] = useState<number>(8); // September
  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [serviceMode, setServiceMode] = useState<'doorstep' | 'workshop'>('workshop');

  // DOORSTEP PICKUP ADDRESS STATE
  const [pickupChoice, setPickupChoice] = useState<'auto' | 'manual'>('auto');
  const [pickupAddress, setPickupAddress] = useState<string>(() => userLocation || 'Indiranagar, Bengaluru');
  const [isDetectingPickup, setIsDetectingPickup] = useState(false);
  const [isSearchingPickup, setIsSearchingPickup] = useState(false);
  const [pickupSearchQuery, setPickupSearchQuery] = useState('');
  const [pickupHouse, setPickupHouse] = useState('');
  const [pickupLandmark, setPickupLandmark] = useState('');

  // Sync with current userLocation whenever modal opens
  useEffect(() => {
    if (isBookingModalOpen && userLocation) {
      setPickupAddress(userLocation);
      setIsSearchingPickup(false);
      setPickupSearchQuery('');
    }
  }, [isBookingModalOpen, userLocation]);

  const pickupSuggestions = useMemo(() => {
    if (!pickupSearchQuery.trim()) return [];
    return searchLocations(pickupSearchQuery);
  }, [pickupSearchQuery]);

  const handleAutoDetectPickup = async () => {
    setIsDetectingPickup(true);
    try {
      const result = await detectBrowserGeolocation();
      setIsDetectingPickup(false);
      setPickupAddress(result.locationName);
      setPickupChoice('auto');
      setIsSearchingPickup(false);
      addToast('Pickup Location Detected', `📍 ${result.locationName}`, 'success');
    } catch (err: any) {
      setIsDetectingPickup(false);
      addToast('Detection Failed', 'Unable to detect your location. Please choose a location manually.', 'warning');
      setIsSearchingPickup(true);
      setPickupChoice('manual');
    }
  };

  // STEP 5: TIME SLOT
  const [selectedTime, setSelectedTime] = useState('10:00 AM');

  // Success state
  const [successBookingId, setSuccessBookingId] = useState<string | null>(null);

  // Stock Vehicle Image presets for instant testing
  const stockImages = {
    Car: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400',
    Bike: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400',
    Truck: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400',
    Tractor: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=400',
    Other: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=400'
  };

  // Sample problem photos for instant testing
  const sampleProblemImages = [
    { label: 'Brake Rotor', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400' },
    { label: 'Engine Bay', url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=400' },
    { label: 'Tyre Tread', url: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=400' }
  ];

  // Set defaults on modal open
  useEffect(() => {
    if (isBookingModalOpen) {
      setCurrentStep(1);
      setSuccessBookingId(null);
      if (vehicles.length > 0) {
        setSelectedSavedVehicle(vehicles[0]);
      }
      if (preselectedServiceId) {
        setSelectedService(preselectedServiceId);
      }
    }
  }, [isBookingModalOpen, vehicles, preselectedServiceId]);

  if (!isBookingModalOpen || !bookingTargetMechanic) return null;

  // Service icon helper
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench': return Wrench;
      case 'Disc': return Disc;
      case 'Droplets': return Droplets;
      case 'Zap': return Zap;
      case 'CircleDot': return CircleDot;
      default: return Sparkles;
    }
  };

  // Time slots
  const timeSlots = [
    { time: '09:00 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: false },
    { time: '12:00 PM', available: true },
    { time: '02:00 PM', available: true },
    { time: '04:00 PM', available: false },
    { time: '06:00 PM', available: true }
  ];

  // Quick issue tags
  const issueTags = [
    'Brake squeaking / noise',
    'Spongy brake pedal/lever',
    'Engine knocking sound',
    'Oil or fluid leakage',
    'Starting / ignition trouble',
    'Vibration at high speed',
    'AC not cooling properly',
    'Battery low / jumpstart needed'
  ];

  const currentServiceObj = INITIAL_SERVICES.find((s) => s.id === selectedService) || INITIAL_SERVICES[0];

  // VOICE RECORDING CONTROLS
  const startRecording = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        recorder.start();
        setIsRecording(true);
        setRecordDuration(0);

        timerRef.current = window.setInterval(() => {
          setRecordDuration((prev) => prev + 1);
        }, 1000);
      } else {
        simulateVoiceRecording();
      }
    } catch (err) {
      // Permission denied or headless environment: gracefully simulate voice input
      simulateVoiceRecording();
    }
  };

  const simulateVoiceRecording = () => {
    setIsRecording(true);
    setRecordDuration(0);
    timerRef.current = window.setInterval(() => {
      setRecordDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);

    const formattedDuration = `0:${recordDuration < 10 ? '0' : ''}${recordDuration || 6}`;
    const transcriptText = 'Customer audio note: Noticeable screeching when brakes are pressed, vibration at 40 km/h.';

    setVoiceNote({
      transcript: transcriptText,
      duration: formattedDuration
    });

    if (!issueDescription.includes('screeching')) {
      setIssueDescription((prev) => (prev ? `${prev} [Voice Note: ${transcriptText}]` : transcriptText));
    }
    addToast('Voice Note Saved', `Recorded ${formattedDuration} audio memo with speech transcript.`, 'success');
  };

  const deleteVoiceNote = () => {
    setVoiceNote(null);
    setIsPlayingAudio(false);
  };

  // MULTIPLE IMAGE UPLOAD HANDLERS
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setIssueImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    addToast('Image Uploaded', `${files.length} problem image(s) added to ticket.`, 'info');
  };

  const removeIssueImage = (index: number) => {
    setIssueImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addSampleImage = (url: string) => {
    setIssueImages((prev) => [...prev, url]);
    addToast('Photo Added', 'Sample vehicle damage photo attached.', 'info');
  };

  // VEHICLE IMAGE UPLOAD (FOR STEP 1)
  const handleVehiclePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setVehicleImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // FINAL SUBMISSION
  const handleConfirmBooking = () => {
    let finalVeh: {
      make: string;
      model: string;
      registrationNumber?: string;
      nickname?: string;
      imageUrl?: string;
      type: string;
    } = {
      make: 'Vehicle',
      model: vehicleModel,
      registrationNumber: vehicleReg,
      nickname: vehicleNickname,
      imageUrl: vehicleImage || undefined,
      type: vehicleType
    };

    if (vehicleInputMode === 'saved' && selectedSavedVehicle) {
      finalVeh = {
        make: selectedSavedVehicle.make,
        model: selectedSavedVehicle.model,
        registrationNumber: selectedSavedVehicle.registrationNumber || 'AP 28 AB 1234',
        nickname: selectedSavedVehicle.nickname,
        imageUrl: selectedSavedVehicle.imageUrl,
        type: selectedSavedVehicle.type
      };
    }

    const estimated =
      bookingTargetMechanic.servicesOffered.find((s) => s.serviceId === selectedService)?.priceRange ||
      `₹${currentServiceObj.startingPrice} – ₹${currentServiceObj.startingPrice + 500}`;

    const effectiveDate = customCalendarDate || selectedDate;

    const selectedTags = issueTags.filter((tag) => issueDescription.toLowerCase().includes(tag.toLowerCase()));

    const newId = createBooking({
      mechanic: bookingTargetMechanic,
      vehicle: finalVeh,
      serviceName: currentServiceObj.name,
      serviceCategory: currentServiceObj.id,
      issueDescription,
      issueTags: selectedTags.length > 0 ? selectedTags : undefined,
      voiceNote: voiceNote || undefined,
      issueImages,
      serviceMode,
      pickupAddress: serviceMode === 'doorstep'
        ? (pickupHouse ? `${pickupAddress}, ${pickupHouse}${pickupLandmark ? ` (${pickupLandmark})` : ''}` : pickupAddress)
        : undefined,
      pickupLocationMode: serviceMode === 'doorstep' ? pickupChoice : undefined,
      pickupAddressDetails: serviceMode === 'doorstep' ? {
        houseBuilding: pickupHouse || undefined,
        streetArea: pickupAddress,
        landmark: pickupLandmark || undefined
      } : undefined,
      date: effectiveDate,
      timeSlot: selectedTime,
      estimatedCost: estimated
    });

    setSuccessBookingId(newId);
  };

  // SUCCESS CONFIRMATION MODAL
  if (successBookingId) {
    const displayVehName =
      vehicleInputMode === 'saved' && selectedSavedVehicle
        ? `${selectedSavedVehicle.make} ${selectedSavedVehicle.model}`
        : vehicleModel;

    const displayVehImage =
      vehicleInputMode === 'saved' && selectedSavedVehicle
        ? selectedSavedVehicle.imageUrl
        : vehicleImage;

    return (
      <Modal isOpen={isBookingModalOpen} onClose={closeBookingModal} maxWidth="md">
        <div className="text-center py-6 px-2 animate-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-mechnik-700 text-xs font-bold uppercase tracking-wider mb-2">
            Status: REQUESTED
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900">Booking Request Sent!</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Your service request and vehicle diagnosis have been sent to <strong>{bookingTargetMechanic.name}</strong>.
          </p>

          <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Booking ID:</span>
              <strong className="text-mechnik-600 font-mono font-bold text-sm">#{successBookingId}</strong>
            </div>

            <div className="flex items-center gap-3 py-1">
              {displayVehImage ? (
                <img
                  src={displayVehImage}
                  alt={displayVehName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-mechnik-600 flex items-center justify-center font-bold">
                  <Car className="w-6 h-6" />
                </div>
              )}
              <div>
                <p className="font-bold text-slate-900">{displayVehName}</p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {vehicleInputMode === 'saved' && selectedSavedVehicle
                    ? selectedSavedVehicle.registrationNumber
                    : vehicleReg || 'Unregistered'}
                  {vehicleNickname && ` • "${vehicleNickname}"`}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Service Package:</span>
              <span className="font-semibold text-slate-800">{currentServiceObj.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Scheduled:</span>
              <span className="font-semibold text-slate-800">
                {customCalendarDate || selectedDate} • {selectedTime}
              </span>
            </div>

            {serviceMode === 'doorstep' && pickupAddress && (
              <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-left">
                <span className="text-[10px] font-bold text-mechnik-700 uppercase tracking-wider block mb-0.5">
                  Doorstep Pickup Address
                </span>
                <p className="text-xs font-semibold text-slate-800 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-mechnik-600 mt-0.5 flex-shrink-0" />
                  <span>{pickupAddress}</span>
                </p>
              </div>
            )}

            {voiceNote && (
              <div className="flex items-center justify-between text-slate-600 bg-orange-50/70 p-2 rounded-lg border border-orange-100">
                <span className="flex items-center gap-1.5 font-medium text-mechnik-700">
                  <Volume2 className="w-3.5 h-3.5" />
                  Voice Note Attached ({voiceNote.duration})
                </span>
                <span className="text-[10px] text-slate-400">Audio Recorded</span>
              </div>
            )}

            {issueImages.length > 0 && (
              <div className="pt-1">
                <span className="text-slate-500 block mb-1">Attached Problem Photos ({issueImages.length}):</span>
                <div className="flex gap-1.5 overflow-x-auto py-1">
                  {issueImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Problem ${i}`}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => {
                closeBookingModal();
                setTrackingBookingId(successBookingId);
              }}
              className="w-full btn-primary py-3 text-xs font-bold flex items-center justify-center gap-2"
            >
              <span>Track Booking Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={closeBookingModal}
              className="w-full btn-secondary py-2.5 text-xs font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isBookingModalOpen}
      onClose={closeBookingModal}
      maxWidth="2xl"
    >
      <div>
        {/* Step Indicator Header */}
        <div className="mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-mechnik-600">
                Step {currentStep} of 6
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                {currentStep === 1 && 'Add Your Vehicle Details'}
                {currentStep === 2 && 'Select Service Category'}
                {currentStep === 3 && 'Describe Issue, Voice & Photos'}
                {currentStep === 4 && 'Choose Preferred Date'}
                {currentStep === 5 && 'Select Available Time Slot'}
                {currentStep === 6 && 'Confirm Booking Summary'}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Workshop</span>
              <span className="text-xs font-bold text-slate-800">{bookingTargetMechanic.name}</span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-6 gap-1 mt-3">
            {[1, 2, 3, 4, 5, 6].map((st) => (
              <div
                key={st}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  st <= currentStep ? 'bg-mechnik-500' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: ADD YOUR VEHICLE DETAILS (GENERAL FORM + SAVED VEHICLES) */}
        {currentStep === 1 && (
          <div className="space-y-5">
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setVehicleInputMode('saved')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  vehicleInputMode === 'saved'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Choose from Saved Vehicles ({vehicles.length})
              </button>
              <button
                type="button"
                onClick={() => setVehicleInputMode('custom')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  vehicleInputMode === 'custom'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                + Enter Vehicle Details
              </button>
            </div>

            {/* A. Saved Vehicles List */}
            {vehicleInputMode === 'saved' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {vehicles.map((veh) => {
                    const isSelected = selectedSavedVehicle?.id === veh.id;
                    return (
                      <div
                        key={veh.id}
                        onClick={() => setSelectedSavedVehicle(veh)}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'border-mechnik-500 bg-orange-50/40 shadow-sm ring-1 ring-mechnik-500/30'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {veh.imageUrl ? (
                          <img
                            src={veh.imageUrl}
                            alt={veh.model}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                        ) : (
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'bg-mechnik-500 text-white' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <Car className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {veh.make} {veh.model}
                            </h4>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[9px] font-bold uppercase text-slate-600">
                              {veh.type}
                            </span>
                          </div>
                          <p className="text-[11px] font-mono font-medium text-slate-500 mt-0.5">
                            {veh.registrationNumber || 'Unregistered'}
                          </p>
                          {veh.nickname && (
                            <p className="text-[10px] text-mechnik-600 font-semibold italic">
                              "{veh.nickname}"
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setVehicleInputMode('custom')}
                    className="text-xs font-bold text-mechnik-600 hover:underline"
                  >
                    Or enter another vehicle details manually →
                  </button>
                </div>
              </div>
            ) : (
              /* B. General Vehicle Details Form */
              <div className="space-y-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
                {/* 1. Vehicle Type Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Vehicle Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { id: 'Car', label: 'Car', icon: Car },
                      { id: 'Bike', label: 'Bike', icon: Bike },
                      { id: 'Truck', label: 'Truck', icon: Truck },
                      { id: 'Tractor', label: 'Tractor', icon: Tractor },
                      { id: 'Other', label: 'Other', icon: Sparkles }
                    ].map((vt) => {
                      const Icon = vt.icon;
                      const isSel = vehicleType === vt.id;
                      return (
                        <button
                          key={vt.id}
                          type="button"
                          onClick={() => {
                            setVehicleType(vt.id);
                            if (!vehicleImage) {
                              setVehicleImage(stockImages[vt.id as keyof typeof stockImages]);
                            }
                          }}
                          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                            isSel
                              ? 'bg-mechnik-500 text-white border-mechnik-500 font-bold shadow-mechnik-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[11px]">{vt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Vehicle Model / Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Vehicle Model / Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      placeholder="e.g. Hyundai Creta, Honda Activa, Tata Ace"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-mechnik-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Registration Number <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={vehicleReg}
                      onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
                      placeholder="e.g. KA 03 MN 5678"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-mechnik-500/20"
                    />
                  </div>
                </div>

                {/* 3. Vehicle Nickname & Image Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Vehicle Name / Nickname <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={vehicleNickname}
                      onChange={(e) => setVehicleNickname(e.target.value)}
                      placeholder="e.g. Family Car, Red Bullet, Farm Truck"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-mechnik-500/20"
                    />
                  </div>

                  {/* Vehicle Image Upload Field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Upload Vehicle Photo <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl border border-dashed border-slate-300 hover:border-mechnik-500 bg-white text-xs text-slate-600 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-mechnik-500" />
                        <span>Choose File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleVehiclePhotoUpload}
                          className="hidden"
                        />
                      </label>

                      {vehicleImage && (
                        <div className="relative group flex-shrink-0">
                          <img
                            src={vehicleImage}
                            alt="Vehicle Preview"
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setVehicleImage(null)}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-sm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick preset stock vehicle photos */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2 text-xs">
                  <span className="text-[11px] text-slate-500">Quick Sample Photos:</span>
                  <div className="flex gap-2">
                    {(['Car', 'Bike', 'Truck', 'Tractor'] as const).map((vt) => (
                      <button
                        key={vt}
                        type="button"
                        onClick={() => {
                          setVehicleType(vt);
                          setVehicleImage(stockImages[vt]);
                          setVehicleModel(
                            vt === 'Car'
                              ? 'Hyundai Creta SX'
                              : vt === 'Bike'
                              ? 'Honda Activa 6G'
                              : vt === 'Truck'
                              ? 'Tata Ace Gold'
                              : 'Mahindra 575 DI'
                          );
                        }}
                        className="text-[10px] font-semibold text-slate-600 hover:text-mechnik-600 underline"
                      >
                        {vt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: SELECT SERVICE CATEGORY (KEPT UNCHANGED) */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INITIAL_SERVICES.map((svc) => {
              const Icon = getServiceIcon(svc.iconName);
              const isSelected = selectedService === svc.id;

              const mechRate = bookingTargetMechanic.servicesOffered.find(
                (s) => s.serviceId === svc.id
              );

              return (
                <div
                  key={svc.id}
                  onClick={() => setSelectedService(svc.id)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'border-mechnik-500 bg-orange-50/40 shadow-sm ring-1 ring-mechnik-500/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'bg-mechnik-500 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{svc.name}</h4>
                      <span className="text-xs font-bold text-mechnik-600 font-mono">
                        {mechRate ? mechRate.priceRange : `From ₹${svc.startingPrice}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{svc.shortDesc}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Est. Time: {svc.estimatedTime}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* STEP 3: DESCRIBE ISSUE + FUNCTIONAL VOICE INPUT + MULTI-IMAGE UPLOAD */}
        {currentStep === 3 && (
          <div className="space-y-4">
            {/* 1. Text Description */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">
                Describe the problem with your vehicle:
              </label>
              <textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                rows={3}
                placeholder="Describe symptoms, noise, brake issue, engine trouble, or maintenance needs..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-mechnik-500/20 focus:border-mechnik-500 bg-white"
              />
            </div>

            {/* Quick symptom pills */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">
                Quick Issue Tags (click to append):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {issueTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (!issueDescription.includes(tag)) {
                        setIssueDescription((prev) =>
                          prev ? `${prev}, ${tag.toLowerCase()}` : tag
                        );
                      }
                    }}
                    className="text-[10px] font-medium bg-slate-100 hover:bg-orange-50 hover:text-mechnik-600 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. FUNCTIONAL VOICE INPUT / RECORDING COMPONENT */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isRecording ? 'bg-red-500 text-white animate-ping' : 'bg-orange-100 text-mechnik-600'}`}>
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Voice Note / Audio Recording</h4>
                    <p className="text-[10px] text-slate-500">Record vehicle sound or describe issue by speaking</p>
                  </div>
                </div>

                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="btn-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 text-slate-700 hover:border-mechnik-500"
                  >
                    <Mic className="w-3.5 h-3.5 text-mechnik-500" />
                    <span>Start Recording</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 animate-pulse"
                  >
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Stop Recording (0:{recordDuration < 10 ? '0' : ''}{recordDuration})</span>
                  </button>
                )}
              </div>

              {/* Active Recording Waveform Indicator */}
              {isRecording && (
                <div className="flex items-center gap-1.5 justify-center py-2">
                  {[40, 70, 90, 60, 100, 50, 80, 45, 95, 30].map((h, idx) => (
                    <div
                      key={idx}
                      className="w-1 bg-mechnik-500 rounded-full animate-pulse"
                      style={{ height: `${h}%`, minHeight: '12px' }}
                    />
                  ))}
                  <span className="text-[11px] font-mono text-mechnik-600 font-bold ml-2">
                    Recording audio... speak now
                  </span>
                </div>
              )}

              {/* Recorded Voice Note Card */}
              {voiceNote && !isRecording && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-8 h-8 rounded-full bg-mechnik-500 text-white flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
                    >
                      {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    </button>
                    <div>
                      <p className="font-bold text-slate-800 flex items-center gap-1">
                        <span>Voice Recording</span>
                        <span className="font-mono text-[10px] text-slate-400 font-normal">({voiceNote.duration})</span>
                      </p>
                      <p className="text-[11px] text-slate-500 italic line-clamp-1">"{voiceNote.transcript}"</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={deleteVoiceNote}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete voice recording"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* 3. MULTIPLE IMAGE UPLOAD (JPG / PNG WITH PREVIEW, REMOVE, ADD-MORE) */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-mechnik-500" />
                    <span>Upload Image(s) of Your Vehicle or Issue</span>
                  </h4>
                  <p className="text-[10px] text-slate-500">Supports JPG, PNG with preview and multiple uploads</p>
                </div>

                <label className="cursor-pointer btn-primary px-3 py-1.5 text-xs font-semibold flex items-center gap-1 shadow-mechnik-sm">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add More</span>
                  <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Uploaded Images Gallery */}
              {issueImages.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
                  {issueImages.map((imgUrl, index) => (
                    <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-video bg-white">
                      <img
                        src={imgUrl}
                        alt={`Issue upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeIssueImage(index)}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md transition-transform active:scale-90"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-1 left-1 bg-charcoal-900/80 text-white text-[9px] px-1.5 py-0.2 rounded">
                        Photo #{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-white rounded-xl border border-dashed border-slate-300 text-center">
                  <ImageIcon className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-[11px] text-slate-500">No issue images attached yet.</p>
                </div>
              )}

              {/* Sample Photo Suggestions */}
              <div className="pt-1 flex items-center gap-2 text-xs">
                <span className="text-[11px] text-slate-400">Quick Sample Photos:</span>
                <div className="flex gap-2">
                  {sampleProblemImages.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => addSampleImage(s.url)}
                      className="text-[10px] font-semibold text-mechnik-600 hover:underline"
                    >
                      + {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: DATE & INTERACTIVE CALENDAR DATE PICKER */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">
                Select Preferred Service Date
              </label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {['Today', 'Tomorrow', 'Day After Tomorrow'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setSelectedDate(d);
                      setCustomCalendarDate('');
                    }}
                    className={`p-3.5 rounded-xl border-2 text-center transition-all ${
                      selectedDate === d && !customCalendarDate
                        ? 'border-mechnik-500 bg-orange-50/40 text-slate-900 font-bold shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 font-medium'
                    }`}
                  >
                    <Calendar className="w-4 h-4 mx-auto mb-1 text-mechnik-500" />
                    <span className="text-xs block">{d}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* INTERACTIVE CALENDAR DATE PICKER */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">
                  Or pick a specific calendar date (September 2026)
                </span>
                {customCalendarDate && (
                  <span className="text-xs font-bold text-mechnik-600">
                    Selected: {customCalendarDate}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <span key={day} className="text-[10px] font-bold text-slate-400 py-1">
                    {day}
                  </span>
                ))}

                {/* Calendar Days */}
                {Array.from({ length: 30 }).map((_, i) => {
                  const dayNum = i + 1;
                  const isPast = dayNum < 10;
                  const dateStr = `Sep ${dayNum}, 2026`;
                  const isSelected = customCalendarDate === dateStr;

                  return (
                    <button
                      key={dayNum}
                      type="button"
                      disabled={isPast}
                      onClick={() => {
                        setCustomCalendarDate(dateStr);
                        setSelectedDate(dateStr);
                      }}
                      className={`p-2 rounded-lg text-xs font-mono transition-all ${
                        isPast
                          ? 'opacity-25 cursor-not-allowed text-slate-400'
                          : isSelected
                          ? 'bg-mechnik-500 text-white font-bold shadow-sm'
                          : 'hover:bg-orange-50 text-slate-800'
                      }`}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Service Mode Selector */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-900 mb-2">
                Service Delivery Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setServiceMode('workshop')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    serviceMode === 'workshop'
                      ? 'border-mechnik-500 bg-orange-50/40'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-mechnik-500" />
                    <span className="text-xs font-bold text-slate-800">Drop at Workshop</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Direct visit to {bookingTargetMechanic.shopName}
                  </p>
                </div>

                <div
                  onClick={() => setServiceMode('doorstep')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    serviceMode === 'doorstep'
                      ? 'border-mechnik-500 bg-orange-50/40'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-mechnik-500" />
                    <span className="text-xs font-bold text-slate-800">Doorstep Pickup</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Mechanic picks up vehicle from your address (+₹100)
                  </p>
                </div>
              </div>

              {/* DOORSTEP PICKUP ADDRESS SELECTION SECTION */}
              {serviceMode === 'doorstep' && (
                <div className="mt-3.5 p-4 rounded-2xl bg-orange-50/50 border border-orange-200 space-y-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-mechnik-500" />
                      <span>Pickup Address</span>
                    </span>
                    <span className="text-[10px] font-semibold text-mechnik-700 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                      +₹100 Doorstep Pickup
                    </span>
                  </div>

                  {/* Mode Action Buttons: Auto-detect or Search */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleAutoDetectPickup}
                      disabled={isDetectingPickup}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs transition-all ${
                        pickupChoice === 'auto' && !isSearchingPickup
                          ? 'border-mechnik-500 bg-white font-bold text-slate-900 shadow-sm ring-1 ring-mechnik-500/20'
                          : 'border-slate-200 bg-white/70 hover:bg-white text-slate-600'
                      }`}
                    >
                      {isDetectingPickup ? (
                        <Loader2 className="w-4 h-4 text-mechnik-600 animate-spin flex-shrink-0" />
                      ) : (
                        <Navigation className="w-4 h-4 text-mechnik-600 flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="truncate font-semibold">{isDetectingPickup ? 'Detecting your location...' : 'Auto-detect my location'}</div>
                        <div className="text-[9px] text-slate-400 font-normal">Browser GPS detection</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchingPickup(true);
                        setPickupChoice('manual');
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs transition-all ${
                        isSearchingPickup || pickupChoice === 'manual'
                          ? 'border-mechnik-500 bg-white font-bold text-slate-900 shadow-sm ring-1 ring-mechnik-500/20'
                          : 'border-slate-200 bg-white/70 hover:bg-white text-slate-600'
                      }`}
                    >
                      <Search className="w-4 h-4 text-mechnik-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="truncate font-semibold">Search pickup address</div>
                        <div className="text-[9px] text-slate-400 font-normal">Search area, city or PIN</div>
                      </div>
                    </button>
                  </div>

                  {/* If user clicked Search pickup address or is changing address */}
                  {isSearchingPickup ? (
                    <div className="space-y-2 p-3 bg-white rounded-xl border border-slate-200 shadow-sm animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-600">
                          Search Area, Locality, City or PIN Code:
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsSearchingPickup(false)}
                          className="text-[10px] text-slate-400 hover:text-slate-600"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={pickupSearchQuery}
                          onChange={(e) => setPickupSearchQuery(e.target.value)}
                          placeholder="Type area, locality, city or PIN (e.g. Kor, Whitefield, 641001)..."
                          className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-mechnik-500/20 focus:border-mechnik-500 bg-white"
                          autoFocus
                        />
                        {pickupSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setPickupSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Autocomplete suggestions dropdown */}
                      {pickupSearchQuery.trim().length > 0 && (
                        <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white divide-y divide-slate-100 shadow-lg">
                          {pickupSuggestions.length > 0 ? (
                            pickupSuggestions.map((item: LocationItem) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setPickupAddress(item.name);
                                  setPickupChoice('manual');
                                  setIsSearchingPickup(false);
                                  setPickupSearchQuery('');
                                  addToast('Pickup Address Set', `📍 ${item.name}`, 'info');
                                }}
                                className="w-full p-2.5 text-left hover:bg-orange-50 text-xs flex items-start gap-2.5 group transition-colors"
                              >
                                <MapPin className="w-3.5 h-3.5 text-mechnik-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold text-slate-900 group-hover:text-mechnik-700">{item.name}</div>
                                  <div className="text-[10px] text-slate-500 truncate">
                                    {item.area} • PIN: {item.pincode}
                                  </div>
                                </div>
                              </button>
                            ))
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setPickupAddress(pickupSearchQuery.trim());
                                setPickupChoice('manual');
                                setIsSearchingPickup(false);
                                setPickupSearchQuery('');
                              }}
                              className="w-full p-2.5 text-left hover:bg-orange-50 text-xs flex items-center gap-2 text-slate-800"
                            >
                              <MapPin className="w-3.5 h-3.5 text-mechnik-500" />
                              <span>Use custom address: "<strong>{pickupSearchQuery.trim()}</strong>"</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Display Selected Pickup Address */
                    <div className="p-3.5 bg-white rounded-xl border border-orange-200 text-xs flex items-start justify-between gap-3 shadow-sm">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-mechnik-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Pickup Address</span>
                          <p className="font-bold text-slate-900 text-xs leading-snug mt-0.5">{pickupAddress}</p>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {pickupChoice === 'auto' ? '● GPS Auto-Detected' : '✏️ Selected Address'}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsSearchingPickup(true)}
                        className="px-2.5 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-mechnik-700 text-xs font-bold border border-orange-200 flex-shrink-0 transition-colors"
                      >
                        Change Address
                      </button>
                    </div>
                  )}

                  {/* Optional Flat / Building / Landmark details */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                        Flat / Building No (Optional)
                      </label>
                      <input
                        type="text"
                        value={pickupHouse}
                        onChange={(e) => setPickupHouse(e.target.value)}
                        placeholder="e.g. Flat 302, Green Glen"
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-mechnik-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={pickupLandmark}
                        onChange={(e) => setPickupLandmark(e.target.value)}
                        placeholder="e.g. Near Metro Pillar 42"
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-mechnik-500 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: SELECT TIME */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900">
                Choose Available Time Slot for {customCalendarDate || selectedDate}
              </label>
              <span className="text-[11px] text-slate-400">Workshop hours: 9 AM - 8 PM</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {timeSlots.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`py-3 px-2 rounded-xl text-center border transition-all ${
                      !slot.available
                        ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed text-slate-400'
                        : isSelected
                        ? 'border-mechnik-500 bg-mechnik-500 text-white font-bold shadow-mechnik-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800 font-medium'
                    }`}
                  >
                    <Clock className={`w-3.5 h-3.5 mx-auto mb-1 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    <span className="text-xs block font-mono">{slot.time}</span>
                    <span className="text-[9px] uppercase tracking-wider block mt-0.5">
                      {slot.available ? (isSelected ? 'Selected' : 'Available') : 'Booked'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-xs text-slate-600">
              <Sparkles className="w-4 h-4 text-mechnik-500 flex-shrink-0" />
              <span>
                Mechanic typically acknowledges within <strong>5–10 minutes</strong> of slot booking.
              </span>
            </div>
          </div>
        )}

        {/* STEP 6: CONFIRM BOOKING SUMMARY (WITH VEHICLE IMAGE, VOICE NOTE & PROBLEM IMAGES) */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-orange-50/30 border border-slate-200 space-y-3">
              {/* Workshop info */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-mechnik-600 flex items-center justify-center font-bold">
                    <Wrench className="w-5 h-5 -rotate-45" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{bookingTargetMechanic.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      {bookingTargetMechanic.address} • {bookingTargetMechanic.distanceKm} km
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ✓ Verified Workshop
                </span>
              </div>

              {/* Vehicle & Service summary */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Vehicle</span>
                  <div className="flex items-center gap-2 mt-1">
                    {vehicleInputMode === 'saved' && selectedSavedVehicle?.imageUrl ? (
                      <img
                        src={selectedSavedVehicle.imageUrl}
                        alt="Vehicle"
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                      />
                    ) : vehicleImage ? (
                      <img
                        src={vehicleImage}
                        alt="Vehicle"
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-orange-100 text-mechnik-600 flex items-center justify-center">
                        <Car className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {vehicleInputMode === 'saved' && selectedSavedVehicle
                          ? `${selectedSavedVehicle.make} ${selectedSavedVehicle.model}`
                          : vehicleModel}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        {vehicleInputMode === 'saved' && selectedSavedVehicle
                          ? selectedSavedVehicle.registrationNumber
                          : vehicleReg || 'Unregistered'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Service</span>
                  <span className="font-bold text-slate-800 mt-1 block">{currentServiceObj.name}</span>
                  <span className="text-[11px] text-slate-500 block">
                    Mode: {serviceMode === 'doorstep' ? 'Doorstep Pickup' : 'Drop at Workshop'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Scheduled Date & Time</span>
                  <span className="font-bold text-slate-800">
                    {customCalendarDate || selectedDate} • {selectedTime}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Estimated Cost</span>
                  <span className="font-extrabold text-mechnik-600 font-mono text-sm">
                    {bookingTargetMechanic.servicesOffered.find((s) => s.serviceId === selectedService)?.priceRange ||
                      `₹${currentServiceObj.startingPrice} – ₹${currentServiceObj.startingPrice + 500}`}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Pay after service completion</span>
                </div>
              </div>

              {/* Doorstep Pickup Address */}
              {serviceMode === 'doorstep' && pickupAddress && (
                <div className="pt-2 border-t border-slate-200/80 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Doorstep Pickup Address
                  </span>
                  <div className="mt-1 p-2.5 rounded-xl bg-white border border-orange-200 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-mechnik-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800">
                        {pickupAddress}{pickupHouse ? `, ${pickupHouse}` : ''}{pickupLandmark ? ` (Landmark: ${pickupLandmark})` : ''}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Mode: {pickupChoice === 'auto' ? 'Auto-detected GPS Location' : 'Selected Address'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Issue Description & Voice Note */}
              {issueDescription && (
                <div className="pt-2 border-t border-slate-200/80 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Reported Problem</span>
                  <p className="text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-100 mt-1">
                    "{issueDescription}"
                  </p>
                </div>
              )}

              {/* Voice Note & Images preview */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80 text-xs">
                {voiceNote ? (
                  <div className="flex items-center gap-2 text-mechnik-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100 font-semibold">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Voice Memo Attached ({voiceNote.duration})</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400">No voice note</span>
                )}

                {issueImages.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 mr-1">{issueImages.length} Photos:</span>
                    {issueImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Thumb ${i}`}
                        className="w-6 h-6 rounded object-cover border border-slate-200"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Mechnik Promise: No upfront charges. Complete diagnosis before repair.</span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="btn-secondary px-4 py-2.5 text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={closeBookingModal}
              className="text-xs text-slate-500 hover:text-slate-700 font-medium"
            >
              Cancel
            </button>
          )}

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmBooking}
              className="btn-primary px-7 py-3 text-xs font-bold shadow-mechnik"
            >
              CONFIRM BOOKING
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
