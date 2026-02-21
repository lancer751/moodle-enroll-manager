import type { Request, Response } from "express";
import { createNewStudentModdle, enrollStudentsInMoodle } from "../services/enroll.service";
import type { EnrollmentRequest, CreateAndEnrollRequest } from "../types/user";

// Default role ID for student enrollment in Moodle
const DEFAULT_STUDENT_ROLE_ID = 5;

// Create a new student account and enroll them in a course
export async function createAndEnrollStudent(req: Request, res: Response) {
    try {
        const enrollmentData: CreateAndEnrollRequest = req.body;
        // Validate required student fields
        if (!enrollmentData.username || !enrollmentData.email || !enrollmentData.firstname || !enrollmentData.lastname || !enrollmentData.password) {
            return res.status(400).json({
                error: "Missing required student fields: username, email, firstname, lastname, and password are required"
            });
        }

        // Validate required enrollment fields
        if (!enrollmentData.courseid) {
            return res.status(400).json({
                error: "Missing required enrollment field: courseid is required"
            });
        }

        // Step 1: Create the student account in Moodle
        const studentCreationResult = await createNewStudentModdle({
            username: enrollmentData.username,
            email: enrollmentData.email,
            firstname: enrollmentData.firstname,
            lastname: enrollmentData.lastname,
            password: enrollmentData.password
        });

        if (!studentCreationResult.success) {
            return res.status(400).json({
                error: `Failed to create student: ${studentCreationResult.error}`
            });
        }

        // Step 2: Enroll the newly created student in the course
        const roleid = enrollmentData.roleid || DEFAULT_STUDENT_ROLE_ID;

        console.log(studentCreationResult)
        const enrollmentResult = await enrollStudentsInMoodle({
            userid: studentCreationResult.data.id,
            courseid: enrollmentData.courseid,
            roleid
        });

        if (!enrollmentResult.success) {
            return res.status(400).json({
                error: `Student created but enrollment failed: ${enrollmentResult.error}`
            });
        }

        return res.status(200).json({
            message: "Student created and enrolled successfully",
            data: {
                userid: studentCreationResult.data.id,
                username: studentCreationResult.data.username,
                courseid: enrollmentData.courseid,
                roleid
            }
        });
    } catch (error) {
        console.error("createAndEnrollStudent failed:", error);
        res.status(500).json({ error: "Failed to create and enroll the student" });
    }
}

// Enroll an existing student in a course
export async function enrollStudentInCourse(req: Request, res: Response) {
    try {
        const enrollmentData: EnrollmentRequest = req.body;

        // Validate required fields
        if (!enrollmentData.userid || !enrollmentData.courseid) {
            return res.status(400).json({
                error: "Missing required fields: userid and courseid are required"
            });
        }

        // Use default role ID if not provided
        const roleid = enrollmentData.roleid || DEFAULT_STUDENT_ROLE_ID;

        // Call enrollment service
        const result = await enrollStudentsInMoodle({
            userid: enrollmentData.userid,
            courseid: enrollmentData.courseid,
            roleid
        });

        if (!result.success) {
            return res.status(400).json({
                error: result.error
            });
        }

        return res.status(200).json({
            message: "Student enrolled successfully",
            data: {
                userid: enrollmentData.userid,
                courseid: enrollmentData.courseid,
                roleid
            }
        });
    } catch (error) {
        console.error("enrollStudentInCourse failed:", error);
        res.status(500).json({ error: "Failed to enroll the student" });
    }
}