import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config"; // Adjust the path as necessary

async function loginWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Logueado:", userCredential.user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Error:", error);
    }
  }
}

export { loginWithEmail };
