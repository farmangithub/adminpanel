import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

// Category Pages
import Doctors from './components/doctors/Doctors';
import AddDoctor from './components/doctors/AddDoctor';

import Patients from './components/patients/Patients';
import AddPatient from './components/patients/AddPatient';

import Appointments from './components/appointments/Appointments';
import AddAppointment from './components/appointments/AddAppointment';

import Billing from './components/billing/Billing';
import Reporting from './components/reporting/Reporting';
import Settings from './components/settings/Settings';

// Auth Pages
import Login from './components/Login';
import Signup from './components/Signup';
import Doctor from "./components/FriendDoctor";
import Patient from './components/FriendPatient';





export default App;


function AppContent() {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // If user is NOT authenticated and NOT on login/signup, redirect to login
  if (!user && !isAuthRoute) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ display: 'flex' }}>
      {/* Hide sidebar on login/signup */}
      {!isAuthRoute && <Sidebar />}

      <main style={{ flex: 1, padding: '20px' }}>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Doctors */}
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/add" element={<AddDoctor />} />

          {/* Patients */}
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/add" element={<AddPatient />} />

          {/* Appointments */}
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointments/add" element={<AddAppointment />} />

          {/* Other Pages */}
          <Route path="/billing" element={<Billing />} />
          <Route path="/reporting" element={<Reporting />} />
          <Route path="/settings" element={<Settings />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/friend-doctors" element={<Doctor />} />
        <Route path="/friend-patients" element={<Patient />} />
        
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      
      
    </Router>
  );
}


