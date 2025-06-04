import { FcGoogle } from "react-icons/fc";
import { TfiMicrosoft } from "react-icons/tfi";
import { loginWithGoogle, loginWithMicrosoft } from "../../firebase/auth";

function SocialLoginButtons() {
  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      console.log("Logged in with Google");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleMicrosoft = async () => {
    try {
      await loginWithMicrosoft();
      console.log("Logged in with Microsoft");
    } catch (error) {
      console.error("Microsoft login error:", error);
    }
  };
  return (
    <div className="flex justify-center space-x-4">
      <button
        onClick={handleGoogle}
        className="w-12 h-12 rounded-full border flex items-center cursor-pointer justify-center hover:bg-gray-100 transition"
      >
        <FcGoogle className="text-2xl" />
      </button>
      <button
        onClick={handleMicrosoft}
        className="w-12 h-12 rounded-full border flex items-center cursor-pointer justify-center hover:bg-gray-100 transition"
      >
        <TfiMicrosoft className="text-xl text-blue-600" />
      </button>
    </div>
  );
}

export default SocialLoginButtons;
