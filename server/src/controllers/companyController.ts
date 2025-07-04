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

  try {
    // 1. Crear usuario en Firebase Auth
    const user = await admin
      .auth()
      .createUser({ email, password, displayName });

    // 2. Agregar custom claims
    await admin.auth().setCustomUserClaims(user.uid, {
      firstTimeLogin: true,
      passwordCreatedAt: Date.now(),
    });

    // 3. Guardar usuario en colección "users"
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

    // 4. Crear compañía en colección "companies"
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
      users: [user.uid], // usuario dueño como primer miembro
    };

    const companyRef = await admin
      .firestore()
      .collection("companies")
      .add(newCompany);
    await admin.firestore().collection("users").doc(user.uid).update({
      companyId: companyRef.id,
    });
    // 5. Enviar email al usuario con su contraseña
    await sendEmailToMainUser(email, password);

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
