import express from "express";
import { createAndEnrollStudent } from "../controllers/enroll.controller";
const router = express.Router();

router.post("/", createAndEnrollStudent)

export default router;