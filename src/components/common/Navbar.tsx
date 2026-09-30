import React, { useState, useRef, useEffect } from 'react';
import { useMechnik } from '../../context/MechnikContext';
import { MechnikLogo } from './MechnikLogo';
import {
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  LogOut,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    logout,
    activeTab,
    setActiveTab,
    bookings,
    notifications,
    unreadNotificationCount,
    markNotificationsAsRead,
    setTrackingBookingId
  } = useMechnik();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pendingRequestsCount = bookings.filter((b) => b.status === 'REQUESTED').length;
  const activeBookingsCount = bookings.filter(
    (b) => b.status === 'REQUESTED' || b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS'
  ).length;

  const handleNotifClick = () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen && unreadNotificationCount > 0) {
      markNotificationsAsRead();
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-[33px] z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                if (currentRole === 'owner') setActiveTab('home');
                else if (currentRole === 'mechanic') setActiveTab('mechanic-dashboard');
                else if (currentRole === 'admin') setActiveTab('admin-overview');
              }}
              className="flex items-center text-left group focus:outline-none"
            >
              <MechnikLogo size="md" showTagline={true} />
              {currentRole === 'mechanic' && (
                <span className="ml-2 px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px] font-bold uppercase tracking-wider">
                  Partner
                </span>
              )}
              {currentRole === 'admin' && (
                <span className="ml-2 px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold uppercase tracking-wider">
                  Admin Ops
                </span>
              )}
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              {currentRole === 'owner' && (
                <>
                  <button
                    onClick={() => setActiveTab('home')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'home'
                        ? 'text-mechnik-600 bg-orange-50/70 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => setActiveTab('find-mechanic')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'find-mechanic'
                        ? 'text-mechnik-600 bg-orange-50/70 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Find Mechanic
                  </button>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'bookings'
                        ? 'text-mechnik-600 bg-orange-50/70 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    My Bookings
                    {activeBookingsCount > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-mechnik-500 text-white text-[10px] font-bold">
                        {activeBookingsCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('vehicles')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'vehicles'
                        ? 'text-mechnik-600 bg-orange-50/70 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    My Vehicles
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'history'
                        ? 'text-mechnik-600 bg-orange-50/70 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Service History
                  </button>
                </>
              )}

              {currentRole === 'mechanic' && (
                <>
                  <button
                    onClick={() => setActiveTab('mechanic-dashboard')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'mechanic-dashboard'
                        ? 'text-mechnik-600 bg-orange-50/70 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab('mechanic-requests')}
                    className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'mechanic-requests'
                        ? 'text-mechnik-600 bg-orange-50/70 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Job Requests
                    {pendingRequestsCount > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-mechnik-500 text-white text-[10px] font-bold animate-pulse">
                        {pendingRequestsCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('mechanic-active')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'mechanic-active'
                        ? 'text-mechnik-600 bg-orange-50/70 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Active Jobs
                  </button>
                  <button
                    onClick={() => setActiveTab('mechanic-completed')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'mechanic-completed'
                        ? 'text-mechnik-600 bg-orange-50/70 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => setActiveTab('mechanic-schedule')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'mechanic-schedule'
                        ? 'text-mechnik-600 bg-orange-50/70 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Availability
                  </button>
                  <button
                    onClick={() => setActiveTab('mechanic-reviews')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'mechanic-reviews'
                        ? 'text-mechnik-600 bg-orange-50/70 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Reviews
                  </button>
                  <button
                    onClick={() => setActiveTab('mechanic-profile')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'mechanic-profile'
                        ? 'text-mechnik-600 bg-orange-50/70 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Profile
                  </button>
                </>
              )}

              {currentRole === 'admin' && (
                <>
                  <button
                    onClick={() => setActiveTab('admin-overview')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'admin-overview'
                        ? 'text-mechnik-600 bg-orange-50/70 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('admin-mechanics')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'admin-mechanics'
                        ? 'text-mechnik-600 bg-orange-50/70 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Mechanics & Verification
                  </button>
                  <button
                    onClick={() => setActiveTab('admin-bookings')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'admin-bookings'
                        ? 'text-mechnik-600 bg-orange-50/70 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    All Bookings
                  </button>
                  <button
                    onClick={() => setActiveTab('admin-users')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'admin-users'
                        ? 'text-mechnik-600 bg-orange-50/70 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Users
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={handleNotifClick}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-mechnik-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900">Notifications</span>
                      {unreadNotificationCount > 0 && (
                        <span className="text-[11px] bg-orange-100 text-orange-700 font-semibold px-2 py-0.5 rounded-full">
                          {unreadNotificationCount} new
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">Live Updates</span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 6).map((notif) => (
                        <div
                          key={notif.id}
                          className="p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-orange-50 text-mechnik-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {notif.time}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Badge & Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-inner">
                  {currentUser?.name
                    ? currentUser.name.substring(0, 2).toUpperCase()
                    : currentRole === 'owner'
                    ? 'SK'
                    : currentRole === 'mechanic'
                    ? 'RS'
                    : 'AD'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser?.name ||
                      (currentRole === 'owner'
                        ? 'Sai Kumar'
                        : currentRole === 'mechanic'
                        ? 'Ravi Sharma'
                        : 'Admin System')}
                  </p>
                  <p className="text-[10px] text-slate-500 capitalize">
                    {currentUser?.role === 'customer'
                      ? 'Customer'
                      : currentUser?.role === 'mechanic'
                      ? (currentUser.workshopName || 'Mechanic')
                      : currentRole === 'owner'
                      ? 'Vehicle Owner'
                      : currentRole === 'mechanic'
                      ? 'Ravi Auto Care'
                      : 'Super Admin'}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {currentUser?.name ||
                        (currentRole === 'owner'
                          ? 'Sai Kumar'
                          : currentRole === 'mechanic'
                          ? 'Ravi Sharma'
                          : 'Administrator')}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {currentUser?.email || (currentRole === 'owner' ? 'customer@mechnik.com' : 'mechanic@mechnik.com')}
                    </p>
                  </div>

                  <div className="p-1">
                    {currentRole === 'owner' && (
                      <>
                        <button
                          onClick={() => {
                            setActiveTab('profile');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
                        >
                          Customer Profile & Settings
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('vehicles');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
                        >
                          Manage Garage Vehicles
                        </button>
                      </>
                    )}

                    {currentRole === 'mechanic' && (
                      <>
                        <button
                          onClick={() => {
                            setActiveTab('mechanic-profile');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
                        >
                          Workshop Profile & Rates
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('mechanic-reviews');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
                        >
                          Customer Reviews
                        </button>
                      </>
                    )}

                    <div className="my-1 border-t border-slate-100"></div>

                    <p className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Role (Sandbox)
                    </p>
                    <button
                      onClick={() => {
                        setCurrentRole('owner');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-orange-50 hover:text-mechnik-600 rounded-lg"
                    >
                      Customer View
                    </button>
                    <button
                      onClick={() => {
                        setCurrentRole('mechanic');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-orange-50 hover:text-mechnik-600 rounded-lg"
                    >
                      Mechanic View
                    </button>

                    <div className="my-1 border-t border-slate-100"></div>

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1.5 font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-3 px-2 space-y-1 bg-white animate-in slide-in-from-top-2">
            <div className="p-2 mb-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {currentUser?.name || (currentRole === 'owner' ? 'Sai Kumar' : 'Ravi Sharma')}
                </p>
                <p className="text-[10px] text-slate-500 capitalize">
                  Role: <strong className="text-mechnik-600">{currentRole}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="px-2.5 py-1 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>

            {currentRole === 'owner' && (
              <>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg ${
                    activeTab === 'home' ? 'bg-orange-50 text-mechnik-600' : 'text-slate-700'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setActiveTab('find-mechanic');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg ${
                    activeTab === 'find-mechanic' ? 'bg-orange-50 text-mechnik-600' : 'text-slate-700'
                  }`}
                >
                  Find Mechanic
                </button>
                <button
                  onClick={() => {
                    setActiveTab('bookings');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg ${
                    activeTab === 'bookings' ? 'bg-orange-50 text-mechnik-600' : 'text-slate-700'
                  }`}
                >
                  My Bookings {activeBookingsCount > 0 && `(${activeBookingsCount})`}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('history');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg ${
                    activeTab === 'history' ? 'bg-orange-50 text-mechnik-600' : 'text-slate-700'
                  }`}
                >
                  Booking History
                </button>
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg ${
                    activeTab === 'profile' ? 'bg-orange-50 text-mechnik-600' : 'text-slate-700'
                  }`}
                >
                  Profile
                </button>
              </>
            )}

            {currentRole === 'mechanic' && (
              <>
                <button
                  onClick={() => {
                    setActiveTab('mechanic-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg ${
                    activeTab === 'mechanic-dashboard' ? 'bg-orange-50 text-mechnik-600' : 'text-slate-700'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setActiveTab('mechanic-requests');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg ${
                    activeTab === 'mechanic-requests' ? 'bg-orange-50 text-mechnik-600' : 'text-slate-700'
                  }`}
                >
                  New Requests {pendingRequestsCount > 0 && `(${pendingRequestsCount})`}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('mechanic-active');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg ${
                    activeTab === 'mechanic-active' ? 'bg-orange-50 text-mechnik-600' : 'text-slate-700'
                  }`}
                >
                  My Bookings
                </button>
                <button
                  onClick={() => {
                    setActiveTab('mechanic-schedule');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg ${
                    activeTab === 'mechanic-schedule' ? 'bg-orange-50 text-mechnik-600' : 'text-slate-700'
                  }`}
                >
                  Availability
                </button>
                <button
                  onClick={() => {
                    setActiveTab('mechanic-reviews');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg ${
                    activeTab === 'mechanic-reviews' ? 'bg-orange-50 text-mechnik-600' : 'text-slate-700'
                  }`}
                >
                  Reviews
                </button>
                <button
                  onClick={() => {
                    setActiveTab('mechanic-profile');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg ${
                    activeTab === 'mechanic-profile' ? 'bg-orange-50 text-mechnik-600' : 'text-slate-700'
                  }`}
                >
                  Profile
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
