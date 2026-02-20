import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  ArrowLeft,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  Wifi,
  WifiOff,
  ShieldOff,
  Loader2,
  Calendar,
  Tag,
} from "lucide-react";
import { mockCourses, getCourseStudents } from "@/lib/mock-data";
import { CourseStudent, CourseAccessStatus, MoodleEnrollmentStatus } from "@/lib/types";

// ─── Status helpers ────────────────────────────────────────────
function EnrollmentStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    ENROLLED:     { label: "Matriculado",   className: "bg-success/15 text-success border-success/20" },
    WAITING_LIST: { label: "En espera",     className: "bg-warning/15 text-warning border-warning/20" },
    PENDING:      { label: "Pendiente",     className: "bg-muted text-muted-foreground border-border" },
    APPROVED:     { label: "Aprobado",      className: "bg-primary/10 text-primary border-primary/20" },
    REJECTED:     { label: "Rechazado",     className: "bg-destructive/15 text-destructive border-destructive/20" },
    CANCELLED:    { label: "Cancelado",     className: "bg-destructive/15 text-destructive border-destructive/20" },
    SUSPENDED:    { label: "Suspendido",    className: "bg-warning/15 text-warning border-warning/20" },
    COMPLETED:    { label: "Completado",    className: "bg-success/15 text-success border-success/20" },
    DROPPED:      { label: "Abandonado",    className: "bg-muted text-muted-foreground border-border" },
  };
  const cfg = map[status] ?? { label: status, className: "bg-muted text-muted-foreground" };
  return <Badge className={`${cfg.className} border text-xs`}>{cfg.label}</Badge>;
}

function MoodleBadge({ status }: { status: MoodleEnrollmentStatus }) {
  if (status === "ENROLLED")
    return (
      <Badge className="gap-1 bg-success/15 text-success border-success/20 border text-xs">
        <Wifi className="h-3 w-3" /> Moodle activo
      </Badge>
    );
  if (status === "SUSPENDED")
    return (
      <Badge className="gap-1 bg-warning/15 text-warning border-warning/20 border text-xs">
        <WifiOff className="h-3 w-3" /> Moodle suspendido
      </Badge>
    );
  return (
    <Badge className="gap-1 bg-muted text-muted-foreground border text-xs">
      <WifiOff className="h-3 w-3" /> No matriculado
    </Badge>
  );
}

function AccessBadge({ status }: { status: CourseAccessStatus }) {
  if (status === "DISABLED")
    return (
      <Badge className="gap-1 bg-destructive/15 text-destructive border-destructive/20 border text-xs">
        <ShieldOff className="h-3 w-3" /> Acceso desactivado
      </Badge>
    );
  return null;
}

