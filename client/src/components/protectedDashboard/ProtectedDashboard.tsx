import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";
import Login from "../login/Login";
import ResetPasswordForm from "../resetPassword/ResetPasswordForm";
import ForgotPasswordForm from "../forgotPassword/ForgotPasswordForm";
import { useNavigate, useLocation } from "react-router-dom";
import { useSessionTimeout } from "../../hooks/useSessionTimeout";

const ProtectedDashboard: React.FC = () => {
  const [showResetForm, setShowResetForm] = useState(false);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize session timeout monitoring
  useSessionTimeout();

  useEffect(() => {
    // Use only onAuthStateChanged to avoid duplicate calls
    const unsubscribe = onAuthStateChanged(auth, checkUser);

    async function checkUser(user: import("firebase/auth").User | null) {
      if (!user) {
        setShowResetForm(false);
        setShowForgotPasswordForm(false);
        setIsLoading(false);
        // Only navigate if not already on root
        if (location.pathname !== "/") {
          navigate("/", { replace: true });
        }
        return;
      }
      // Remove force refresh - use cached token for faster load
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.firstTimeLogin) {
        setShowResetForm(true);
        setIsLoading(false);
        navigate("/", { replace: true });
        return;
      }
      // User is authenticated, redirect to dashboard
      setIsLoading(false);
      navigate("/dashboard/main", { replace: true });
    }

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show loading spinner during auth check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (showResetForm) {
    return <ResetPasswordForm onBack={() => setShowResetForm(false)} />;
  }

  if (showForgotPasswordForm) {
    return (
      <ForgotPasswordForm onBack={() => setShowForgotPasswordForm(false)} />
    );
  }

  return (
    <Login
      onShowResetForm={() => setShowResetForm(true)}
      onShowForgotPasswordForm={() => setShowForgotPasswordForm(true)}
    />
  );
};

export default ProtectedDashboard;
