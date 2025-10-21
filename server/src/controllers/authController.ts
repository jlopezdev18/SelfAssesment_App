import { Request, Response } from "express";
import admin from "../firebase";
import { generateRandomPassword } from "../utils/generatePassword";
import { sendEmailToUser } from "../utils/email";

export const createUser = async (req: Request, res: Response): Promise<any> => {
  const { email, firstName, lastName } = req.body;

  if (!email || !firstName || !lastName) {
    return res
      .status(400)
      .json({ error: "Email, firstName, and lastName are required" });
  }
  const displayName = `${firstName} ${lastName}`;
  const password = generateRandomPassword();

  try {
    const user = await admin
      .auth()
      .createUser({ email, password, displayName });

    // Add custom claims to track first login and timestamp
    await admin.auth().setCustomUserClaims(user.uid, {
      firstTimeLogin: true,
      passwordCreatedAt: Date.now(),
    });
    await admin.firestore().collection("users").doc(user.uid).set({
      email,
      displayName,
      firstName,
      lastName,
      role: "user",
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      nextPaymentDate: null,
    });
    // Send the temporary password email
    await sendEmailToUser(email, password);
    return res
      .status(200)
      .json({ message: "User created and email sent.", password: password });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const removeFirstTimeFlag = async (
  req: Request,
  res: Response
): Promise<any> => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.status(401).json({ error: "Authorization token missing" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const userRecord = await admin.auth().getUser(decoded.uid);
    const currentClaims = userRecord.customClaims || {};

    // Remove firstTimeLogin and passwordCreatedAt, but preserve other claims (like role, admin, etc.)
    const { firstTimeLogin, passwordCreatedAt, ...preservedClaims } = currentClaims as any;

    await admin.auth().setCustomUserClaims(decoded.uid, preservedClaims);

    return res.status(200).json({ message: "First-time login flag removed" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const setUserRole = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { uid, role } = req.body; // uid: user's UID, role: "admin" or "user"
  if (!uid || !role) {
    return res.status(400).json({ error: "uid and role are required" });
  }

  if (role !== "admin" && role !== "user") {
    return res.status(400).json({ error: "role must be either 'admin' or 'user'" });
  }

  try {
    // Update Firestore - single source of truth
    await admin.firestore().collection("users").doc(uid).update({
      role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ message: "Role set successfully", uid, role });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return res.status(500).json({ error: errorMessage });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    // Fetch all users from Firestore (single source of truth)
    const usersSnapshot = await admin.firestore().collection("users").get();

    const users = usersSnapshot.docs.map((doc) => {
      const userData = doc.data();

      return {
        uid: doc.id,
        email: userData.email,
        displayName: userData.displayName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || "user",
        active: userData.active !== false,
        deleted: userData.deleted || false,
        createdAt: userData.createdAt,
        companyId: userData.companyId,
      };
    });

    // Filter out deleted users
    const activeUsers = users.filter(user => !user.deleted);

    return res.status(200).json(activeUsers);
  } catch (err: any) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ error: err.message || "Failed to fetch users" });
  }
};

export const me = async (req: Request, res: Response): Promise<any> => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken)
    return res.status(401).json({ error: "Authorization token missing" });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Check Firestore for user's role (single source of truth)
    const userDoc = await admin.firestore().collection("users").doc(decoded.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found in database" });
    }

    const userData = userDoc.data();
    const role = userData?.role || "user";
    const isAdmin = role === "admin";

    return res.status(200).json({
      uid: decoded.uid,
      email: decoded.email,
      isAdmin,
      role,
      displayName: userData?.displayName,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
    });
  } catch (err: any) {
    return res.status(401).json({ error: err.message || "Invalid token" });
  }
};