// ─── Main component ────────────────────────────────────────────
const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Load from mock
  const course = mockCourses.find((c) => String(c.id) === String(courseId)) ?? null;
  const [students, setStudents] = useState<CourseStudent[]>(() =>
    courseId ? getCourseStudents(Number(courseId)) : []
  );

  // Moodle enroll simulation state
  const [enrollingId, setEnrollingId] = useState<number | null>(null);

  // Disable access modal state
  const [disableTarget, setDisableTarget] = useState<CourseStudent | null>(null);
  const [disablingId, setDisablingId] = useState<number | null>(null);

  // ── Derived stats
  const enrolledCount = students.filter((s) => s.enrollmentStatus === "ENROLLED").length;
  const waitingCount = students.filter((s) => s.enrollmentStatus === "WAITING_LIST").length;
  const moodleCount = students.filter((s) => s.moodleEnrollmentStatus === "ENROLLED").length;

  // ── Search filter
  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      s.username.toLowerCase().includes(q) ||
      (s.email ?? "").toLowerCase().includes(q) ||
      (s.dni ?? "").toLowerCase().includes(q)
    );
  });

  // ── Enroll in Moodle action
  const handleMoodleEnroll = async (student: CourseStudent) => {
    setEnrollingId(student.id);
    await new Promise((r) => setTimeout(r, 1400));
    setStudents((prev) =>
      prev.map((s) =>
        s.id === student.id
          ? { ...s, moodleEnrollmentStatus: "ENROLLED", courseAccessStatus: "ACTIVE" }
          : s
      )
    );
    setEnrollingId(null);
    navigate(`/enroll/success?student=${encodeURIComponent(student.fullName)}&course=${encodeURIComponent(course?.name ?? "")}&ref=MDL-${Date.now().toString(36).toUpperCase()}`);
  };

  // ── Disable access action
  const handleDisableConfirm = async () => {
    if (!disableTarget) return;
    setDisablingId(disableTarget.id);
    await new Promise((r) => setTimeout(r, 900));
    setStudents((prev) =>
      prev.map((s) =>
        s.id === disableTarget.id ? { ...s, courseAccessStatus: "DISABLED" } : s
      )
    );
    setDisablingId(null);
    setDisableTarget(null);
  };

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
      {course ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                {course.name}
              </h1>
              {course.description && (
                <p className="mt-1 max-w-2xl text-muted-foreground">{course.description}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" /> {course.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {course.startDate} → {course.endDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">Curso no encontrado.</p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{students.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle2 className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{enrolledCount}</p>
              <p className="text-xs text-muted-foreground">Matriculados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{waitingCount}</p>
              <p className="text-xs text-muted-foreground">En espera</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
              <Wifi className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{moodleCount}</p>
              <p className="text-xs text-muted-foreground">En Moodle</p>
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
              placeholder="Buscar por nombre, email o DNI..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Estado matrícula</TableHead>
                  <TableHead>Estado Moodle</TableHead>
                  <TableHead>Acceso</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                      {students.length === 0
                        ? "No hay estudiantes matriculados en este curso."
                        : "No se encontraron estudiantes con ese criterio."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s) => {
                    const isEnrollingThis = enrollingId === s.id;
                    const isDisablingThis = disablingId === s.id;
                    const canEnrollMoodle = s.moodleEnrollmentStatus !== "ENROLLED";
                    const canDisable = s.courseAccessStatus === "ACTIVE";

                    return (
                      <TableRow
                        key={s.id}
                        className={s.courseAccessStatus === "DISABLED" ? "opacity-60" : ""}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {s.firstName} {s.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              @{s.username}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{s.email}</TableCell>
                        <TableCell className="text-sm">{s.dni ?? "—"}</TableCell>
                        <TableCell>
                          <EnrollmentStatusBadge status={s.enrollmentStatus} />
                        </TableCell>
                        <TableCell>
                          <MoodleBadge status={s.moodleEnrollmentStatus} />
                        </TableCell>
                        <TableCell>
                          {s.courseAccessStatus === "DISABLED" ? (
                            <AccessBadge status="DISABLED" />
                          ) : (
                            <Badge className="bg-success/15 text-success border-success/20 border text-xs">
                              Activo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            {/* Enroll in Moodle */}
                            {canEnrollMoodle && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-xs h-8"
                                disabled={isEnrollingThis || !!disablingId}
                                onClick={() => handleMoodleEnroll(s)}
                              >
                                {isEnrollingThis ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Wifi className="h-3 w-3" />
                                )}
                                {isEnrollingThis ? "Matriculando…" : "Matricular en Moodle"}
                              </Button>
                            )}
                            {/* Disable access */}
                            {canDisable && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-xs h-8 text-destructive border-destructive/30 hover:bg-destructive/10"
                                disabled={isDisablingThis || !!enrollingId}
                                onClick={() => setDisableTarget(s)}
                              >
                                {isDisablingThis ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <ShieldOff className="h-3 w-3" />
                                )}
                                Desactivar acceso
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Disable Access Confirmation Modal */}
      <AlertDialog open={!!disableTarget} onOpenChange={(o) => !o && setDisableTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar acceso al curso?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto desactivará el acceso de{" "}
              <strong>
                {disableTarget?.firstName} {disableTarget?.lastName}
              </strong>{" "}
              al curso. El estudiante no será eliminado del sistema y podrás restaurar el acceso en el futuro.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDisableConfirm}
            >
              Desactivar acceso
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseDetailPage;
