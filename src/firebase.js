// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwuRNSNIYFEHi8tatgCfrEw1p9FG22Uco",
  authDomain: "gardio-738fc.firebaseapp.com",
  projectId: "gardio-738fc",
  storageBucket: "gardio-738fc.appspot.com",
  messagingSenderId: "673960985156",
  appId: "1:673960985156:web:8188ab3ec6d79892977211",
};

// Check if Firebase is already initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
