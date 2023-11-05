// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "business-site-70280.firebaseapp.com",
  projectId: "business-site-70280",
  storageBucket: "business-site-70280.appspot.com",
  messagingSenderId: "330967152130",
  appId: "1:330967152130:web:8464d40c00bbbaf6af991b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);