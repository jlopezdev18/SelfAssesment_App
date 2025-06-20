import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import admin from './firebase';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.get('/api/test-firebase', async (req, res) => {
  try {
    const users = await admin.auth().listUsers(1); // Get one user
    res.send({ message: 'Firebase is working!', users: users.users });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(500).send({ error: errorMessage });
  }
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
