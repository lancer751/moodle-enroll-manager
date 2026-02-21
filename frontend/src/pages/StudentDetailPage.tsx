import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, Phone, CreditCard, Calendar, BookOpen, Hash } from "lucide-react";
import { mockStudents, mockEnrollments, mockCourses } from "@/lib/mock-data";
import { EnrollmentStatus, MoodleEnrollmentStatus, CourseAccessStatus } from "@/lib/types";

function StatusBadge({ status }: { status: EnrollmentStatus }) {
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

const StudentDetailPage = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const student = mockStudents.find((s) => String(s.id) === studentId);

  if (!student) {
    return (
      <div className="space-y-6">
        <Link to="/students" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a Estudiantes
        </Link>
        <p className="text-muted-foreground">Estudiante no encontrado.</p>
      </div>
    );
  }

  const studentEnrollments = mockEnrollments.filter((e) => e.studentId === student.id);
  const enrolledCourses = studentEnrollments.map((enrollment) => {
    const course = mockCourses.find((c) => c.id === enrollment.courseId);
    return { enrollment, course };
  });

  return (
    <div className="space-y-6">
      <Link to="/students" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Volver a Estudiantes
      </Link>

      {/* Student Profile */}
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <User className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">{student.fullName}</h1>
          <p className="text-sm text-muted-foreground font-mono">@{student.username}</p>
        </div>
      </div>

      {/* Profile Info */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-lg">Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">{student.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">DNI</p>
                <p className="text-sm font-medium text-foreground">{student.dni ?? "No registrado"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Teléfono</p>
                <p className="text-sm font-medium text-foreground">{student.phone ?? "No registrado"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Moodle ID</p>
                <p className="text-sm font-medium text-foreground">{student.moodleId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Registrado</p>
                <p className="text-sm font-medium text-foreground">{new Date(student.createdAt).toLocaleDateString("es-ES")}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enrolled Courses */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <BookOpen className="h-5 w-5 text-primary" />
            Cursos Matriculados ({enrolledCourses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enrolledCourses.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">Este estudiante no está matriculado en ningún curso.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {enrolledCourses.map(({ enrollment, course }) => (
                <Link key={enrollment.id} to={`/courses/${enrollment.courseId}`}>
                  <div className="group flex flex-col gap-2 rounded-lg border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <StatusBadge status={enrollment.status} />
                    </div>
                    <p className="font-semibold text-foreground text-sm leading-snug">{course?.name ?? "Curso desconocido"}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Inscrito: {new Date(enrollment.createdAt).toLocaleDateString("es-ES")}
                      </span>
                      {course && (
                        <Badge variant="outline" className="text-xs">{course.category}</Badge>
                      )}
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

export default StudentDetailPage;
