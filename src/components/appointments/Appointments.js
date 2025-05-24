import React from 'react';

const appointments = [
  { id: 1, patient: 'John Doe', doctor: 'Dr. Smith', date: '2025-06-01', time: '09:00 AM', status: 'Completed' },
  { id: 2, patient: 'Jane Roe', doctor: 'Dr. Adams', date: '2025-06-02', time: '10:30 AM', status: 'Pending' },
  { id: 3, patient: 'Alex Johnson', doctor: 'Dr. Brown', date: '2025-06-03', time: '01:00 PM', status: 'Cancelled' },
];

export default function Appointments() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontWeight: 'bold', color: '#007bff' }}>Appointments</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Patient</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Doctor</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Time</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(({ id, patient, doctor, date, time, status }) => (
            <tr key={id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{patient}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{doctor}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{date}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{time}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
