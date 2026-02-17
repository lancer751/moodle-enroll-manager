import express from "express";
import { prisma } from "./config/connection";
import dotevn from "dotenv"
import allRoutes from "./routes/all.route"
import cors from "cors"

dotevn.config()
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    prisma.$connect().then(() => {
        console.log("Connected to the database")
    }).catch((error) => {
        console.error("Error connecting to the database:", error)
    })
})

// middleware
app.use(express.json())
app.use("/api", allRoutes)