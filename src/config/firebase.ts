import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCR8XSIisUgNE5xxFgFrdUyMnIgxaaeVGU",
  authDomain: "fhstore-d120c.firebaseapp.com",
  databaseURL: "https://fhstore-d120c-default-rtdb.firebaseio.com",
  projectId: "fhstore-d120c",
  storageBucket: "fhstore-d120c.firebasestorage.app",
  messagingSenderId: "601104325687",
  appId: "1:601104325687:web:65a4302b7c6d62fac633b2",
  measurementId: "G-7B7174B0DS"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

