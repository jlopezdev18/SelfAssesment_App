import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config"; // Adjust the path as necessary

const LOGIN_TIMESTAMP_KEY = 'session_login_timestamp';

async function loginWithEmail(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    // Set login timestamp for session expiry tracking
    localStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString());
  } catch (error: unknown) {
    console.error("Login failed:", error);
    throw error;
  }
}

export { loginWithEmail };
