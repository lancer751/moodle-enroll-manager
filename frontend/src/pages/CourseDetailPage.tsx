import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from "@/components/StatusBadge";
import {
  Search,
  ArrowLeft,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface Course {
  id: string | number;
  name: string;
  description?: string;
  numsections?: number;
}

interface Student {
  id: string | number;
  firstName: string;
  lastName: string;
  username: string;
  dni?: string | null;
  phone?: string | null;
  courseId?: string | number;
  status?: "Matriculado" | "En espera";
}

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [coursesRes, studentsRes] = await Promise.all([
          fetch("http://localhost:5000/api/courses"),
          fetch("http://localhost:5000/api/users"),
        ]);
        const coursesData = await coursesRes.json();
        const studentsData = await studentsRes.json();

        const allCourses: Course[] = coursesData.data ?? [];
        const allStudents: Student[] = studentsData.data ?? [];

        const found = allCourses.find((c) => String(c.id) === String(courseId));
        setCourse(found ?? null);

        const enrolled = allStudents.filter(
          (s) => String(s.courseId) === String(courseId)
        );
        setStudents(enrolled);
      } catch (error) {
        console.error("Error fetching course detail:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [courseId]);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      s.username.toLowerCase().includes(q) ||
      (s.dni ?? "").toLowerCase().includes(q)
    );
  });

  const enrolledCount = students.filter((s) => s.status === "Matriculado").length;
  const waitingCount = students.filter((s) => s.status === "En espera").length;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        to="/courses"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Cursos
      </Link>

      {/* Header */}
      {loading ? (
        <div className="space-y-2">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        </div>
      ) : course ? (
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              {course.name}
            </h1>
            {course.description && (
              <p className="mt-1 text-muted-foreground">{course.description}</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">Curso no encontrado.</p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{students.length}</p>
              <p className="text-sm text-muted-foreground">Total matriculados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{enrolledCount}</p>
              <p className="text-sm text-muted-foreground">Matriculados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{waitingCount}</p>
              <p className="text-sm text-muted-foreground">En espera</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <Users className="h-5 w-5 text-primary" />
            Estudiantes del Curso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, usuario o DNI..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Nombre y Apellidos</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <TableCell key={j}>
                          <div className="h-4 animate-pulse rounded bg-muted" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-muted-foreground"
                    >
                      {students.length === 0
                        ? "No hay estudiantes matriculados en este curso."
                        : "No se encontraron estudiantes con ese criterio."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium capitalize">
                        {s.firstName.toLowerCase()} {s.lastName.toLowerCase()}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {s.username}
                      </TableCell>
                      <TableCell>{s.dni ?? "No registrado"}</TableCell>
                      <TableCell>{s.phone ?? "No registrado"}</TableCell>
                      <TableCell>
                        {s.status ? (
                          <StatusBadge status={s.status} />
                        ) : (
                          <Badge variant="outline">—</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetailPage;
