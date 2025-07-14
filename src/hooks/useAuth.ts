import { useEffect, useState, useCallback } from "react";
import { User } from "@/core/models/user";
import { authServiceInstance } from "@/lib/di-container";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    authServiceInstance.onAuthStateChanged((u) => {
      console.log("onAuthStateChanged", u);
      setUser(u);
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const u = await authServiceInstance.loginWithEmail(email, password);
      setUser(u);
      if (!u) setError("Identifiants invalides");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const u = await authServiceInstance.loginWithGoogle();
      setUser(u);
      if (!u) setError("Erreur Google Auth");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await authServiceInstance.logout();
      setUser(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, login, loginWithGoogle, logout };
}
