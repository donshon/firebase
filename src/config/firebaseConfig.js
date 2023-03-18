// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//the database
import { getFirestore } from "firebase/firestore";
//for login authentication
import {getAuth} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmlcpboG-sXhD0gzDMzwrqOcSauSPQ79g",
  authDomain: "mimo-blog.firebaseapp.com",
  projectId: "mimo-blog",
  storageBucket: "mimo-blog.appspot.com",
  messagingSenderId: "207491367161",
  appId: "1:207491367161:web:be90ff3bfa9bbb50e2e228"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//setup and export database
export const db = getFirestore(app)

export const auth = getAuth(app)