import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const sampleDoctors = [
  { id: 1, name: 'Dr. John Smith', age: 45, specialization: 'Cardiology' },
  { id: 2, name: 'Dr. Anna Brown', age: 38, specialization: 'Neurology' },
];

export default function Doctors() {
  const [doctors, setDoctors] = useState(sampleDoctors);

  return (
    <div>
      <h2>Doctors List</h2>
      <Link to="/doctors/add" style={{ marginBottom: '15px', display: 'inline-block' }}>+ Add Doctor</Link>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f4f4f4' }}>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Specialization</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(doc => (
            <tr key={doc.id}>
              <td>{doc.name}</td>
              <td>{doc.age}</td>
              <td>{doc.specialization}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
