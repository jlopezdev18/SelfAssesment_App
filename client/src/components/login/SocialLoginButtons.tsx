import { FcGoogle } from "react-icons/fc";
import { TfiMicrosoft } from "react-icons/tfi";

function SocialLoginButtons() {
  return (
    <div className="flex justify-center space-x-4">
      <button className="w-12 h-12 rounded-full border flex items-center cursor-pointer justify-center hover:bg-gray-100 transition">
        <FcGoogle className="text-2xl" />
      </button>
      <button className="w-12 h-12 rounded-full border flex items-center cursor-pointer justify-center hover:bg-gray-100 transition">
        <TfiMicrosoft className="text-xl text-blue-600" />
      </button>
    </div>
  );
}

export default SocialLoginButtons;
