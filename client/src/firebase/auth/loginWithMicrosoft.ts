import { OAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config";

const provider = new OAuthProvider("microsoft.com");

async function loginWithMicrosoft() {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Usuario con Microsoft:", result.user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error con Microsoft:", error.message);
    } else {
      console.error("Error con Microsoft:", error);
    }
  }
}

export { loginWithMicrosoft };