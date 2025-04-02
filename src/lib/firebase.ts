import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyAoujKD36-j-bQU1G6J5eVz0ODfCOYhE4I",
//   authDomain: "xno-dev.firebaseapp.com",
//   projectId: "xno-dev",
//   storageBucket: "xno-dev.firebasestorage.app",
//   messagingSenderId: "696663638281",
//   appId: "1:696663638281:web:47a2d66d650796ad8ad3d8",
//   measurementId: "G-WPCKS8QR63",
// };

const firebaseConfig = {
  apiKey: "AIzaSyCBBOwar3xoFDUfGQYSd3r6zMGvr23h6fQ",
  authDomain: "xno-vn-77549.firebaseapp.com",
  projectId: "xno-vn-77549",
  storageBucket: "xno-vn-77549.firebasestorage.app",
  messagingSenderId: "445219967900",
  appId: "1:445219967900:web:7f76e8d3f70a8222ccae59",
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
