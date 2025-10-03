import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config";

const provider = new GoogleAuthProvider();
const LOGIN_TIMESTAMP_KEY = 'session_login_timestamp';

async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    // Set login timestamp for session expiry tracking
    localStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString());
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
