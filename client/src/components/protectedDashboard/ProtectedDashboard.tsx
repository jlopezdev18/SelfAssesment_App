import React, { useEffect, useState } from "react";
import { onAuthStateChanged, onIdTokenChanged } from "firebase/auth";
import { auth } from "../../firebase/config";
import Dashboard from "../dashboard/Dashboard";
import Login from "../login/Login";
import ResetPasswordForm from "../resetPassword/ResetPasswordForm";
import { useNavigate } from "react-router-dom";

const ProtectedDashboard: React.FC = () => {
  const [allowed, setAllowed] = useState<null | boolean>(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, checkUser);
    const unsubscribeToken = onIdTokenChanged(auth, checkUser);

    async function checkUser(user: import("firebase/auth").User | null) {
      if (!user) {
        setAllowed(false);
        setShowResetForm(false);
        navigate("/", { replace: true });
        return;
      }
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.firstTimeLogin) {
        setShowResetForm(true);
        setAllowed(false);
         navigate("/", { replace: true });
        return;
      }
      setAllowed(true);
      setShowResetForm(false);
      navigate("/dashboard/main", { replace: true });
    }

    return () => {
      unsubscribeAuth();
      unsubscribeToken();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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