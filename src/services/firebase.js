import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth/';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
    apiKey: "AIzaSyBl-cYM8XtkB4Yceg7KwvsmIWBZfBsCXSo",
    authDomain: "generatorideaapp.firebaseapp.com",
    projectId: "generatorideaapp",
    storageBucket: "generatorideaapp.firebasestorage.app",
    messagingSenderId: "125014306376",
    appId: "1:125014306376:web:1a21903396d6ae7ca7727d",
    measurementId: "G-4CRQTRYCV0"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
export const db = getFirestore(app);