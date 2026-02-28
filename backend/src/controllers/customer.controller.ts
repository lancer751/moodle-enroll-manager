import type { Request, Response } from "express";
import { prisma } from "../config/connection";


export async function getAllCustomers(req: Request, res: Response) {
  try {
    const customers = await prisma.cliente.findMany({
      select: {
        id: true,
        apellido_materno: true,
        apellido_paterno: true,
        nombre: true,
        email: true,
        telefono: true,
        dni: true,
    }});
    return res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return res.status(500).json({ error: "Failed to fetch customers" });
  }
}
