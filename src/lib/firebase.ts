// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCchlx3Fqs7vDu7_yTiqY2J_UV4EQY43CE",
  authDomain: "resume-builder-7c0bb.firebaseapp.com",
  projectId: "resume-builder-7c0bb",
  storageBucket: "resume-builder-7c0bb.firebasestorage.app",
  messagingSenderId: "39616636999",
  appId: "1:39616636999:web:860f42dc1fc5626fbd2962",
  measurementId: "G-23619RR5B2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
let analytics: any = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;
