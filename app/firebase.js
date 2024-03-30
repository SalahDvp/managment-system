// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGqCgNTkZWEIxX3-WTn0aU4vUv3WBlCao",
  authDomain: "software-management-system-mvp.firebaseapp.com",
  projectId: "software-management-system-mvp",
  storageBucket: "software-management-system-mvp.appspot.com",
  messagingSenderId: "1057819088523",
  appId: "1:1057819088523:web:ac66ca62c9ba4eb4af268e",
  measurementId: "G-FGPNPFB47D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig,{
  ignoreUndefinedProperties: true
});

export const auth = initializeAuth(app);
const db = getFirestore(app)


export {db}
export default app 