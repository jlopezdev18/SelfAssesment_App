import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";
import Dashboard from "../dashboard/Dashboard";
import Login from "../login/Login";
import ResetPasswordForm from "../resetPassword/ResetPasswordForm";
import { useNavigate } from "react-router-dom";
import { useSessionTimeout } from "../../hooks/useSessionTimeout";

const ProtectedDashboard: React.FC = () => {
  const [allowed, setAllowed] = useState<null | boolean>(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const navigate = useNavigate();

  // Initialize session timeout monitoring
  useSessionTimeout();

  useEffect(() => {
    // Use only onAuthStateChanged to avoid duplicate calls
    const unsubscribe = onAuthStateChanged(auth, checkUser);

    async function checkUser(user: import("firebase/auth").User | null) {
      if (!user) {
        setAllowed(false);
        setShowResetForm(false);
        navigate("/", { replace: true });
        return;
      }
      // Remove force refresh - use cached token for faster load
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
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show loading spinner during auth check
  if (allowed === null && !showResetForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

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
