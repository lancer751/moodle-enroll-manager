import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Users, ArrowRight, GraduationCap } from "lucide-react";

interface Course {
  id: string | number;
  name: string;
  description?: string;
  numsections?: number;
}

interface Student {
  id: string | number;
  courseId?: string | number;
  course?: string;
}

const CoursesPage = () => {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
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
        setCourses(coursesData.data ?? []);
        setStudents(studentsData.data ?? []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getStudentCount = (courseId: string | number) =>
    students.filter((s) => String(s.courseId) === String(courseId)).length;

  const filtered = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Cursos
        </h1>
        <p className="mt-1 text-muted-foreground">
          Visualiza todos los cursos disponibles y sus estudiantes matriculados.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{courses.length}</p>
              <p className="text-sm text-muted-foreground">Cursos totales</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-success/10">
              <Users className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{students.length}</p>
              <p className="text-sm text-muted-foreground">Estudiantes totales</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search + Course Grid */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <GraduationCap className="h-5 w-5 text-primary" />
            Listado de Cursos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar curso..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-36 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No se encontraron cursos.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((course) => {
                const count = getStudentCount(course.id);
                return (
                  <Link key={course.id} to={`/courses/${course.id}`}>
                    <div className="group relative flex flex-col gap-3 rounded-lg border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <div>
                        <p className="font-semibold leading-snug text-foreground line-clamp-2">
                          {course.name}
                        </p>
                        {course.description && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {course.description}
                          </p>
                        )}
                      </div>
                      <div className="mt-auto flex items-center gap-2">
                        <Badge variant="secondary" className="gap-1.5 text-xs">
                          <Users className="h-3 w-3" />
                          {count} {count === 1 ? "estudiante" : "estudiantes"}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoursesPage;
