import { useEffect, useState } from "react";
import { getAuth, onIdTokenChanged, type User } from "firebase/auth";

const API_URL = import.meta.env.VITE_API_URL;

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const resolveIsAdmin = async (user: User) => {
      try {
        // Get token for authentication
        const idToken = await user.getIdToken();

        // Check server (Firestore) for definitive admin status
        const res = await fetch(`${API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (res.ok) {
          const data = await res.json();
          const isAdminValue = Boolean(data?.isAdmin);
          setIsAdmin(isAdminValue);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onIdTokenChanged(auth, (user) => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      resolveIsAdmin(user);
    });

    // Mantener token fresco en sesiones largas (cada ~55 min)
    const interval = setInterval(async () => {
      const u = auth.currentUser;
      if (u) await u.getIdToken(true);
    }, 55 * 60 * 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return { isAdmin, loading };
}