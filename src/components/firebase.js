import firebase from 'firebase'
//import firebase from 'firebase/app'
//import * as firebase from 'firebase';
//import "firebase/auth";
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyBfWoNBt4gG7ObGsipuGI1gMSnzjaA9Anw",
    authDomain: "goldwingsevents-65a24.firebaseapp.com",
    databaseURL: "https://goldwingsevents-65a24.firebaseio.com",
    projectId: "goldwingsevents-65a24",
    storageBucket: "goldwingsevents-65a24.appspot.com",
    messagingSenderId: "227976863125",
    appId: "1:227976863125:web:86a29b29d520f07eb0ea9c",
    measurementId: "G-CWGB6PH2CG"
  };
  // Initialize Firebase
  if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  }
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;