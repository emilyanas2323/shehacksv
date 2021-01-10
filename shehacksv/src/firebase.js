import firebaseConfig from "./firebaseConfig";
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
export {db};