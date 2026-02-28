import express from "express";
import { createCourse, getCourseById, getCourses } from "../controllers/course.controller";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = express.Router();

// GET /courses
router.get("/", getCourses);
router.get("/:id", getCourseById);
// POST /courses — admin only
router.post("/", adminMiddleware, createCourse);

export default router;