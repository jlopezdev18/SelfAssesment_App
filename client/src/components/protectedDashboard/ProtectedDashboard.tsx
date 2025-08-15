import React, { useEffect, useState } from "react";
import { onAuthStateChanged, onIdTokenChanged } from "firebase/auth";
import { auth } from "../../firebase/config";
import Dashboard from "../dashboard/Dashboard";
import Login from "../login/Login";
import ResetPasswordForm from "../resetPassword/ResetPasswordForm";

const ProtectedDashboard: React.FC = () => {
  const [allowed, setAllowed] = useState<null | boolean>(null);
  const [showResetForm, setShowResetForm] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, checkUser);
    const unsubscribeToken = onIdTokenChanged(auth, checkUser);

    async function checkUser(user: import("firebase/auth").User | null) {
      if (!user) {
        setAllowed(false);
        setShowResetForm(false)
        return;
      }
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.firstTimeLogin) {
        setShowResetForm(true);
        setAllowed(false);
        return;
      }
      setAllowed(true);
      setShowResetForm(false);
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
  return allowed ? (
    <Dashboard />
  ) : (
    <Login onShowResetForm={() => setShowResetForm(true)} />
  );
};

export default ProtectedDashboard;