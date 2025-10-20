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
    const timestamp = admin.firestore.Timestamp.now();
    const postData = {
      title,
      fullContent,
      version,
      tags,
      image,
      date: timestamp, // Use current timestamp as release date
      createdAt: timestamp,
    };

    const postRef = await admin.firestore().collection("releasePosts").add(postData);

    // Fetch all users
    const authUsers = await admin.auth().listUsers();
    const userEmails = authUsers.users
      .filter((user) => user.email)
      .map((user) => user.email);

    // Send the post to all users (e.g., via email) - don't wait for emails
    userEmails.forEach((email) => {
      sendReleaseEmailToAllUsers(email, title, fullContent, version, tags).catch(err => {
        console.error(`Failed to send email to ${email}:`, err);
      });
    });

    // Return the complete post data including the generated ID
    res.status(201).json({
      id: postRef.id,
      ...postData,
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
