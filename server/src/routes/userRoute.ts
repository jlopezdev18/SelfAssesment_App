import { getUsersWithRoleUser } from "../controllers/userController";
import express from "express";

const router = express.Router();

router.get("/users-with-role-user", getUsersWithRoleUser);

export default router;