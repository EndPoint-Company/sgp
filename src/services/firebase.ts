// src/services/firebase.ts
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



// Suas credenciais do Firebase que você obtém no console do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBHBbJVFbanUPNSambTbcKnvfbF76XoQCM",
  authDomain: "sgp-pi2.firebaseapp.com",
  projectId: "sgp-pi2",
  storageBucket: "sgp-pi2.firebasestorage.app",
  messagingSenderId: "1064955015900",
  appId: "1:1064955015900:web:1a7ab172ba9751aa4b7a19",
  measurementId: "G-ZD2T0WJJ8Z"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
//const analytics = getAnalytics(app);

export { auth, db };