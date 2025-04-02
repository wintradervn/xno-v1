import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAoujKD36-j-bQU1G6J5eVz0ODfCOYhE4I",
  authDomain: "xno-dev.firebaseapp.com",
  projectId: "xno-dev",
  storageBucket: "xno-dev.firebasestorage.app",
  messagingSenderId: "696663638281",
  appId: "1:696663638281:web:47a2d66d650796ad8ad3d8",
  measurementId: "G-WPCKS8QR63",
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
