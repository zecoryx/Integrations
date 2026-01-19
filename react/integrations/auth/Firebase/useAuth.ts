import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { AuthService } from "./firebase.service";

// A custom hook for managing Firebase authentication.
// @returns An object containing the user, loading state, error, and functions to log in and log out.
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await AuthService.loginWithGoogle();
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await AuthService.logout();
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoading, error, loginWithGoogle, logout };
};