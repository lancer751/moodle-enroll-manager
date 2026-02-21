import express from "express";
import { prisma } from "./config/connection";
import dotevn from "dotenv"
import userRoutes from "./routes/user.route"
import courseRoutes from "./routes/course.route"
import enrollmentRoutes from "./routes/enrollment.route"
import cors from "cors"

dotevn.config()
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use("/api/users", userRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/enrollment", enrollmentRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    prisma.$connect().then(() => {
        console.log("Connected to the database")
    }).catch((error) => {
        console.error("Error connecting to the database:", error)
    })
})