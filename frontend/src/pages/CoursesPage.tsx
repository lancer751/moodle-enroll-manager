import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Users, ArrowRight, GraduationCap, Tag, Calendar } from "lucide-react";
import { getCoursesWithStats } from "@/lib/mock-data";

const coursesWithStats = getCoursesWithStats();

const CoursesPage = () => {
  const [search, setSearch] = useState("");

  const filtered = coursesWithStats.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = coursesWithStats.reduce((acc, c) => acc + c.studentCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Cursos</h1>
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
              <p className="text-2xl font-bold text-foreground">{coursesWithStats.length}</p>
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
              <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
              <p className="text-sm text-muted-foreground">Matrículas totales</p>
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
              placeholder="Buscar curso o categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No se encontraron cursos.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((course) => (
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
                    <div className="mt-auto flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="gap-1.5 text-xs">
                        <Users className="h-3 w-3" />
                        {course.studentCount}{" "}
                        {course.studentCount === 1 ? "estudiante" : "estudiantes"}
                      </Badge>
                      <Badge variant="outline" className="gap-1 text-xs">
                        <Tag className="h-3 w-3" />
                        {course.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {course.startDate} → {course.endDate}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoursesPage;
