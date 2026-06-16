import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDJzT8FGeg81y4m0v36T_F9QHvmwI_liuE",
  authDomain: "web-app-81574.firebaseapp.com",
  projectId: "web-app-81574",
  storageBucket: "web-app-81574.firebasestorage.app",
  messagingSenderId: "1004362169241",
  appId: "1:1004362169241:web:4e9596aa696eeaf04f3108",
  measurementId: "G-L9CYJYKT6X",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
