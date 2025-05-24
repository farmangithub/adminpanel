import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import './Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>

      <NavLink to="/dashboard" className="sidebar-link" activeclassname="active-link">
        Dashboard
      </NavLink>
      <NavLink to="/appointments" className="sidebar-link" activeclassname="active-link">
        Appointments
      </NavLink>
      <NavLink to="/doctors" className="sidebar-link" activeclassname="active-link">
        Doctors
      </NavLink>
      <NavLink to="/patients" className="sidebar-link" activeclassname="active-link">
        Patients
      </NavLink>
      <NavLink to="/billing" className="sidebar-link" activeclassname="active-link">
        Billing
      </NavLink>
      <NavLink to="/reporting" className="sidebar-link" activeclassname="active-link">
        Reporting
      </NavLink>
      <NavLink to="/settings" className="sidebar-link" activeclassname="active-link">
        Settings
      </NavLink>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}
