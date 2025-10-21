import { Request, Response } from "express";
import admin from "../firebase";
import { handleError, handleNotFound, handleSuccess } from "../utils/errorHandler";

const db = admin.firestore();
const versionRef = db.collection("versions");

// 📤 GET all versions
export const getAllVersions = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const snapshot = await versionRef
      .orderBy("releaseDate", "desc")
      .get();

    if (snapshot.empty) {
      return handleSuccess(res, []);
    }

    const versions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return handleSuccess(res, versions);
  } catch (err) {
    return handleError(res, err, "Error fetching all versions");
  }
};

// 📤 GET latest version
export const getLatestVersion = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const snapshot = await versionRef
      .orderBy("releaseDate", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return handleNotFound(res, "Version");
    }

    const doc = snapshot.docs[0];
    const version = { id: doc.id, ...doc.data() };

    return handleSuccess(res, version);
  } catch (err) {
    return handleError(res, err, "Error fetching latest version");
  }
};

// 🆕 POST create version
export const createVersion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const data = req.body;
    const newDoc = await versionRef.add(data);
    return handleSuccess(res, { id: newDoc.id }, "Version created successfully", 201);
  } catch (err) {
    return handleError(res, err, "Error creating version");
  }
};

// ✏️ PUT update version
export const updateVersion = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    await versionRef.doc(id).update(req.body);
    return handleSuccess(res, undefined, "Version updated successfully");
  } catch (err) {
    return handleError(res, err, "Error updating version");
  }
};

// 🗑 DELETE version
export const deleteVersion = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    await versionRef.doc(id).delete();
    return handleSuccess(res, undefined, "Version deleted successfully");
  } catch (err) {
    return handleError(res, err, "Error deleting version");
  }
};
