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
      return res.status(500).json({ error: "No se pudo enviar el correo al usuario. Intenta de nuevo." });
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

export const addUserToCompany = async (req: Request, res: Response): Promise<any> => {
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
    const userDoc = await admin.firestore().collection("users").doc(userRecord.uid).get();
    if (!userDoc.exists) {
      await admin.firestore().collection("users").doc(userRecord.uid).set({
        email,
        displayName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        role: "user",
        status: "active",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        companyId,
      });
    } else {
      await admin.firestore().collection("users").doc(userRecord.uid).update({
        companyId,
      });
    }

    // 4. Add user UID to company's users array
    await admin.firestore().collection("companies").doc(companyId).update({
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

export const deleteCompany = async (req: Request, res: Response): Promise<any> => {
  const { companyId } = req.params;
  console.log(companyId);

   if (!companyId || companyId.trim() === '')  {
    return res.status(400).json({ error: "Company ID is required" });
  }

  try {
    // 1. Logic delete company: set 'deleted' field to true
    await admin.firestore().collection("companies").doc(companyId).update({
      deleted: true,
      deletedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 2. Logic delete users: set 'deleted' field to true for users in this company
    const usersSnapshot = await admin.firestore().collection("users").where("companyId", "==", companyId).get();
    const batch = admin.firestore().batch();
    usersSnapshot.forEach((doc) => {
      batch.update(doc.ref, { 
        deleted: true,
        deletedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();

    return res.status(200).json({ message: "Company and related users deleted." });
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