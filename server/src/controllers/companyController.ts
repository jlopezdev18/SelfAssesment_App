import { Request, Response } from "express";
import admin from "../firebase";
import { generateRandomPassword } from "../utils/generatePassword";
import { sendEmailToMainUser } from "../utils/email";

export const getCompanies = async (req: Request, res: Response) => {
  try {
    const snapshot = await admin.firestore().collection("companies").get();
    const companies = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
};

export const createCompany = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, firstName, lastName, companyName, companyEmail } = req.body;

  if (!email || !firstName || !lastName || !companyName || !companyEmail) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const displayName = `${firstName} ${lastName}`;
  const password = generateRandomPassword();

  let user;
  try {
    // 1. Crear usuario en Firebase Auth
    user = await admin.auth().createUser({ email, password, displayName });

    // 2. Enviar email al usuario con su contraseña
    try {
      await sendEmailToMainUser(email, password);
    } catch (emailError) {
      // Si el email falla, elimina el usuario creado en Auth
      await admin.auth().deleteUser(user.uid);
      return res.status(500).json({
        error: "No se pudo enviar el correo al usuario. Intenta de nuevo.",
      });
    }

    // 3. Agregar custom claims
    await admin.auth().setCustomUserClaims(user.uid, {
      firstTimeLogin: true,
      passwordCreatedAt: Date.now(),
    });

    // 4. Guardar usuario en colección "users"
    await admin.firestore().collection("users").doc(user.uid).set({
      email,
      displayName,
      firstName,
      lastName,
      role: "user",
      status: "pending",
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      nextPaymentDate: null,
    });

    // 5. Crear compañía en colección "companies"
    const newCompany = {
      companyName,
      companyEmail,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      owner: {
        firstName,
        lastName,
        email,
        uid: user.uid,
        active: true,
      },
    };

    const companyRef = await admin
      .firestore()
      .collection("companies")
      .add(newCompany);

    await admin.firestore().collection("users").doc(user.uid).update({
      companyId: companyRef.id,
    });

    return res.status(200).json({
      message: "User and company created successfully. Email sent.",
      userId: user.uid,
      companyId: companyRef.id,
      password,
    });
  } catch (err: any) {
    console.error("Error creating company and user:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const addUserToCompany = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { companyId, email, firstName, lastName } = req.body;

  if (!companyId || !email || !firstName || !lastName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // 1. Create user in Firebase Auth
    let userRecord;

    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch {
      // If user does not exist, create one
      const password = generateRandomPassword();
      userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`,
      });
      // Optionally send email with password here
      await sendEmailToMainUser(email, password);
    }

    // 2. Add custom claims for firstTimeLogin
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      firstTimeLogin: true,
      passwordCreatedAt: Date.now(),
    });

    // 3. Add user to Firestore "users" collection if not exists
    const userDoc = await admin
      .firestore()
      .collection("users")
      .doc(userRecord.uid)
      .get();
    if (!userDoc.exists) {
      await admin
        .firestore()
        .collection("users")
        .doc(userRecord.uid)
        .set({
          email,
          displayName: `${firstName} ${lastName}`,
          firstName,
          lastName,
          role: "user",
          active: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          companyId,
        });
    } else {
      await admin.firestore().collection("users").doc(userRecord.uid).update({
        companyId,
      });
    }

    // 4. Add user UID to company's users array
    await admin
      .firestore()
      .collection("companies")
      .doc(companyId)
      .update({
        users: admin.firestore.FieldValue.arrayUnion(userRecord.uid),
      });

    return res.status(200).json({
      message: "User added to company successfully.",
      userId: userRecord.uid,
      companyId,
    });
  } catch (err: any) {
    console.error("Error adding user to company:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const updateUserInCompany = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId } = req.params;
  const { firstName, lastName, email, active } = req.body;
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // 1. Update user in Firebase Auth
    await admin.auth().updateUser(userId, {
      email,
      displayName: `${firstName} ${lastName}`,
    });

    // 2. Update user in Firestore "users" collection
    await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .update({
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        email,
        active,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return res.status(200).json({
      message: "User updated successfully",
      userId,
      updates: { firstName, lastName, email, active },
    });
  } catch (err: any) {
    console.error("Error updating user:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const deleteUserFromCompany = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId, companyId } = req.params;

  if (!userId || !companyId) {
    return res
      .status(400)
      .json({ error: "User ID and Company ID are required" });
  }

  try {
    // 1. Check if user exists and is not already deleted
    const userDoc = await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    if (userDoc.data()?.deleted) {
      return res.status(400).json({ error: "User is already deleted" });
    }

    // 2. Remove user from company's users array
    await admin
      .firestore()
      .collection("companies")
      .doc(companyId)
      .update({
        users: admin.firestore.FieldValue.arrayRemove(userId),
      });

    // 3. Mark user as deleted in Firestore "users" collection
    await admin.firestore().collection("users").doc(userId).update({
      deleted: true,
      deletedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "inactive",
      lastModified: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 4. Disable user in Firebase Auth instead of deleting
    await admin.auth().updateUser(userId, {
      disabled: true,
    });

    return res.status(200).json({
      message: "User deleted successfully",
      userId,
      companyId,
    });
  } catch (err: any) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const updateCompany = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { companyId } = req.params;
  const { companyName, companyEmail, firstName, lastName, email, active } =
    req.body;

  if (
    !companyId ||
    !companyName ||
    !companyEmail ||
    !firstName ||
    !lastName ||
    !email
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // 1. Get company reference and check if exists
    const companyRef = admin.firestore().collection("companies").doc(companyId);
    const company = await companyRef.get();

    if (!company.exists) {
      return res.status(404).json({ error: "Company not found" });
    }

    // 2. Update company information
    await companyRef.update({
      companyName,
      companyEmail,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      owner: {
        firstName,
        lastName,
        email,
        active,
        uid: company.data()?.owner?.uid, // Maintain the original owner's UID
      },
    });

    // 3. Update owner's information in users collection
    if (company.data()?.owner?.uid) {
      await admin
        .firestore()
        .collection("users")
        .doc(company.data()?.owner?.uid)
        .update({
          firstName,
          lastName,
          email,
          displayName: `${firstName} ${lastName}`,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      // 4. Update owner's email in Firebase Auth if changed
      if (email !== company.data()?.owner?.email) {
        await admin.auth().updateUser(company.data()?.owner?.uid, {
          email,
          displayName: `${firstName} ${lastName}`,
        });
      }
    }
    return res.status(200).json({
      message: "Company updated successfully",
      companyId,
      updates: {
        companyName,
        companyEmail,
        owner: { firstName, lastName, email },
      },
    });
  } catch (err: any) {
    console.error("Error updating company:", err);
    if (err.code === "auth/email-already-exists") {
      return res.status(400).json({
        error: "The email address is already in use by another account.",
      });
    }
    return res.status(500).json({ error: err.message });
  }
};

export const deleteCompany = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { companyId } = req.params;

  if (!companyId || companyId.trim() === "") {
    return res.status(400).json({ error: "Company ID is required" });
  }

  try {
    // 1. Logic delete company: set 'deleted' field to true
    await admin.firestore().collection("companies").doc(companyId).update({
      deleted: true,
      deletedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 2. Logic delete users: set 'deleted' field to true for users in this company
    const usersSnapshot = await admin
      .firestore()
      .collection("users")
      .where("companyId", "==", companyId)
      .get();
    const batch = admin.firestore().batch();
    usersSnapshot.forEach((doc) => {
      batch.update(doc.ref, {
        deleted: true,
        deletedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();

    const companyDoc = await admin
      .firestore()
      .collection("companies")
      .doc(companyId)
      .get();
    const ownerUid = companyDoc.data()?.owner?.uid;
    if (ownerUid) {
      await admin.auth().updateUser(ownerUid, {
        disabled: true,
      });
    }
    return res
      .status(200)
      .json({ message: "Company and related users deleted." });
  } catch (err: any) {
    console.error("Error deleting company:", err);
    return res.status(500).json({ error: err.message });
  }
};

// export const sendNotificationToCompany = async (req: Request, res: Response): Promise<any> => {
//   const { companyId, title, body } = req.body;

//   if (!companyId || !title || !body) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     const companyDoc = await admin.firestore().collection("companies").doc(companyId).get();
//     if (!companyDoc.exists) {
//       return res.status(404).json({ error: "Company not found" });
//     }

//     const companyData = companyDoc.data();
//     if (!companyData || !companyData.users || companyData.users.length === 0) {
//       return res.status(404).json({ error: "No users found in this company" });
//     }

//     const tokens = await Promise.all(
//       companyData.users.map(async (userId: string) => {
//         const userDoc = await admin.firestore().collection("users").doc(userId).get();
//         return userDoc.exists ? userDoc.data()?.fcmToken : null;
//       })
//     );

//     const validTokens = tokens.filter((token) => token !== null);

//     if (validTokens.length === 0) {
//       return res.status(404).json({ error: "No valid FCM tokens found for users" });
//     }

//     const message = {
//       notification: {
//         title,
//         body,
//       },
//       tokens: validTokens,
//     };

//     const response = await admin.messaging().sendMulticast(message);

//     return res.status(200).json({
//       message: "Notification sent successfully",
//       successCount: response.successCount,
//       failureCount: response.failureCount,
//     });
//   } catch (err: any) {
//     console.error("Error sending notification:", err);
//     return res.status(500).json({ error: err.message });
//   }
// }
