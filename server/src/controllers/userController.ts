import admin from "../firebase";
import { Request, Response } from "express";

export const getUsersWithRoleUser = async (req: Request, res: Response): Promise<any> => {
  try {
    // Query Firestore users collection for users with role 'user'
    const usersRef = admin.firestore().collection('users');
    const snapshot = await usersRef.where('role', '==', 'user').get();

    if (snapshot.empty) {
      return res.status(200).json({ users: [] });
    }

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({ users });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getUserByUid = async (req: Request, res: Response):Promise<any> => {
  const { uid } = req.params;
  try {
    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};