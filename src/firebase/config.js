import firebase from "firebase/app";
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyC9Xx0_Y94y6gzT3MqL0olg0VqcQ8_ltZ8",
    authDomain: "theprojspace.firebaseapp.com",
    projectId: "theprojspace",
    storageBucket: "theprojspace.appspot.com",
    messagingSenderId: "1024122453927",
    appId: "1:1024122453927:web:cc5166dfbeae31d836c082"
};

firebase.initializeApp(firebaseConfig)

const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()

const timestamp = firebase.firestore.Timestamp

export {projectFirestore, projectAuth, projectStorage, timestamp}