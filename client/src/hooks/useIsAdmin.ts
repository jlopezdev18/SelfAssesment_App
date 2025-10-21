import { useEffect, useState, useRef } from "react";
import { getAuth, onIdTokenChanged, type User } from "firebase/auth";

const API_URL = import.meta.env.VITE_API_URL;

// Memoized cache per user to avoid repeated API calls
const adminStatusCache = new Map<string, { isAdmin: boolean; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const currentUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const resolveIsAdmin = async (user: User) => {
      currentUserIdRef.current = user.uid;

      try {
        // Check cache first
        const cached = adminStatusCache.get(user.uid);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setIsAdmin(cached.isAdmin);
          setLoading(false);
          return;
        }

        // Get token for authentication
        const idToken = await user.getIdToken();

        // Check server (Firestore) for definitive admin status
        const res = await fetch(`${API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (res.ok) {
          const data = await res.json();
          const isAdminValue = Boolean(data?.isAdmin);

          // Only update if this is still the current user
          if (currentUserIdRef.current === user.uid) {
            setIsAdmin(isAdminValue);
            adminStatusCache.set(user.uid, { isAdmin: isAdminValue, timestamp: Date.now() });
          }
        } else {
          if (currentUserIdRef.current === user.uid) {
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        if (currentUserIdRef.current === user.uid) {
          setIsAdmin(false);
        }
      } finally {
        if (currentUserIdRef.current === user.uid) {
          setLoading(false);
        }
      }
    };

    const unsubscribe = onIdTokenChanged(auth, (user) => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        currentUserIdRef.current = null;
        return;
      }

      // If user has changed (different UID), clear old cache for security
      if (currentUserIdRef.current && currentUserIdRef.current !== user.uid) {
        adminStatusCache.clear(); // Clear cache when user switches
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