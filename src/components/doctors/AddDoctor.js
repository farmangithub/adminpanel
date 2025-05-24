import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddDoctor() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [specialization, setSpecialization] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here you would save to backend or Firebase
    alert(`Doctor Added: ${name}, Age: ${age}, Specialization: ${specialization}`);

    // Navigate back to doctor list
    navigate('/doctors');
  };

  return (
    <div>
      <h2>Add Doctor</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div>
          <label>Name:</label><br />
          <input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label>Age:</label><br />
          <input type="number" value={age} onChange={e => setAge(e.target.value)} required />
        </div>
        <div>
          <label>Specialization:</label><br />
          <input value={specialization} onChange={e => setSpecialization(e.target.value)} required />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Add Doctor</button>
      </form>
    </div>
  );
}
