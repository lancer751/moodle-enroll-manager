import express from "express";
import { getStudents, syncMoodleUsers } from "../controllers/user.controller";
const router = express.Router();

router.get("/", getStudents)
router.get("/sync-moodle-users", syncMoodleUsers)

export default router;