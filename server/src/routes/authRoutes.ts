import express from 'express';
import { createUser, me, removeFirstTimeFlag, setUserRole, getAllUsers } from '../controllers/authController';

const router = express.Router();

router.post('/create-user', createUser);
router.post('/remove-first-time-flag', removeFirstTimeFlag);
router.post("/set-user-role", setUserRole);
router.get("/me", me); 
router.get("/users", getAllUsers);

export default router;
