import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const FB = {
  apiKey: "AIzaSyDZ_vFMHZ7t7nyJWJPRfD280VZzagqY5Ws",
  authDomain: "terreiro-bolhas-de-luz.firebaseapp.com",
  projectId: "terreiro-bolhas-de-luz",
  storageBucket: "terreiro-bolhas-de-luz.firebasestorage.app",
  messagingSenderId: "179602931861",
  appId: "1:179602931861:web:5cf336e9077334cee05b9c"
};

export const app = initializeApp(FB);
export const db = getFirestore(app);
export const G = window; // Isso permite que o HTML encontre suas funções