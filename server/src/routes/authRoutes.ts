import express from 'express';
import { createUser, removeFirstTimeFlag, setUserRole } from '../controllers/authController';

const router = express.Router();

router.post('/create-user', createUser);
router.post('/remove-first-time-flag', removeFirstTimeFlag);
router.post("/set-user-role", setUserRole);

export default router;
