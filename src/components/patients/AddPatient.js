import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Make sure this path is correct

const AddPatient = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [condition, setCondition] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !age || !condition) {
      setMessage('Please fill all fields');
      return;
    }

    try {
      // Add new document to 'patients' collection
      await addDoc(collection(db, 'patients'), {
        name,
        age: Number(age),
        condition,
      });
      setMessage('Patient added successfully!');
      setName('');
      setAge('');
      setCondition('');
    } catch (error) {
      setMessage('Error adding patient: ' + error.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Add Patient</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter patient name"
          />
        </div>
        <div>
          <label>Age:</label><br />
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age"
          />
        </div>
        <div>
          <label>Condition:</label><br />
          <input
            type="text"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="Enter condition"
          />
        </div>
        <br />
        <button type="submit">Add Patient</button>
      </form>
    </div>
  );
};

export default AddPatient;
