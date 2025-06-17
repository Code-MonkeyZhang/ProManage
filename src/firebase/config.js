import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
firebase.initializeApp(firebaseConfig);

// init services
const projectFirestore = firebase.firestore;
const projectAuth = firebase.auth();
const projectStorage = firebase.storage;

//timestamp
const timestamp = firebase.firestore.Timestamp;

export { projectFirestore, projectAuth, projectStorage, timestamp };
