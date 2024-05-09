import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyApKv3T646LuVdCExxlSVt2dVzy0hcu8V8",
  authDomain: "obesity-da5c1.firebaseapp.com",
  projectId: "obesity-da5c1",
  storageBucket: "obesity-da5c1.appspot.com",
  messagingSenderId: "494870818911",
  appId: "1:494870818911:web:03c32ce652b05c27c42bea",
  measurementId: "G-FBC516W4VW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
