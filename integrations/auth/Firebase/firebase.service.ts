// @ts-nocheck

import { initializeApp, FirebaseApp } from "firebase/app";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    Auth,
    User,
} from "firebase/auth";
import { env } from "../../../core/env";

// Firebase configuration object.
// The values are read from the environment variables.
const firebaseConfig = {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID,
};

// The Firebase app instance.
const app: FirebaseApp = initializeApp(firebaseConfig);

// The Firebase auth instance.
const auth: Auth = getAuth(app);

// The Google auth provider instance.
const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();

// This service provides methods for interacting with the Firebase Authentication API.
export const AuthService = {
    // Logs in the user with Google using a popup window.
    // @returns A promise that resolves with the user object.
    loginWithGoogle: async (): Promise<User> => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return result.user;
        } catch (error) {
            console.error("Firebase login error:", error);
            throw error;
        }
    },

    // Logs out the current user.
    // @returns A promise that resolves when the user is logged out.
    logout: async (): Promise<void> => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Firebase logout error:", error);
            throw error;
        }
    },

    // Subscribes to the authentication state changes.
    // @param callback
    // @returns
    onAuthStateChanged: (callback: (user: User | null) => void) => {
        return auth.onAuthStateChanged(callback);
    },
};