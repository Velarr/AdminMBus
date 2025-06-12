import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCo1X8TX1e8o3eN7abLWJJSt3Ph9pbCkWQ",
  authDomain: "busdb-90db1.firebaseapp.com",
  databaseURL: "https://busdb-90db1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "busdb-90db1",
  storageBucket: "busdb-90db1.firebasestorage.app",
  messagingSenderId: "11060967938",
  appId: "1:11060967938:web:4da0b4a24372fc3225051b",
  measurementId: "G-ZP57DZJP6P"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
