import { useState } from "react";
import { HiOutlineLockClosed, HiOutlineMail, HiExclamationCircle } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "/assets/Logo.svg";
import { loginWithEmail } from "../../firebase/auth";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login({ onShowResetForm }: { onShowResetForm: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors
    
    try {
      await loginWithEmail(email, password);
        
      // Check for firstTimeLogin claim
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const idTokenResult = await user.getIdTokenResult(true);
        if (idTokenResult.claims.firstTimeLogin) {
          onShowResetForm();
          return;
        }
      }
     navigate("/dashboard/main", { replace: true });
      // Continue with normal login flow (redirect, etc.)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login failed:", error.code);
      
      // Simplified error handling
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        background:
          "linear-gradient(90deg, rgba(32, 174, 248, 1) 0%, rgba(10, 148, 255, 1) 54%, rgba(143, 207, 255, 1) 100%)",
      }}
    >
      <Card className="w-full max-w-md shadow-lg overflow-hidden">
        <CardContent className="px-8 pt-8 pb-10">
          <div className="flex justify-center mb-6">
            <img
              src={Logo}
              alt="Self Assessment Logo"
              className="w-20 h-20 drop-shadow-sm"
            />
          </div>
          
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 mb-3">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <HiExclamationCircle className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <HiOutlineMail />
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className={`pl-10 ${error ? 'border-red-300 focus:border-red-500' : ''}`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(""); // Clear error when user starts typing
                  }}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={onShowResetForm}
                  className="p-0 h-auto text-xs font-medium text-blue-600 hover:text-blue-400"
                >
                  Reset Password
                </Button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <HiOutlineLockClosed />
                </span>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`pl-10 ${error ? 'border-red-300 focus:border-red-500' : ''}`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(""); // Clear error when user starts typing
                  }}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              style={{
                background:
                  "linear-gradient(45deg, rgba(32, 174, 248, 1) 0%, rgba(10, 148, 255, 1) 50%)",
              }}
            >
              {isLoading && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}