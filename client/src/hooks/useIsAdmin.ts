import { useEffect, useState } from "react";
import { getAuth, onIdTokenChanged, type User } from "firebase/auth";

const API_URL = import.meta.env.VITE_API_URL;

// Cache to avoid redundant API calls across components
let adminCache: { isAdmin: boolean; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const resolveIsAdmin = async (user: User) => {
      try {
        // Check cache first
        if (adminCache && Date.now() - adminCache.timestamp < CACHE_DURATION) {
          setIsAdmin(adminCache.isAdmin);
          setLoading(false);
          return;
        }

        // Use cached token first for faster load - only force refresh if needed
        const idTokenResult = await user.getIdTokenResult(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const claims: any = idTokenResult.claims;

        const adminClaim =
          claims?.admin === true ||
          claims?.role === "admin" ||
          (Array.isArray(claims?.roles) && claims.roles.includes("admin"));

        if (adminClaim) {
          setIsAdmin(true);
          adminCache = { isAdmin: true, timestamp: Date.now() };
          setLoading(false);
          return;
        }

        // Fallback robusto: verificar en el servidor (si tienes /api/me implementado)
        // Reuse the same token to avoid extra fetch
        try {
          const res = await fetch(`${API_URL}/api/me`, {
            headers: { Authorization: `Bearer ${idTokenResult.token}` },
          });
          if (res.ok) {
            const data = await res.json();
            const isAdminValue = Boolean(data?.isAdmin);
            setIsAdmin(isAdminValue);
            adminCache = { isAdmin: isAdminValue, timestamp: Date.now() };
          } else {
            setIsAdmin(false);
            adminCache = { isAdmin: false, timestamp: Date.now() };
          }
        } catch {
          setIsAdmin(false);
          adminCache = { isAdmin: false, timestamp: Date.now() };
        } finally {
          setLoading(false);
        }
      } catch {
        setIsAdmin(false);
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