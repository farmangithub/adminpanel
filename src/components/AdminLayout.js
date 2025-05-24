import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './Dashboard.css';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <h2>Admin Panel</h2>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/appointments">Appointments</Link>
        <Link to="/doctors">Doctors</Link>
        <Link to="/patients">Patients</Link>
        <Link to="/billing">Billing</Link>
        <Link to="/reporting">Reporting</Link>
        <Link to="/settings">Settings</Link>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <main className="main-content">
        {/* Outlet renders the selected route's component here */}
        <Outlet />
      </main>
    </div>
  );
}
