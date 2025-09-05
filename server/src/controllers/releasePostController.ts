import { Request, Response } from "express";
import admin from "../firebase";
import { sendReleaseEmailToAllUsers } from "../utils/email";

export const getReleasePosts = async (
  _req: Request,
  res: Response
): Promise<any> => {
  try {
    const snapshot = await admin
      .firestore()
      .collection("releasePosts")
      .orderBy("date", "desc")
      .get();
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching release posts:", error);
    res.status(500).json({ error: "Failed to fetch release posts." });
  }
};

export const addReleasePost = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { title, fullContent, version, tags, image } = req.body;
    if (!title || !fullContent) {
      return res
        .status(400)
        .json({ error: "Title, fullContent, and version are required." });
    }
    // Add the release post to the database
    const postRef = await admin.firestore().collection("releasePosts").add({
      title,
      fullContent,
      version,
      tags,
      image,
      date: admin.firestore.Timestamp.now(), // Use current timestamp as release date
      createdAt: admin.firestore.Timestamp.now(),
    });

    // Fetch all users
    const authUsers = await admin.auth().listUsers();
    const userEmails = authUsers.users
      .filter((user) => user.email)
      .map((user) => user.email);

    // Send the post to all users (e.g., via  email)
    userEmails.forEach((email) => {
      sendReleaseEmailToAllUsers(email, title, fullContent, version, tags);
    });

    res.status(201).json({
      id: postRef.id,
      message: "Release post added and sent to users.",
    });
  } catch (error) {
    console.error("Error adding release post:", error);
    res.status(500).json({ error: "Failed to add release post." });
  }
};

export const deleteReleasePost = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { postId } = req.params;
  if (!postId) {
    return res.status(400).json({ error: "Post ID is required." });
  }

  try {
    await admin.firestore().collection("releasePosts").doc(postId).delete();
    res.status(200).json({ message: "Release post deleted successfully." });
  } catch (error) {
    console.error("Error deleting release post:", error);
    res.status(500).json({ error: "Failed to delete release post." });
  }
};
