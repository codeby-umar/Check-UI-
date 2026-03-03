import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyACdxl_eJ-o_4CjcX40awOepYUfYkVe944",
  authDomain: "check-login-f74b5.firebaseapp.com",
  projectId: "check-login-f74b5",
  storageBucket: "check-login-f74b5.firebasestorage.app",
  messagingSenderId: "573948684076",
  appId: "1:573948684076:web:5c37abbe3ec0c9c1746e89",
  measurementId: "G-V4Z9HMM34M"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();