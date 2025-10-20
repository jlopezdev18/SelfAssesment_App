import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import Logo from "/assets/Logo.svg";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import axios from "axios";
import zxcvbn from "zxcvbn";
const API_URL = import.meta.env.VITE_API_URL;

type PasswordInputProps = {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label: string;
  showPassword: boolean;
  toggleShow: () => void;
  error?: string;
};

const PasswordInput = ({
  id,
  value,
  onChange,
  placeholder,
  label,
  showPassword,
  toggleShow,
  error,
}: PasswordInputProps) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </Label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`pl-10 pr-10 h-11 transition-all duration-200 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
            : "focus:ring-blue-500 focus:border-blue-500"
        }`}
        value={value}
        onChange={onChange}
        required
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
        onClick={toggleShow}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-gray-400" />
        ) : (
          <Eye className="h-4 w-4 text-gray-400" />
        )}
      </Button>
    </div>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

type ResetPasswordFormProps = {
  onBack: () => void;
};

export default function ResetPasswordForm({ onBack }: ResetPasswordFormProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  type Errors = {
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    submit?: string;
  };

  const [errors, setErrors] = useState<Errors>({});

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!oldPassword) {
      newErrors.oldPassword = "Current password is required";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else {
      const strength = zxcvbn(newPassword);
      if (strength.score < 3) {
        newErrors.newPassword =
          "Password is too weak. Use a mix of uppercase, lowercase, numbers, and symbols.";
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (oldPassword === newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error("No user is signed in.");

      // Re-authenticate user with old password
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      // Remove firstTimeLogin claim by calling backend
      const idToken = await user.getIdToken();
      await axios.post(
        `${API_URL}/api/remove-first-time-flag`,
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      if (user) {
        await user.getIdToken(true); // Refresh token to clear claims
      }

      // Show success toast
      toast.success("Password changed successfully! 🔒", {
        description: "Your password has been updated and you're now logged in.",
        duration: 4000,
        style: {
          background: "#10b981",
          color: "white",
          border: "none",
        },
      });

      onBack();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Password change failed:", error);
      setErrors({
        submit: error.message || "Failed to change password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = zxcvbn(newPassword);

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        background:
          "linear-gradient(90deg, rgba(32, 174, 248, 1) 0%, rgba(10, 148, 255, 1) 54%, rgba(143, 207, 255, 1) 100%)",
      }}
    >
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
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-50 via-white to-blue-100 drop-shadow-lg">
              Reset Password
            </h1>
            <p className="text-sm text-blue-100">
              Enter your current password and choose a new one
            </p>
          </div>
        </div>

        {/* Reset Password Card */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="px-8 pt-8 pb-10 space-y-6">
            {/* Error Alert */}
            {errors.submit && (
              <Alert
                variant="destructive"
                className="animate-in slide-in-from-top-2 duration-300"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <PasswordInput
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter your current password"
                label="Current Password"
                showPassword={showOldPassword}
                toggleShow={() => setShowOldPassword(!showOldPassword)}
                error={errors.oldPassword}
              />

              <PasswordInput
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                label="New Password"
                showPassword={showNewPassword}
                toggleShow={() => setShowNewPassword(!showNewPassword)}
                error={errors.newPassword}
              />

              {/* Password strength bar and feedback */}
              {newPassword && (
                <div className="space-y-2">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300`}
                      style={{
                        width: `${(passwordStrength.score + 1) * 20}%`,
                        background:
                          passwordStrength.score < 2
                            ? "#ef4444"
                            : passwordStrength.score < 3
                            ? "#f59e0b"
                            : "#10b981",
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    {passwordStrength.feedback.suggestions[0] ||
                      ["Weak", "Fair", "Good", "Strong", "Very strong"][
                        passwordStrength.score
                      ]}
                  </p>
                </div>
              )}

              <PasswordInput
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                label="Confirm New Password"
                showPassword={showConfirmPassword}
                toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
                error={errors.confirmPassword}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(45deg, rgba(32, 174, 248, 1) 0%, rgba(10, 148, 255, 1) 50%)",
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>

              {/* Back Button */}
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="w-full h-11 transition-all duration-200"
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
