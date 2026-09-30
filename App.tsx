import React from 'react';
import { MechnikProvider, useMechnik } from './context/MechnikContext';
import { Navbar } from './components/common/Navbar';
import { DemoBanner } from './components/common/DemoBanner';
import { ToastContainer } from './components/common/ToastContainer';
import { RoleLogin } from './components/auth/RoleLogin';

// Owner Components
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { FindMechanic } from './components/owner/FindMechanic';
import { MyBookings } from './components/owner/MyBookings';
import { MyVehicles } from './components/owner/MyVehicles';
import { ServiceHistory } from './components/owner/ServiceHistory';
import { OwnerProfile } from './components/owner/OwnerProfile';
import { MechanicProfileModal } from './components/owner/MechanicProfileModal';
import { BookingFlowModal } from './components/owner/BookingFlowModal';
import { BookingTrackingModal } from './components/owner/BookingTrackingModal';
import { ReviewModal } from './components/owner/ReviewModal';
import { LocationModal } from './components/owner/LocationModal';

// Mechanic Components
import { MechanicDashboard } from './components/mechanic/MechanicDashboard';
import { JobRequests } from './components/mechanic/JobRequests';
import { ActiveJobs } from './components/mechanic/ActiveJobs';
import { CompletedJobs } from './components/mechanic/CompletedJobs';
import { MechanicSchedule } from './components/mechanic/MechanicSchedule';
import { MechanicProfileEdit } from './components/mechanic/MechanicProfileEdit';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminMechanics } from './components/admin/AdminMechanics';
import { AdminBookings } from './components/admin/AdminBookings';
import { AdminUsers } from './components/admin/AdminUsers';

import { Wrench, Bike, Heart, ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentRole, activeTab, setActiveTab } = useMechnik();

  // If user is guest / logged out, show the Role Selection login screen
  if (currentRole === 'guest' || activeTab === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <DemoBanner />
        <RoleLogin />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      {/* Demo Sandbox Control Banner */}
      <DemoBanner />

      {/* Main Navbar */}
      <Navbar />

      {/* Main Application Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full">
        {/* VEHICLE OWNER ROLE VIEWS */}
        {currentRole === 'owner' && (
          <>
            {activeTab === 'home' && <OwnerDashboard />}
            {activeTab === 'find-mechanic' && <FindMechanic />}
            {activeTab === 'bookings' && <MyBookings />}
            {activeTab === 'vehicles' && <MyVehicles />}
            {activeTab === 'history' && <ServiceHistory />}
            {activeTab === 'profile' && <OwnerProfile />}
          </>
        )}

        {/* MECHANIC ROLE VIEWS */}
        {currentRole === 'mechanic' && (
          <>
            {activeTab === 'mechanic-dashboard' && <MechanicDashboard />}
            {activeTab === 'mechanic-requests' && <JobRequests />}
            {activeTab === 'mechanic-active' && <ActiveJobs />}
            {activeTab === 'mechanic-completed' && <CompletedJobs />}
            {activeTab === 'mechanic-schedule' && <MechanicSchedule />}
            {activeTab === 'mechanic-profile' && <MechanicProfileEdit />}
          </>
        )}

        {/* ADMIN ROLE VIEWS */}
        {currentRole === 'admin' && (
          <>
            {activeTab === 'admin-overview' && <AdminDashboard />}
            {activeTab === 'admin-mechanics' && <AdminMechanics />}
            {activeTab === 'admin-bookings' && <AdminBookings />}
            {activeTab === 'admin-users' && <AdminUsers />}
          </>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="bg-charcoal-900 text-slate-400 text-xs py-8 border-t border-charcoal-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-mechnik-500 text-white flex items-center justify-center font-bold">
              <Wrench className="w-4 h-4 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-extrabold tracking-wider">MECHNIK</span>
                <span className="text-[10px] text-slate-500">|</span>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                  YOUR VEHICLE • OUR CARE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                "Find a Mechanic. Book a Service. Keep Moving."
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-slate-400">
            <span>Vehicle Care & Service Platform</span>
            <span>•</span>
            <span className="text-mechnik-400 font-semibold">Presentation Ready MVP</span>
          </div>
        </div>
      </footer>

      {/* Global Interactive Modals & Toasts */}
      <LocationModal />
      <MechanicProfileModal />
      <BookingFlowModal />
      <BookingTrackingModal />
      <ReviewModal />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <MechnikProvider>
      <AppContent />
    </MechnikProvider>
  );
};

export default App;
