import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const AddDoctor = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'doctors'), {
        name,
        age,
        specialization,
        createdAt: new Date()
      });
      setSuccessMsg(`Doctor Added: ${name}, Age: ${age}, Specialization: ${specialization}`);
      setName('');
      setAge('');
      setSpecialization('');
    } catch (error) {
      console.error('Error adding doctor:', error);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Add Doctor</h2>
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter doctor's name"
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            value={age}
            required
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter doctor's age"
          />
        </div>
        <div>
          <label>Specialization:</label>
          <input
            type="text"
            value={specialization}
            required
            onChange={(e) => setSpecialization(e.target.value)}
            placeholder="e.g., Dentist, Cardiologist"
          />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Add Doctor</button>
      </form>
    </div>
  );
};

export default AddDoctor;
