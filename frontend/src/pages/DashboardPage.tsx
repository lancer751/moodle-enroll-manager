import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/StatusBadge";
import { mockStudents } from "@/lib/mock-data";
import { COURSES } from "@/lib/types";
import { Search, UserPlus, Users, CheckCircle2, Clock, GraduationCap } from "lucide-react";
import { User } from "@/types/user";

const PAGE_SIZE = 5;

const DashboardPage = () => {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState<User[]>([])

  useEffect(() => {
    async function fetchMoodleUsers() {
      try {
        const res = await fetch("http://localhost:5000/api/users")
        const students = await res.json()
        setStudents(students.data)
      } catch (error) {
        console.error("Error fetching Moodle students:", error)
      }
    }

    fetchMoodleUsers()
  }, [])

  useEffect(() => {
    async function fetchMoodleCourses() {
      try {
        const res = await fetch("http://localhost:5000/api/courses")
        const courses = await res.json()
        setCourses(courses.data)
      } catch (error) {
        console.error("Error fetching Moodle courses:", error)
      }
    }

    fetchMoodleCourses()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Panel de Estudiantes
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gestiona las matrículas y el estado de los estudiantes.
          </p>
        </div>
        <Link to="/enroll">
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Nueva Matrícula
          </Button>
        </Link>
      </div>


      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <GraduationCap className="h-5 w-5 text-primary" />
            Listado de Estudiantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* search nav to looking for students */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, DNI o usuario..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            {/* filter to choose the course */}
            <Select value={courseFilter} onValueChange={(v) => { setCourseFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Todos los cursos" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                <SelectItem value="all">Todos los cursos</SelectItem>
                {courses?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Nombre y Apellidos</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Teléfono</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      No se encontraron más estudiantes.
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium capitalize">
                        {s.firstName.toLowerCase()} {s.lastName.toLowerCase()}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{s.username}</TableCell>
                      <TableCell>{s.dni ?? "No registrado"}</TableCell>
                      <TableCell>{s.phone ?? "No registrado"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination
          {students.length > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">
                Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
              </p>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )} */}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
