import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD__yNqNS2LFKbuu0TTrEbgw9dudOA0nfw",
  authDomain: "adminpanel9.firebaseapp.com",
  projectId: "adminpanel9",
  storageBucket: "adminpanel9.appspot.com",
  messagingSenderId: "603318455613",
  appId: "your_app_id" // ← Replace this with your real App ID from Firebase Console
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
