import type { Request, Response } from "express";
import { fetchCoursesFromMoodle } from "../helpers/course.helper";
import type { Course } from "../../generated/prisma/browser";


interface CourseResults {
    data: Course[],
    page: number,
    limit: number,
    total: number,
    hasMore: boolean
}

export async function getCourses(req: Request, res: Response): Promise<Response<CourseResults> | Response<{ error: string }>> {
    const page = Math.max(1, Number(req.query.page ?? 1));
    const limit = Math.min(200, Number(req.query.limit ?? 20)); // prevent abusive large limits
    const skip = (page - 1) * limit;
    const offset = skip + limit;

    try {
        const moodleCourses = await fetchCoursesFromMoodle()
        const courses = moodleCourses.slice(skip, offset)
        const totalCourses = moodleCourses.length

        return res.status(200).json({
            data: courses,
            page,
            limit,
            total: totalCourses,
            hasMore: (skip + courses.length) < totalCourses
        })
    } catch (error) {
        console.error("getCourses failed:", error);
        return res.status(500).json({ error: "Failed to get courses" });
    }
}

// export async function syncMoodleCourses(req: Request, res: Response) {
//     try {
//         const moodleCourses = await fetchCoursesFromMoodle()
//         const moodleIds = moodleCourses.map(course => course.id)

//         //Fetching existing courses from our database that either have a moodleCourseId
//         const existingCourses = await prisma.course.findMany({
//             where: {
//                 OR: [
//                     { moodleCourseId: { in: moodleIds } }
//                 ]
//             },
//             select: {
//                 id: true,
//                 description: true,
//                 name: true,
//                 moodleCourseId: true,
//                 createdAt: true
//             }
//         })

//         // Building fast lookup maps
//         const byMoodleId = new Map<number, typeof existingCourses[number]>();

//         for (const c of existingCourses) {
//             if (c.moodleCourseId !== null) byMoodleId.set(c.moodleCourseId, c)
//         }

//         // Prepare lists
//         type CreatePayload = {
//             moodleCourseId: number,
//             name: string,
//             description: string,
//         };
//         type UpdatePayload = {
//             courseId: number,
//             moodleCourseId: number,
//             name: string,
//             description: string,
//             startDate: number
//         };

//         const toCreate: CreatePayload[] = [];
//         const toUpdate: UpdatePayload[] = [];

//         for (const c of moodleCourses) {
//             const existing = byMoodleId.get(c.id)

//             if (!existing) {
//                 // NEW
//                 toCreate.push({
//                     moodleCourseId: c.id,
//                     description: c.description,
//                     name: c.name
//                 })
//             } else {
//                 toUpdate.push({
//                     courseId: existing.id, description: c.description, moodleCourseId: c.id, name: c.name, startDate: c.startdate
//                 })

//             }
//         }

//         // Bulk create new students (fast). createMany ignores relational fields and runs no hooks.
//         if (toCreate.length > 0) {
//             // createMany will ignore duplicates on unique constraints when skipDuplicates:true
//             await prisma.course.createMany({
//                 data: toCreate,
//                 skipDuplicates: true
//             });
//         }

//         // Batch-update existing students by their primary key id (safer & works for repaired rows)
//         const BATCH = 50;
//         for (let i = 0; i < toUpdate.length; i += BATCH) {
//             const batch = toUpdate.slice(i, i + BATCH);
//             await Promise.all(batch.map(c =>
//                 prisma.course.update({
//                     where: { id: c.courseId },              // use PK id (always present)
//                     data: {
//                         moodleCourseId: c.courseId,                  // IMPORTANT: repair stored moodleId
//                         name: c.name,
//                         description: c.description,
//                         createdAt: new Date(c.startDate)
//                     }
//                 })
//             ));
//         }

//         return res.json({
//             message: "Sync completed",
//             created: toCreate.length,
//             updated: toUpdate.length
//         });

//     } catch (error) {
//         console.error("syncMoodleCourses failed:", error);
//         return res.status(500).json({ error: "Failed to sync courses from Moodle" });
//     }
// }