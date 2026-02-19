import { MOODLE_TOKEN, MOODLE_URL } from "../config/connection";
import axios from "axios";
import type { MoodleCourse, RawCourseMoodle } from "../types/course";

export async function fetchCoursesFromMoodle(): Promise<RawCourseMoodle[]> {
    try {
        const response = await axios.get<MoodleCourse[]>(MOODLE_URL, {
            params: {
                wstoken: MOODLE_TOKEN,
                wsfunction: "core_course_get_courses",
                moodlewsrestformat: "json"
            },
            timeout: 30_000
        });
        if (response.status !== 200) {
            throw new Error(`Failed to fetch courses from Moodle. Status code: ${response.status}`)
        }

        return response.data.map(course => ({
            id: course.id,
            categoryid: course.categoryid,
            description: course.summary,
            name: course.fullname,
            startdate: new Date(course.startdate),
            enddate: new Date(course.enddate),
            timecreated: new Date(course.timecreated),
            numsections: course.numsections
        }));
    } catch (error) {
        console.error("Error fetching courses from Moodle:", error);
        return [];
    }
}