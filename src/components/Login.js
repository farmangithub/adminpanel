import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (userCredential.user.emailVerified) {
        navigate('/dashboard');
      } else {
        alert('Please verify your email before logging in.');
        await auth.signOut();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: 'red',
        fontWeight: 'bold',
        fontStyle: 'italic',
      }}
    >
      <h2>Login</h2>
      <input
        style={{ margin: '10px', padding: '8px', width: '250px' }}
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        style={{ margin: '10px', padding: '8px', width: '250px' }}
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button style={{ margin: '10px', padding: '10px 20px' }} type="submit">
        Login
      </button>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </form>
  );
}
