import { MOODLE_TOKEN, MOODLE_URL } from "../config/connection";
import axios from "axios";
import type { MoodleUser } from "../types/user.moodle";
import type { RawUserMoodle } from "../types/user";

export async function fetchUsersFromModdle(): Promise<RawUserMoodle[]> {
    try {
        const response = await axios.get<{
            users: MoodleUser[], warnings: [{
                "item": string,
                "warningcode": string,
                "message": string
            }]
        }>(MOODLE_URL, {
            params: {
                wstoken: MOODLE_TOKEN,
                wsfunction: "core_user_get_users",
                moodlewsrestformat: "json",
                "criteria[0][key]": "",
                "criteria[0][value]": "%"
            },
            timeout: 30_000
        })


        if (response.status !== 200) {
            throw new Error(`Failed to fetch users from Moodle. Status code: ${response.status}`)
        }

        return response.data.users.map(user => ({
            id: user.id,
            username: user.username,
            firstName: user.firstname,
            lastName: user.lastname,
            fullName: user.fullname,
            email: user.email,
            city: user.city,
            confirmed: user.confirmed,
            suspended: user.suspended,
            first_access: user.firstaccess
        }))
    } catch (error) {
        console.error("Error fetching users from Moodle:", error)
        return [];
    }
}