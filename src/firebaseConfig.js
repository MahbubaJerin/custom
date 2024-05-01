import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
export const firebaseApp = initializeApp({
    apiKey: "AIzaSyBTJi8FRoKiE8cW4uANYg3I_tmaQe_EcE4",
    authDomain: "plantbook-2b52a.firebaseapp.com",
    projectId: "plantbook-2b52a",
    storageBucket: "plantbook-2b52a.appspot.com",
    messagingSenderId: "382165771013",
    appId: "1:382165771013:web:cba60e832a86a1cd1d8d6c"
  });
  export const db = getFirestore(firebaseApp);
  export const userRef = collection(db, "Users");
  export const postRef = collection(db, "Posts");
  export const commentRef = collection(db, "Comments");