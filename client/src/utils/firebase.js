// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwq8hxeN_fCmJKD0t1kzMpShMRCckMoKg",
  authDomain: "restjam-6dd35.firebaseapp.com",
  projectId: "restjam-6dd35",
  storageBucket: "restjam-6dd35.firebasestorage.app",
  messagingSenderId: "204665126663",
  appId: "1:204665126663:web:0052935338958b63cecfa2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
