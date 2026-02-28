// Simulated Moodle integration service.
// No real Moodle API calls are made; all responses are simulated.

export interface MoodleEnrollResult {
    success: boolean;
    moodleEnrollmentId?: string;
    error?: string;
}

export async function simulateMoodleEnrollment(
    clientEmail: string,
    moodleCourseId: string | null
): Promise<MoodleEnrollResult> {
    // Simulate a short async delay (as if calling a real API)
    await new Promise((res) => setTimeout(res, 50));

    const simulatedEnrollmentId = `moodle_enroll_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    console.log(
        `🎓 [MOODLE SIMULATED] Enrolled ${clientEmail} into Moodle course ID "${moodleCourseId ?? "N/A"}". Enrollment ID: ${simulatedEnrollmentId}`
    );

    return { success: true, moodleEnrollmentId: simulatedEnrollmentId };
}
