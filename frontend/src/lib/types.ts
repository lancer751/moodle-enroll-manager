export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  username: string;
  course: string;
  status: "Matriculado" | "En espera";
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;
}

export const COURSES: Course[] = [
  { id: "1", name: "Matemáticas Básicas" },
  { id: "2", name: "Programación Web" },
  { id: "3", name: "Diseño Gráfico" },
  { id: "4", name: "Inglés Intermedio" },
  { id: "5", name: "Administración de Empresas" },
];
