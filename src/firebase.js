import firebase from 'firebase';

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyB9s3xa_E0f0GFjlqEcbnuuzKqkh6RQKt0",
    authDomain: "meet-tea-bf719.firebaseapp.com",
    projectId: "meet-tea-bf719",
    storageBucket: "meet-tea-bf719.appspot.com",
    messagingSenderId: "34636774989",
    appId: "1:34636774989:web:6fd674fd955c1de14b2604"
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();

export { db, auth, storage, functions };