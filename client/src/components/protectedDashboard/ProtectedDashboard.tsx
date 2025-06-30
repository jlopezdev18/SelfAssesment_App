import React, { useEffect, useState } from "react";
import { onAuthStateChanged, onIdTokenChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
import { auth, db } from "../../firebase/config";
import Dashboard from "../dashboard/Dashboard";
import Login from "../login/Login";
import ResetPasswordForm from "../resetPassword/ResetPasswordForm";

const ProtectedDashboard: React.FC = () => {
  const [allowed, setAllowed] = useState<null | boolean>(null);
  const [showResetForm, setShowResetForm] = useState(false);

  useEffect(() => {
  // Listen for both auth and token changes
  const unsubscribeAuth = onAuthStateChanged(auth, checkUser);
  const unsubscribeToken = onIdTokenChanged(auth, checkUser);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function checkUser(user: any) {
    if (!user) {
      setAllowed(false);
      setShowResetForm(false);
      return;
    }
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.firstTimeLogin) {
        setShowResetForm(true);
        setAllowed(false);
        return;
      }
      setAllowed(true);
      setShowResetForm(false);
    } else {
      setAllowed(false);
      setShowResetForm(false);
      Swal.fire(
        "Acceso denegado",
        "No tienes permiso para acceder al dashboard.",
        "error"
      );
    }
  }

  return () => {
    unsubscribeAuth();
    unsubscribeToken();
  };
}, []);

  if (allowed === null && !showResetForm) return null; // o un spinner

  if (showResetForm) {
    return <ResetPasswordForm onBack={() => setShowResetForm(false)} />;
  }
  console.log(allowed);
  return allowed ? (
    <Dashboard />
  ) : (
    <Login onShowResetForm={() => setShowResetForm(true)} />
  );
};

export default ProtectedDashboard;