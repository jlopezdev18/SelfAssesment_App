import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      const authInstance = getAuth();
      const user = authInstance.currentUser;
      if (user) {
        const token = await user.getIdTokenResult();
        setIsAdmin(token.claims.role === "admin");
      }
    };
    fetchRole();
  }, []);

  return isAdmin;
}