import { useState } from "react";
import {
  Mail,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SimpleThemeToggle } from "@/components/ui/theme-toggle";
import Logo from "/assets/Logo.svg";
import { sendPasswordResetEmail } from "../../firebase/auth";

export default function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await sendPasswordResetEmail(email);
      setSuccess(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Password reset failed:", error);

      // Handle specific Firebase error codes
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many requests. Please try again later.");
      } else {
        setError("Failed to send reset email. Please try again.");
      }
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
              Reset Password
            </h1>
            <p className="text-sm text-blue-100 dark:text-gray-300">
              {success
                ? "Check your email for reset instructions"
                : "Enter your email to receive a password reset link"}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          <CardContent className="px-8 pt-8 pb-10 space-y-6">
            {/* Back Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-0 h-auto text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 flex items-center gap-2"
              disabled={isLoading}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Button>

            {/* Success Alert */}
            {success && (
              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 animate-in slide-in-from-top-2 duration-300">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Password reset email sent! Please check your inbox and follow
                  the instructions to reset your password.
                </AlertDescription>
              </Alert>
            )}

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

            {!success ? (
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
                      autoFocus
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full h-11 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "linear-gradient(45deg, rgba(32, 174, 248, 1) 0%, rgba(10, 148, 255, 1) 50%)",
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p>
                    We've sent a password reset link to{" "}
                    <strong className="text-gray-900 dark:text-gray-100">
                      {email}
                    </strong>
                  </p>
                  <p>
                    Click the link in the email to reset your password. Check your spam folder if you don't see it in your inbox.
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={onBack}
                  className="w-full h-11 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{
                    background:
                      "linear-gradient(45deg, rgba(32, 174, 248, 1) 0%, rgba(10, 148, 255, 1) 50%)",
                  }}
                >
                  Return to login
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      setEmail("");
                    }}
                    className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 underline"
                  >
                    Didn't receive the email? Try again
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
