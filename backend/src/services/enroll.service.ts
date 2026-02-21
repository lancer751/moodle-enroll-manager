import axios, { AxiosError } from "axios";
import type { MoodleUser, NewStudent } from "../types/user";
import { MOODLE_TOKEN, MOODLE_URL } from "../config/connection";
import { getMoodleStudentByEmail } from "./student.service";

type CreateStudentResult = | {
    success: true, data: Pick<MoodleUser, "id" | "username">
} | { success: false, error: string }

type MoodleErrorResponse = {
    exception?: string;
    errorcode?: string;
    message?: string;
};

type EnrollmentData = {
    userid: number;
    courseid: number;
    roleid: number;
};

type EnrollmentResult = | {
    success: true;
} | { success: false; error: string };

export async function enrollStudentsInMoodle(enrollment: EnrollmentData): Promise<EnrollmentResult> {
    try {
        // Data validation
        if (!enrollment.userid || !enrollment.courseid || !enrollment.roleid) {
            return { success: false, error: "Missing required enrollment fields (userid, courseid, roleid)" };
        }

        // Build Moodle request params
        const params = new URLSearchParams();
        // General params
        params.append("wstoken", MOODLE_TOKEN);
        params.append("wsfunction", "enrol_manual_enrol_users");
        params.append("moodlewsrestformat", "json");
        // Enrollment params
        params.append("enrolments[0][userid]", enrollment.userid.toString());
        params.append("enrolments[0][courseid]", enrollment.courseid.toString());
        params.append("enrolments[0][roleid]", enrollment.roleid.toString());

        await axios.post(MOODLE_URL, params.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            timeout: 10000
        });

        return { success: true };
    } catch (error) {
        console.error("Error in enrollStudentsInMoodle service", error);

        // Axios error handling
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<MoodleErrorResponse>;

            if (axiosError.response?.data?.message) {
                return {
                    success: false,
                    error: axiosError.response.data.message,
                };
            }

            if (axiosError.request) {
                return {
                    success: false,
                    error: "No response received from Moodle server.",
                };
            }
        }
        return {
            success: false,
            error: "Unexpected error while enrolling student.",
        };
    }
}

export async function createNewStudentModdle(data: Omit<NewStudent, "id">): Promise<CreateStudentResult> {
    try {
        // Data validation
        if (!data.email || !data.firstname || !data.lastname || !data.password || !data.username) {
            return { success: false, error: "Missing required student fields" }
        }

        // Checking if student already exits
        const existingStudent = await getMoodleStudentByEmail(data.email)
        console.log(existingStudent)
        if (existingStudent && existingStudent?.users.length > 0) {
            return { success: false, error: `The student ${data.username} already exists` }
        }

        // Build Moodle request params
        const params = new URLSearchParams()
        // General params
        params.append("wstoken", MOODLE_TOKEN)
        params.append("wsfunction", "core_user_create_users")
        params.append("moodlewsrestformat", "json")
        // User essential keys
        params.append("users[0][username]", data.username);
        params.append("users[0][firstname]", data.firstname);
        params.append("users[0][lastname]", data.lastname);
        params.append("users[0][email]", data.email);
        params.append("users[0][password]", data.password);

        const response = await axios.post<Pick<MoodleUser, "id" | "username">>(MOODLE_URL, params.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            timeout: 10000
        })


        return { success: true, data: response.data }
    } catch (error) {
        console.error("Error in createNewStudentModle", error)

        // Axios error handling
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<MoodleErrorResponse>

            if (axiosError.response?.data?.message) {
                return {
                    success: false,
                    error: axiosError.response.data.message,
                };
            }

            if (axiosError.request) {
                return {
                    success: false,
                    error: "No response received from Moodle server.",
                };
            }
        }
        return {
            success: false,
            error: "Unexpected error while creating student.",
        };
    }

}