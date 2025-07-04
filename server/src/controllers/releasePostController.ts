import { Request, Response } from "express";
import admin from "../firebase";
import { sendReleaseEmailToAllUsers } from "../utils/email";

export const addReleasePost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, description, fullContent, version, tags } = req.body;

    // Add the release post to the database
    const postRef = await admin.firestore().collection("releasePosts").add({
      title,
      description,
      fullContent,
      version,
      tags,
      date: admin.firestore.Timestamp.now(), // Use current timestamp as release date
      createdAt: admin.firestore.Timestamp.now(),
    });

    // Fetch all users
    const usersSnapshot = await admin.firestore().collection("users").get();
    const userEmails = usersSnapshot.docs.map((doc) => doc.data().email);

    // Send the post to all users (e.g., via  email)
    userEmails.forEach((email) => {
      sendReleaseEmailToAllUsers(email, title, description, fullContent, version, tags);
    });

    res.status(201).json({ id: postRef.id, message: "Release post added and sent to users." });
  } catch (error) {
    console.error("Error adding release post:", error);
    res.status(500).json({ error: "Failed to add release post." });
  }
};