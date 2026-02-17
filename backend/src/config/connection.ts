import {PrismaMariaDb}  from "@prisma/adapter-mariadb"
import { PrismaClient } from "../../generated/prisma/client";
import dotevn from "dotenv"

dotevn.config()

export const MOODLE_URL = process.env.MOODLE_URL || "https://cebf20.com/aulas/webservice/rest/server.php";
export const MOODLE_TOKEN = process.env.MOODLE_TOKEN || "";
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;
export const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;
export const MOODLE_PASSWORD_CHANGE_PATH = process.env.MOODLE_PASSWORD_CHANGE_PATH || "/login/change_password.php";

if (!MOODLE_TOKEN) {
  console.warn("Warning: MOODLE_TOKEN is not set. Moodle calls will fail.");
}

export const adapter  = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

const prisma = new PrismaClient({adapter})
export {prisma}