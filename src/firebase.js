// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Import Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyD__yNqNS2LFKbuu0TTrEbgw9dudOA0nfw",
  authDomain: "adminpanel9.firebaseapp.com",
  databaseURL: "https://adminpanel9-default-rtdb.firebaseio.com", // Add your Realtime Database URL here
  projectId: "adminpanel9",
  storageBucket: "adminpanel9.appspot.com",
  messagingSenderId: "603318455613",
  appId: "1:603318455613:android:06453393bdf7a4c06a8954"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app); // Initialize Realtime Database instance
const auth = getAuth(app);

export { db, auth };
