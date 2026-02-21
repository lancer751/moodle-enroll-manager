import axios from "axios"
import type { MoodleUser } from "../types/user"
import { MOODLE_TOKEN, MOODLE_URL } from "../config/connection"


export async function getMoodleStudentByEmail(email: string) {
    try {
        const response = await axios.get<{users: MoodleUser[], warnings: []}>(MOODLE_URL, {
            params: {
                wstoken: MOODLE_TOKEN,
                wsfunction: "core_user_get_users",
                moodlewsrestformat: "json",
                "criteria[0][key]": "email",
                "criteria[0][value]": `${email}`
            },
            timeout: 30_000
        })
        if(response.status !== 200){
            throw new Error()
        }
        return response.data
    } catch (error) {
        console.error("error on getMoodleStudentByEmail", error)
    }
}