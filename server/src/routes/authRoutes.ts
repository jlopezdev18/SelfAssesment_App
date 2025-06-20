import express from 'express';
import { createUser, removeFirstTimeFlag } from '../controllers/authController';

const router = express.Router();

router.post('/create-user', createUser);
router.post('/remove-first-time-flag', removeFirstTimeFlag);

export default router;
