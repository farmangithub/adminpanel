import React, { useState } from 'react';

export default function AddAppointment() {
  const [appointment, setAppointment] = useState({
    patientName: '',
    doctorName: '',
    date: '',
    time: '',
    status: '', // e.g. Scheduled, Completed, Cancelled
  });

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle appointment save logic here
    alert('Appointment added: ' + JSON.stringify(appointment));
  };

  return (
    <div>
      <h2>Add Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input name="patientName" placeholder="Patient Name" onChange={handleChange} required />
        <input name="doctorName" placeholder="Doctor Name" onChange={handleChange} required />
        <input name="date" type="date" onChange={handleChange} required />
        <input name="time" type="time" onChange={handleChange} required />
        <select name="status" onChange={handleChange} required>
          <option value="">Select Status</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button type="submit">Add Appointment</button>
      </form>
    </div>
  );
}
