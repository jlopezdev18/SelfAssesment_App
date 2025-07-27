import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import{ authRoutes, companyRoutes, userRoute, releasePostRoutes, versionRoutes } from './routes/index';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/users', userRoute);
app.use('/api/company', companyRoutes);
app.use('/api/release-posts', releasePostRoutes);
app.use('/api/versions', versionRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
