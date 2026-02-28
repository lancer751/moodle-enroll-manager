import express from "express";
import { prisma } from "./config/connection";
import dotevn from "dotenv"
import cors from "cors"

// Existing routes
import userRoutes from "./routes/user.route"
import courseRoutes from "./routes/course.route"
import enrollmentRoutes from "./routes/enrollment.route"
import customerRoutes from "./routes/customer.route"

// New routes
import webhookRoutes from "./routes/webhook.route"
import paymentRoutes from "./routes/payment.route"
import dashboardRoutes from "./routes/dashboard.route"
import reportRoutes from "./routes/report.route"
import devRoutes from "./routes/dev.route"

dotevn.config()
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// Existing routes
app.use("/api/users", userRoutes)
app.use("/api/customers", customerRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/enrollment", enrollmentRoutes)

// Payment webhook (no admin auth — validated by signature)
app.use("/api/webhooks", webhookRoutes)

// Admin payment registration
app.use("/api/payments", paymentRoutes)

// Dashboard & reports
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/reports", reportRoutes)

// Dev/simulation endpoints (disable in production if needed)
app.use("/api/dev", devRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`Routes available:
  POST   /api/webhooks/payment          — Online payment webhook
  POST   /api/payments/manual           — Manual payment (admin)
  POST   /api/courses                   — Create course (admin)
  GET    /api/dashboard/payments        — Payments dashboard
  GET    /api/reports/sales             — Sales/enrollment reports
  POST   /api/dev/simulate-payment      — Simulate a payment (dev)
  GET    /api/dev/emails                — View simulated emails (dev)
  DELETE /api/dev/emails                — Clear simulated emails (dev)`)
    prisma.$connect().then(() => {
        console.log("Connected to the database")
    }).catch((error) => {
        console.error("Error connecting to the database:", error)
    })
})