import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6QKj1Vw6ZwSFfVizIOHTXvF_junfX8dU",
  authDomain: "instameasure-e072e.firebaseapp.com",
  projectId: "instameasure-e072e",
  storageBucket: "instameasure-e072e.appspot.com",
  messagingSenderId: "1087565029285",
  appId: "1:1087565029285:web:736696284f64e651dd124c",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
export const auth = firebase.auth();

const storage = firebase.storage();

export { db, storage };
