import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserPlus, Users, CheckCircle2, Clock, GraduationCap } from "lucide-react";
import { mockStudents, mockEnrollments, mockCourses } from "@/lib/mock-data";
import { Student } from "@/lib/types";

const PAGE_SIZE = 8;

function EnrollmentStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    ENROLLED:     { label: "Matriculado",   className: "bg-success/15 text-success border-success/20" },
    WAITING_LIST: { label: "En espera",     className: "bg-warning/15 text-warning border-warning/20" },
    PENDING:      { label: "Pendiente",     className: "bg-muted text-muted-foreground border-border" },
    APPROVED:     { label: "Aprobado",      className: "bg-primary/10 text-primary border-primary/20" },
    REJECTED:     { label: "Rechazado",     className: "bg-destructive/15 text-destructive border-destructive/20" },
    SUSPENDED:    { label: "Suspendido",    className: "bg-warning/15 text-warning border-warning/20" },
    COMPLETED:    { label: "Completado",    className: "bg-success/15 text-success border-success/20" },
  };
  const cfg = map[status] ?? { label: status, className: "bg-muted text-muted-foreground" };
  return <Badge className={`${cfg.className} border text-xs`}>{cfg.label}</Badge>;
}

const DashboardPage = () => {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Build a flat list: one row per unique student, showing their primary enrollment status
  const allRows = useMemo(() => {
    return mockStudents.map((student) => {
      const enrollments = mockEnrollments.filter((e) => e.studentId === student.id);
      // show worst/most-relevant status across all enrollments
      const primaryStatus = enrollments[0]?.status ?? student.status;
      const courseNames = enrollments
        .map((e) => mockCourses.find((c) => c.id === e.courseId)?.name ?? "")
        .filter(Boolean);
      return { ...student, primaryStatus, courseNames, courseIds: enrollments.map((e) => String(e.courseId)) };
    });
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allRows.filter((s) => {
      const matchSearch =
        !q ||
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.username.toLowerCase().includes(q) ||
        (s.dni ?? "").toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q);
      const matchCourse =
        courseFilter === "all" || s.courseIds.includes(courseFilter);
      const matchStatus =
        statusFilter === "all" || s.primaryStatus === statusFilter;
      return matchSearch && matchCourse && matchStatus;
    });
  }, [allRows, search, courseFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const enrolledCount = allRows.filter((s) => s.primaryStatus === "ENROLLED").length;
  const waitingCount = allRows.filter((s) => s.primaryStatus === "WAITING_LIST").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Panel de Estudiantes</h1>
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

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{mockStudents.length}</p>
              <p className="text-sm text-muted-foreground">Total estudiantes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-success/10">
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
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{waitingCount}</p>
              <p className="text-sm text-muted-foreground">En espera</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters + Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <GraduationCap className="h-5 w-5 text-primary" />
            Listado de Estudiantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, DNI, email o usuario..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={courseFilter} onValueChange={(v) => { setCourseFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Todos los cursos" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                <SelectItem value="all">Todos los cursos</SelectItem>
                {mockCourses.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="ENROLLED">Matriculado</SelectItem>
                <SelectItem value="WAITING_LIST">En espera</SelectItem>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="APPROVED">Aprobado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Nombre y Apellidos</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Cursos</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      No se encontraron estudiantes.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p>{s.firstName} {s.lastName}</p>
                          <p className="text-xs text-muted-foreground font-mono">@{s.username}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{s.email}</TableCell>
                      <TableCell className="text-sm">{s.dni ?? "No registrado"}</TableCell>
                      <TableCell className="text-sm">{s.phone ?? "No registrado"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {s.courseNames.length === 0 ? (
                            <span className="text-xs text-muted-foreground">—</span>
                          ) : (
                            s.courseNames.slice(0, 2).map((name, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {name}
                              </Badge>
                            ))
                          )}
                          {s.courseNames.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{s.courseNames.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <EnrollmentStatusBadge status={s.primaryStatus} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filtered.length > PAGE_SIZE && (
            <div className="flex items-center justify-between pt-1">
              <p className="text-sm text-muted-foreground">
                Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
              </p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
