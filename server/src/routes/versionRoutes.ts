import express from "express";
import {
  createVersion,
  updateVersion,
  deleteVersion,
  getLatestVersion,
  getAllVersions,
} from "../controllers/versionController";

const router = express.Router();

router.get("/", getAllVersions);
router.get("/latest", getLatestVersion);
router.post("/", createVersion);
router.put("/:id", updateVersion);
router.delete("/:id", deleteVersion);

export default router;
