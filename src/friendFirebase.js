// src/friendFirebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const friendFirebaseConfig = {
  apiKey: "AIzaSyAIbWQUJc8JydO_2gVGwUBe9T16joZ0TpU",
  authDomain: "telemedical-app-d9d91.firebaseapp.com",
  databaseURL: "https://telemedical-app-d9d91-default-rtdb.firebaseio.com",
  projectId: "telemedical-app-d9d91",
  storageBucket: "telemedical-app-d9d91.appspot.com",
  messagingSenderId: "53059995467",
  appId: "1:53059995467:android:2a38f8bd13ca297c65cace"
};

const friendApp = initializeApp(friendFirebaseConfig, "friendApp");
const friendDatabase = getDatabase(friendApp);
const friendStorage = getStorage(); // ✅ Add this line

export default friendDatabase;
export { friendStorage }; // ✅ Export storage separately
