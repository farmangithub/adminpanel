import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts';

const pieData = [
  { name: 'Completed', value: 400 },
  { name: 'Pending', value: 300 },
  { name: 'Cancelled', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FF8042'];

const lineData = [
  { day: 'Mon', appointments: 40 },
  { day: 'Tue', appointments: 30 },
  { day: 'Wed', appointments: 20 },
  { day: 'Thu', appointments: 27 },
  { day: 'Fri', appointments: 18 },
  { day: 'Sat', appointments: 23 },
  { day: 'Sun', appointments: 34 },
];

const appointmentSchedule = [
  { time: '9:00 AM', patient: 'John Doe', doctor: 'Dr. Smith', status: 'Completed' },
  { time: '10:30 AM', patient: 'Jane Roe', doctor: 'Dr. Adams', status: 'Pending' },
  { time: '12:00 PM', patient: 'Jim Bean', doctor: 'Dr. Brown', status: 'Cancelled' },
  { time: '2:00 PM', patient: 'Anna Lee', doctor: 'Dr. Smith', status: 'Completed' },
  { time: '3:30 PM', patient: 'Mike Green', doctor: 'Dr. Adams', status: 'Pending' },
];

export default function Dashboard() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to the Admin Dashboard</h1>

      <section style={{ marginBottom: '40px' }}>
        <h3>Appointment Status Pie Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3>Weekly Appointment Schedule</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="appointments" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section>
        <h3>Today's Appointment Schedule</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Time</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Patient</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Doctor</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointmentSchedule.map(({ time, patient, doctor, status }, idx) => (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{time}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{patient}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{doctor}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', color: status === 'Completed' ? 'green' : status === 'Pending' ? 'orange' : 'red' }}>
                  {status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
