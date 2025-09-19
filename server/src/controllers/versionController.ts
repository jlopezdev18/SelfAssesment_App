import { Request, Response } from "express";
import admin from "../firebase"; // your firebase-admin init

const db = admin.firestore();
const versionRef = db.collection("versions");

// 📤 GET all versions
export const getAllVersions = async (_req: Request, res: Response): Promise<any> => {
  try {
    const snapshot = await admin
      .firestore()
      .collection("versions")
      .orderBy("releaseDate", "desc")
      .get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const versions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(versions);
  } catch (err) {
    console.error("Error fetching all versions:", err);
    res.status(500).json({ error: "Error fetching all versions" });
  }
};

// 📤 GET latest version
export const getLatestVersion = async (_req: Request, res: Response): Promise<any> => {
  try {
    const snapshot = await admin
      .firestore()
      .collection("versions")
      .orderBy("releaseDate", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "No versions found" });
    }

    const doc = snapshot.docs[0];
    const version = { id: doc.id, ...doc.data() };

    res.status(200).json(version);
  } catch (err) {
    console.error("Error fetching latest version:", err);
    res.status(500).json({ error: "Error fetching latest version" });
  }
};


// 🆕 POST create version
export const createVersion = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newDoc = await versionRef.add(data);
    res.status(201).json({ id: newDoc.id });
  } catch (err) {
    res.status(500).json({ error: "Error creating version" });
  }
};

// ✏️ PUT update version
export const updateVersion = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await versionRef.doc(id).update(req.body);
    res.status(200).json({ message: "Version updated" });
  } catch (err) {
    res.status(500).json({ error: "Error updating version" });
  }
};

// 🗑 DELETE version
export const deleteVersion = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await versionRef.doc(id).delete();
    res.status(200).json({ message: "Version deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting version" });
  }
};
