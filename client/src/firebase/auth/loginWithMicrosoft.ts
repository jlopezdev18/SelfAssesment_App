import { OAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config";

const provider = new OAuthProvider("microsoft.com");
const LOGIN_TIMESTAMP_KEY = 'session_login_timestamp';

async function loginWithMicrosoft() {
  try {
    const result = await signInWithPopup(auth, provider);
    // Set login timestamp for session expiry tracking
    localStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString());
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