import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWfK6e-DQtLU10GaHe51S7Hb_OBZqVhew",
  authDomain: "instameasure-app.firebaseapp.com",
  projectId: "instameasure-app",
  storageBucket: "instameasure-app.appspot.com",
  messagingSenderId: "910644309980",
  appId: "1:910644309980:web:fdc0c882f4bff67332a919",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
export const auth = firebase.auth();

const storage = firebase.storage();

export { db, storage };
