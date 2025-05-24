import React, { useState } from 'react';

export default function AddPatient() {
  const [patient, setPatient] = useState({
    name: '',
    age: '',
    email: '',
    address: '',
  });

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle patient save logic here
    alert('Patient added: ' + JSON.stringify(patient));
  };

  return (
    <div>
      <h2>Add Patient</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="age" type="number" placeholder="Age" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="address" placeholder="Address" onChange={handleChange} required />
        <button type="submit">Add Patient</button>
      </form>
    </div>
  );
}
