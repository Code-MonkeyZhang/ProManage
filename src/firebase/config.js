// Firebase 9 modular imports
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  connectFirestoreEmulator,
  Timestamp,
} from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxkbNgbW2wkWm2JgpXhHxePtkLBLyrgnE",
  authDomain: "the-dojosite-1017f.firebaseapp.com",
  projectId: "the-dojosite-1017f",
  storageBucket: "the-dojosite-1017f.firebasestorage.app",
  messagingSenderId: "419461092233",
  appId: "1:419461092233:web:6ffa8b1e334e282f428758",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const projectFirestore = getFirestore(app);
const projectAuth = getAuth(app);
const projectStorage = getStorage(app);

// Initialize timestamp
const timestamp = Timestamp;

export { projectFirestore, projectAuth, projectStorage, timestamp };
