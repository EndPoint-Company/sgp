// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Suas credenciais do Firebase que você obtém no console do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços que você usará
export const auth = getAuth(app);
export const db = getFirestore(app);