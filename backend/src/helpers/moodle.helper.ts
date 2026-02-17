import axios from "axios";
import { MOODLE_TOKEN, MOODLE_URL } from "../config/connection";
import qs from "qs"

export async function moodleCall(wsfunction: string, params: Record<string, string | number> = {}) {
    // Moodle REST API pattern
    const baseParams = {
        wstoken: MOODLE_TOKEN || "86333f75a1e7b7fe80bb30e1633424e7",
        wsfunction,
        moodlewsrestformart: "json"
    }

    const allparams = { ...baseParams, ...params }
    const body = qs.stringify(allparams)
    const resp = await axios.post(MOODLE_URL, body, { timeout: 15000 });
    return resp.data;
}