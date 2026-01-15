// @ts-nocheck
// import { initializeApp } from "firebase/app";
// import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... boshqa configlar
};

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const googleProvider = new GoogleAuthProvider();

export const AuthService = {
  /**
   * Google orqali kirish (Popup oynasida)
   */
  loginWithGoogle: async () => {
    try {
      // const result = await signInWithPopup(auth, googleProvider);
      // return result.user;
      console.log("Google Login Mock");
      return { displayName: "Lazizbek", email: "test@gmail.com" };
    } catch (error) {
      console.error("Firebase Error:", error);
      throw error;
    }
  },

  /**
   * Tizimdan chiqish
   */
  logout: async () => {
    try {
      // await signOut(auth);
      console.log("Logged out");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  }
};