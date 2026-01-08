import React, { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { database } from '../../friendFirebase'; // ✅ Correct import for Realtime Database

const AddPatient = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [condition, setCondition] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !age || !condition) {
      setMessage('⚠️ Please fill all fields');
      return;
    }

    try {
      // Create a new patient reference under "users/patients"
      const newPatientRef = push(ref(database, 'users/patients'));

      await set(newPatientRef, {
        name,
        age: Number(age),
        condition,
        createdAt: new Date().toISOString(), // optional timestamp
      });

      setMessage('✅ Patient added successfully!');
      setName('');
      setAge('');
      setCondition('');
    } catch (error) {
      setMessage('❌ Error adding patient: ' + error.message);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Add Patient</h2>
      {message && <p style={messageStyle}>{message}</p>}
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputGroupStyle}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter patient name"
            style={inputStyle}
          />
        </div>
        <div style={inputGroupStyle}>
          <label>Age:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age"
            style={inputStyle}
          />
        </div>
        <div style={inputGroupStyle}>
          <label>Condition:</label>
          <input
            type="text"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="Enter condition"
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Add Patient</button>
      </form>
    </div>
  );
};

// ✅ Inline styles
const containerStyle = {
  maxWidth: '400px',
  margin: '50px auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const inputGroupStyle = {
  marginBottom: '15px',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  marginTop: '5px',
};

const buttonStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#007BFF',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const messageStyle = {
  marginBottom: '15px',
  fontWeight: 'bold',
};

export default AddPatient;
