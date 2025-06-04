import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config";

const provider = new GoogleAuthProvider();

async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Usuario con Google:", result.user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error con Google:", error.message);
    } else {
      console.error("Error con Google:", error);
    }
  }
}

export { loginWithGoogle };
