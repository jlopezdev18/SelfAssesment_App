import { Request, Response } from 'express';
import admin from '../firebase';
import { generateRandomPassword } from '../utils/generatePassword';
import { sendEmailToUser } from '../utils/email';

export const createUser = async (req: Request, res: Response): Promise<any> => {
  const { email, firstName, lastName } = req.body;

  if (!email || !firstName || !lastName) {
    return res.status(400).json({ error: 'Email, firstName, and lastName are required' });
  }
  const displayName = `${firstName} ${lastName}`;
  const password = generateRandomPassword();

  try {
    const user = await admin.auth().createUser({ email, password, displayName });

    // Add custom claims to track first login and timestamp
    await admin.auth().setCustomUserClaims(user.uid, {
      firstTimeLogin: true,
      passwordCreatedAt: Date.now(),
    });
    await admin.firestore().collection('users').doc(user.uid).set({
      email,
      displayName,
      firstName,
      lastName,
      role: 'user',
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      nextPaymentDate: null,
    });
    // Send the temporary password email
    await sendEmailToUser(email, password);
  
    return res.status(200).json({ message: 'User created and email sent.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const removeFirstTimeFlag = async (req: Request, res: Response): Promise<any> => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Remove custom claims by setting empty object
    await admin.auth().setCustomUserClaims(decoded.uid, {});

    return res.status(200).json({ message: 'First-time login flag removed' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
