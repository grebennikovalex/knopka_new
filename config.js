import * as firebase from 'firebase'
import 'firebase/auth'
import 'firebase/database'
//import 'firebase/firestore'


let config = {
  apiKey: "AIzaSyBm_g9_yNdAsZ-UzsMIRujinyB2i1eLeHg",
  authDomain: "knoprka-e6c2e.firebaseapp.com",
  databaseURL: "https://knoprka-e6c2e.firebaseio.com",
  projectId: "knoprka-e6c2e",
  // storageBucket: "knoprka-e6c2e.appspot.com",
  // messagingSenderId: "1065915890930",
  appId: "1:1065915890930:web:2d3dcb8d68e45d73e4246b",
  measurementId: "G-8F7ZWZE6YX"
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export const db = firebase.database()
//export const store = firebase.firestore()

export const VER_NUMBER = 'v.0.4.9'


