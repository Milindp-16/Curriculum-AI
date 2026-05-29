// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-course-builder-dc00d.firebaseapp.com",
  projectId: "ai-course-builder-dc00d",
  storageBucket: "ai-course-builder-dc00d.firebasestorage.app",
  messagingSenderId: "351577544269",
  appId: "1:351577544269:web:506072c36f202be7886e04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);