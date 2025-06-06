import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
import { auth, db } from "../../firebase/config";
import Dashboard from "../dashboard/Dashboard";
import Login from "../login/Login";

const ProtectedDashboard: React.FC = () => {
  const [allowed, setAllowed] = useState<null | boolean>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAllowed(false);
        Swal.fire("No autorizado", "Debes iniciar sesión.", "error");
        return;
      }
      // Buscar por email en vez de por UID
      console.log(user);
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setAllowed(true);
      } else {
        setAllowed(false);
        Swal.fire(
          "Acceso denegado",
          "No tienes permiso para acceder al dashboard.",
          "error"
        );
      }
    });
    return () => unsubscribe();
  }, []);

  if (allowed === null) return null; // o un spinner

  return allowed ? <Dashboard /> : <Login />;
};

export default ProtectedDashboard;
