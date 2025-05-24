import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Dashboard.css';

export default function Layout() {
  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/appointments">Appointments</Link></li>
          <li><Link to="/doctors">Doctors</Link></li>
          <li><Link to="/patients">Patients</Link></li>
          <li><Link to="/billing">Billing</Link></li>
          <li><Link to="/reporting">Reporting</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
