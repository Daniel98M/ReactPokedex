// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUZYK2OFghBGBeikxklIyvSCjuAhR8QnY",
  authDomain: "react-pokemon-danielm.firebaseapp.com",
  projectId: "react-pokemon-danielm",
  storageBucket: "react-pokemon-danielm.appspot.com",
  messagingSenderId: "343358339100",
  appId: "1:343358339100:web:89147fd15aeae256da47d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);