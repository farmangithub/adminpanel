import React from 'react';

const patients = [
  { id: 1, name: 'John Doe', email: 'john@example.com', contact: '123-456-7890', dob: '1985-06-15' },
  { id: 2, name: 'Jane Roe', email: 'jane@example.com', contact: '987-654-3210', dob: '1990-08-20' },
  { id: 3, name: 'Alex Johnson', email: 'alex@example.com', contact: '456-789-1230', dob: '1978-03-05' },
];

export default function Patients() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontWeight: 'bold', color: '#007bff' }}>Patients</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Contact</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date of Birth</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(({ id, name, email, contact, dob }) => (
            <tr key={id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{email}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{contact}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{dob}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
