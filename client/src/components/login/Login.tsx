import { useState } from "react";
import { Lock, Mail, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SimpleThemeToggle } from "@/components/ui/theme-toggle";
import { toast } from "sonner";
import Logo from "/assets/Logo.svg";
import { loginWithEmail } from "../../firebase/auth";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login({
  onShowResetForm,
}: {
  onShowResetForm: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

        // Prefetch data while showing toast to improve perceived performance
        queryClient.prefetchQuery({
          queryKey: ['release-posts'],
          queryFn: async () => {
            const res = await axios.get(`${API_URL}/api/release-posts`);
            return res.data;
          },
          staleTime: 5 * 60 * 1000,
        });

        // Show welcome toast for successful login
        const userName =
          user.displayName || user.email?.split("@")[0] || "User";
        toast.success(`Welcome back, ${userName}! 🎉`, {
          description: "You've successfully logged in to your dashboard.",
          duration: 4000,
          style: {
            background: "#10b981",
            color: "white",
            border: "none",
          },
        });
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 dark:from-gray-800 dark:via-gray-900 dark:to-black transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <SimpleThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src={Logo}
              alt="Self Assessment Logo"
              className="w-20 h-20 drop-shadow-lg"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-50 via-white to-blue-100 dark:from-gray-100 dark:via-white dark:to-gray-200 drop-shadow-lg">
              Welcome back
            </h1>
            <p className="text-sm text-blue-100 dark:text-gray-300">
              Enter your credentials to access your account
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          <CardContent className="px-8 pt-8 pb-10 space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert
                variant="destructive"
                className="animate-in slide-in-from-top-2 duration-300"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className={`pl-10 h-11 transition-all duration-200 ${
                      error
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </Label>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={onShowResetForm}
                    className="p-0 h-auto text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`pl-10 pr-10 h-11 transition-all duration-200 ${
                      error
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full h-11 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(45deg, rgba(32, 174, 248, 1) 0%, rgba(10, 148, 255, 1) 50%)",
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
