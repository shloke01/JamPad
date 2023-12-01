import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Firebase config
export const firebaseConfig = {
    apiKey: "AIzaSyBYB28niGtyRhTd1SrE_JGf_BZ-y9rEpbs",
    authDomain: "cadenza-rn.firebaseapp.com",
    projectId: "cadenza-rn",
    storageBucket: "cadenza-rn.appspot.com",
    messagingSenderId: "672134177256",
    appId: "1:672134177256:web:5c3b217cdda130033dc45d",
    measurementId: "G-J4SNHKEZ1N",
};

// Initialize Firebase, auth, firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { app, auth, db };
