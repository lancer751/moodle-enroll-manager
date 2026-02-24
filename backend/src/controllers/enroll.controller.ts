import type { Request, Response } from "express";
import { enrollStudentsInMoodle } from "../services/enroll.service";
import type { CreateAndEnrollRequest } from "../types/user";
import { createNewStudentModdle, getMoodleStudentByEmail } from "../services/student.service";

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

        const existingStudent = await getMoodleStudentByEmail(enrollmentData.email)

        // If student already exists, enroll them directly without trying to create a new account
        if(existingStudent.success && existingStudent.users[0]) {
            const existingUser = existingStudent.users[0];
            const roleid = enrollmentData.roleid || DEFAULT_STUDENT_ROLE_ID;
            const enrollmentResult = await enrollStudentsInMoodle({
                userid: existingUser.id,
                courseid: enrollmentData.courseid,
                roleid
            });
            if (!enrollmentResult.success) {
                return res.status(400).json({
                    error: `Student already exists but enrollment failed: ${enrollmentResult.error}`
                });
            }
            return res.status(200).json({
                message: "Student already existed and was enrolled successfully",
                data: {
                    userid: existingUser.id,
                    username: existingUser.username,
                    courseid: enrollmentData.courseid,
                    roleid
                }
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
