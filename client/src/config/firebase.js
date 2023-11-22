import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBYB28niGtyRhTd1SrE_JGf_BZ-y9rEpbs",
  authDomain: "cadenza-rn.firebaseapp.com",
  projectId: "cadenza-rn",
  storageBucket: "cadenza-rn.appspot.com",
  messagingSenderId: "672134177256",
  appId: "1:672134177256:web:5c3b217cdda130033dc45d",
  measurementId: "G-J4SNHKEZ1N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default app;
