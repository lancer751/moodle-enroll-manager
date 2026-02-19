import express, { type Request, type Response } from "express";
import { prisma } from "./config/connection";
import dotevn from "dotenv"
import userRoutes from "./routes/user.route"
import courseRoutes from "./routes/course.route"
import cors from "cors"
import path from "node:path";

dotevn.config()
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json())
app.use(express.json());
app.use(cors())

// Server the static files from the frontend app
app.use(express.static(path.join(__dirname, "../frontend/dist")))

// // Handle requests by serving the frontend app
// app.get("*", (req: Request, res: Response) => {
//     res.sendFile(path.join(__dirname, "../frontend/dist/", "index.html"))
// })

app.use("/api/users", userRoutes)
app.use("/api/courses", courseRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    prisma.$connect().then(() => {
        console.log("Connected to the database")
    }).catch((error) => {
        console.error("Error connecting to the database:", error)
    })
})