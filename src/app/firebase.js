import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDCtrEFSxTI2qQLm_baFdTeAHTuK-x0Mw",
  authDomain: "shareapp-67a9f.firebaseapp.com",
  projectId: "shareapp-67a9f",
  storageBucket: "shareapp-67a9f.appspot.com", 
  messagingSenderId: "744218399378",
  appId: "1:744218399378:web:9c506d18d343def4cd0c4b",
  measurementId: "G-K341KZKYJL",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); 


export const googleProvider = new GoogleAuthProvider();



export default app;
