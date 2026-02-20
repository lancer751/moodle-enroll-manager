import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, BookOpen, User, Hash, ArrowLeft } from "lucide-react";

const EnrollSuccessPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const studentName = params.get("student") ?? "Estudiante";
  const courseName = params.get("course") ?? "Curso";
  const refId = params.get("ref") ?? `MDL-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="flex flex-col items-center gap-6 pt-10 pb-8 text-center">
          {/* Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>

          {/* Title */}
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-bold text-foreground">
              ¡Matriculado en Moodle!
            </h1>
            <p className="text-sm text-muted-foreground">
              El estudiante ha sido matriculado correctamente en la plataforma Moodle.
            </p>
          </div>

          {/* Details */}
          <div className="w-full rounded-lg border bg-muted/30 divide-y">
            <div className="flex items-center gap-3 px-4 py-3">
              <User className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Estudiante</p>
                <p className="text-sm font-medium text-foreground">{studentName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Curso</p>
                <p className="text-sm font-medium text-foreground">{courseName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Hash className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">ID de referencia</p>
                <p className="font-mono text-sm font-medium text-foreground">{refId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Estado de matrícula</p>
                <Badge className="mt-0.5 bg-success/15 text-success border-success/20 border text-xs">
                  Matriculado correctamente en Moodle
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex w-full flex-col gap-2">
            <Button onClick={() => navigate(-1)} className="w-full gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al detalle del curso
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/courses")}
            >
              Ver todos los cursos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnrollSuccessPage;
