import axios from "axios";
import type { NewStudent } from "../types/user";
import { MOODLE_TOKEN, MOODLE_URL } from "../config/connection";



export function enrollStudentsInMoodle() {
}

export async function createNewStudentModle(data: NewStudent) {
    try {
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

        await axios.post(MOODLE_URL, params.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })

    } catch (error) {
        console.error("Error on createNewStudentModle", error)
    }

}