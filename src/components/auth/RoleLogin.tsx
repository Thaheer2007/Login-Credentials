import React, { useState } from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { MechnikLogo } from '../common/MechnikLogo';
import { FirebaseConfigModal } from '../common/FirebaseConfigModal';
import { isFirebaseConfigured } from '../../services/firebase';
import {
  Car,
  Wrench,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Phone,
  Building2,
  Eye,
  EyeOff,
  Flame,
  AlertCircle,
  Loader2,
  Layers,
  Calendar
} from 'lucide-react';

export const RoleLogin: React.FC = () => {
  const { setCurrentRole, setActiveTab, login, signUp, addToast } = useMechnik();

  // Mode: 'login' | 'signup' | 'demo'
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'demo'>('login');
  
  // Selected role for Registration
  const [selectedRole, setSelectedRole] = useState<'customer' | 'mechanic'>('customer');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [workshopName, setWorkshopName] = useState('');
  const [vehicleSpecialties, setVehicleSpecialties] = useState<string[]>(['Car', 'Bike']);
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  const hasConfig = isFirebaseConfigured();

  const toggleSpecialty = (v: string) => {
    if (vehicleSpecialties.includes(v)) {
      setVehicleSpecialties(vehicleSpecialties.filter((s) => s !== v));
    } else {
      setVehicleSpecialties([...vehicleSpecialties, v]);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      setLoading(false);
      addToast(
        'Welcome back!',
        `Logged in as ${user.role === 'customer' ? 'Customer' : 'Mechanic'} (${user.name})`,
        'success'
      );
      // Automatic redirection is also handled inside login in Context
    } catch (err: any) {
      setLoading(false);
      const msg = err.message || 'Login failed. Please check your credentials.';
      setErrorMessage(msg.replace('Firebase: ', ''));
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim() || !fullName.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (selectedRole === 'mechanic' && !workshopName.trim()) {
      setErrorMessage('Please provide your Workshop / Garage name.');
      return;
    }

    setLoading(true);
    try {
      const user = await signUp({
        email,
        password,
        name: fullName,
        role: selectedRole,
        phone: phoneNumber,
        workshopName: selectedRole === 'mechanic' ? workshopName : undefined,
        specialization: selectedRole === 'mechanic' ? vehicleSpecialties : undefined
      });
      setLoading(false);
      addToast(
        'Account Created!',
        `Successfully registered as ${selectedRole === 'customer' ? 'Customer' : 'Mechanic'}. Profile saved in Firestore.`,
        'success'
      );
    } catch (err: any) {
      setLoading(false);
      const msg = err.message || 'Registration failed. Please try again.';
      setErrorMessage(msg.replace('Firebase: ', ''));
    }
  };

  // Quick Demo Login helper
  const handleQuickDemo = (role: 'customer' | 'mechanic') => {
    if (role === 'customer') {
      setEmail('customer@mechnik.com');
      setPassword('customer123');
      setCurrentRole('owner');
      setActiveTab('home');
      addToast('Demo Customer Mode', 'Logged in as Customer (Sai Kumar)', 'info');
    } else {
      setEmail('mechanic@mechnik.com');
      setPassword('mechanic123');
      setCurrentRole('mechanic');
      setActiveTab('mechanic-dashboard');
      addToast('Demo Mechanic Mode', 'Logged in as Mechanic (Ravi Sharma - Ravi Auto Care)', 'info');
    }
  };

  return (
    <div className="min-h-[calc(100vh-33px)] bg-gradient-to-b from-slate-50 via-orange-50/20 to-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-3">
            <MechnikLogo size="xl" showTagline={true} />
          </div>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Vehicle mechanic discovery & booking platform for <strong>Cars, Bikes, Trucks, and Tractors</strong>.
          </p>

          {/* Firebase Connection Pill */}
          <div className="mt-4 inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFirebaseModalOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                hasConfig
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100 shadow-sm'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-mechnik-500" />
              <span>
                {hasConfig ? 'Firebase Auth & Firestore: Connected' : 'Firebase Auth & Firestore: Ready (Click to Configure)'}
              </span>
              <span className="text-[10px] underline ml-1">Setup</span>
            </button>
          </div>
        </div>

        {/* Auth Box Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-2xl mx-auto">
          {/* Top Mode Selector Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-200 text-xs sm:text-sm font-bold bg-slate-50/80">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage('');
              }}
              className={`py-3.5 transition-all text-center ${
                authMode === 'login'
                  ? 'bg-white text-mechnik-600 border-b-2 border-mechnik-500 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage('');
              }}
              className={`py-3.5 transition-all text-center ${
                authMode === 'signup'
                  ? 'bg-white text-mechnik-600 border-b-2 border-mechnik-500 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('demo');
                setErrorMessage('');
              }}
              className={`py-3.5 transition-all text-center ${
                authMode === 'demo'
                  ? 'bg-white text-mechnik-600 border-b-2 border-mechnik-500 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Quick Sandbox
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* TAB 1: LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-mechnik-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <span className="text-[11px] text-slate-400">Never saved in Firestore</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-mechnik-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 rounded-xl font-bold text-sm shadow-mechnik flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating with Firebase...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Instant Demo quick fill buttons */}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-400 text-center uppercase tracking-wider mb-2.5">
                    Or Quick Login as:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('customer')}
                      className="py-2 px-3 rounded-xl border border-orange-200 bg-orange-50/60 hover:bg-orange-100 text-xs font-bold text-mechnik-700 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Car className="w-3.5 h-3.5 text-mechnik-500" />
                      <span>Customer (Sai Kumar)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('mechanic')}
                      className="py-2 px-3 rounded-xl border border-slate-200 bg-slate-100/70 hover:bg-slate-200 text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Wrench className="w-3.5 h-3.5 text-slate-700 -rotate-45" />
                      <span>Mechanic (Ravi Auto)</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* TAB 2: SIGN UP FORM */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                {/* ROLE SELECTION RADIO CARDS */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    I am registering as: *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      onClick={() => setSelectedRole('customer')}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                        selectedRole === 'customer'
                          ? 'border-mechnik-500 bg-orange-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          selectedRole === 'customer'
                            ? 'bg-mechnik-500 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Car className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                          Customer
                        </h4>
                        <p className="text-[11px] text-slate-500">Vehicle Owner</p>
                      </div>
                    </div>

                    <div
                      onClick={() => setSelectedRole('mechanic')}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                        selectedRole === 'mechanic'
                          ? 'border-mechnik-500 bg-orange-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          selectedRole === 'mechanic'
                            ? 'bg-mechnik-500 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Wrench className="w-5 h-5 -rotate-45" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                          Mechanic
                        </h4>
                        <p className="text-[11px] text-slate-500">Workshop Partner</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Common fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ramesh Patel"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-mechnik-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-mechnik-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-mechnik-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-mechnik-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-mechnik-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Mechanic Specific Fields */}
                {selectedRole === 'mechanic' && (
                  <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-3 animate-in fade-in">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Workshop / Garage Name *
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={workshopName}
                          onChange={(e) => setWorkshopName(e.target.value)}
                          placeholder="e.g. SpeedCare Auto Works"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-mechnik-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Vehicle Specialties
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Car', 'Bike', 'Truck', 'Tractor', 'EV'].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => toggleSpecialty(cat)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              vehicleSpecialties.includes(cat)
                                ? 'bg-mechnik-500 text-white shadow-sm'
                                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    Your profile will be saved in <strong>Firestore</strong> under the <code>users</code> collection with <code>role: '{selectedRole}'</code>. Passwords are handled safely by Firebase Auth.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 rounded-xl font-bold text-sm shadow-mechnik flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account in Firebase...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration as {selectedRole === 'customer' ? 'Customer' : 'Mechanic'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 3: DEMO SANDBOX ROLES */}
            {authMode === 'demo' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Test the complete application with pre-configured personas without needing to sign up:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Customer Card */}
                  <div
                    onClick={() => handleQuickDemo('customer')}
                    className="p-5 rounded-2xl border-2 border-slate-200 hover:border-mechnik-500 bg-white hover:bg-orange-50/20 cursor-pointer transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-mechnik-600 flex items-center justify-center font-bold">
                        <Car className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Customer Persona</h4>
                        <p className="text-xs text-slate-500">Sai Kumar (Vehicle Owner)</p>
                      </div>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1.5 mb-4">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Instant & Pre-Service Bookings</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Find Mechanics & Track Status</span>
                      </li>
                    </ul>
                    <button
                      type="button"
                      className="w-full btn-primary py-2 text-xs font-bold rounded-lg shadow-sm"
                    >
                      Enter Customer Dashboard
                    </button>
                  </div>

                  {/* Mechanic Card */}
                  <div
                    onClick={() => handleQuickDemo('mechanic')}
                    className="p-5 rounded-2xl border-2 border-slate-200 hover:border-mechnik-500 bg-white hover:bg-orange-50/20 cursor-pointer transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                        <Wrench className="w-5 h-5 -rotate-45" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Mechanic Persona</h4>
                        <p className="text-xs text-slate-500">Ravi Sharma (Ravi Auto Care)</p>
                      </div>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1.5 mb-4">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Manage Incoming Job Requests</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Accept, Start & Complete Jobs</span>
                      </li>
                    </ul>
                    <button
                      type="button"
                      className="w-full btn-dark py-2 text-xs font-bold rounded-lg shadow-sm"
                    >
                      Enter Mechanic Dashboard
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info pill */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 font-medium">
            "Find a Mechanic. Book a Service. Keep Moving." • Mechnik Platform
          </p>
        </div>
      </div>

      {/* Firebase Settings Modal */}
      <FirebaseConfigModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />
    </div>
  );
};
