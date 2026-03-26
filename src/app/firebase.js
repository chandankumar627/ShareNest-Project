import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCldTnJhxR2DMHIdjzxEf-yrZhX8QjEK8I",
  authDomain: "sharenest-63fda.firebaseapp.com",
  projectId: "sharenest-63fda",
  storageBucket: "sharenest-63fda.firebasestorage.app",
  messagingSenderId: "1031174105816",
  appId: "1:1031174105816:web:42107bf41b48b03a66c5ad",
  measurementId: "G-4RPQQ2GSFX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


export const googleProvider = new GoogleAuthProvider();



export default app;
