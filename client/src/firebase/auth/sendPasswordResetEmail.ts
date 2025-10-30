import { sendPasswordResetEmail as firebaseSendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config";

async function sendPasswordResetEmail(email: string) {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error("Password reset email failed:", error);
    throw error;
  }
}

export { sendPasswordResetEmail };

