// Import the functions you need from the SDKs you need from Firebase CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqplwSv8Qk4LkfpWJKzCEaBHHi_feE8eA",
  authDomain: "aetheris-weather-intelligence.firebaseapp.com",
  projectId: "aetheris-weather-intelligence",
  storageBucket: "aetheris-weather-intelligence.firebasestorage.app",
  messagingSenderId: "1000570036104",
  appId: "1:1000570036104:web:9de48c7710dc223a5d643d",
  measurementId: "G-NQVM9FEJYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Get Firestore instance and export it
const db = getFirestore(app);

export { db };