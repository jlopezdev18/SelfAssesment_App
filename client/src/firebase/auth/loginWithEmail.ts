import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config"; // Adjust the path as necessary

async function loginWithEmail(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Error:", error);
    }
  }
}

export { loginWithEmail };
