import type { Request, Response } from "express";
import { fetchUsersFromModdle } from "../helpers/user.helper";



export async function enrollingStudent(req: Request, res: Response){
    try{
        const response = await fetchUsersFromModdle()

    }catch(error){
        console.error("enrollingStudent failed:", error)
        res.status(500).json({error: "Failed to enroll the student"})
    }
}