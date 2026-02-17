import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COURSES } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, ArrowLeft } from "lucide-react";
import { z } from "zod";

const enrollSchema = z.object({
  firstName: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  lastName: z.string().trim().min(1, "Los apellidos son obligatorios").max(100),
  dni: z.string().trim().min(1, "El DNI es obligatorio").max(20),
  phone: z.string().trim().min(1, "El teléfono es obligatorio").max(20),
  username: z.string().trim().min(3, "Mínimo 3 caracteres").max(50),
  password: z.string().min(6, "Mínimo 6 caracteres").max(100),
  courseId: z.string().min(1, "Seleccione un curso"),
});

type FormData = z.infer<typeof enrollSchema>;

const EnrollPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    dni: "",
    phone: "",
    username: "",
    password: "",
    courseId: "",
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = enrollSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.errors.forEach((err) => {
        const key = err.path[0] as keyof FormData;
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);

    toast({
      title: "Estudiante matriculado",
      description: `${form.firstName} ${form.lastName} ha sido registrado correctamente.`,
    });
    navigate("/");
  };

  const fields: { key: keyof FormData; label: string; type?: string; placeholder: string }[] = [
    { key: "firstName", label: "Nombre", placeholder: "Ej: Carlos" },
    { key: "lastName", label: "Apellidos", placeholder: "Ej: García López" },
    { key: "dni", label: "DNI", placeholder: "Ej: 12345678A" },
    { key: "phone", label: "Teléfono", placeholder: "Ej: +34 612 345 678" },
    { key: "username", label: "Usuario", placeholder: "Ej: cgarcia" },
    { key: "password", label: "Contraseña", type: "password", placeholder: "Mínimo 6 caracteres" },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <Button
        variant="ghost"
        className="mb-4 gap-2 text-muted-foreground"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-2xl">
            <UserPlus className="h-6 w-6 text-primary" />
            Nueva Matrícula
          </CardTitle>
          <CardDescription>
            Completa el formulario para matricular un estudiante en Moodle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Label htmlFor={f.key}>{f.label}</Label>
                  <Input
                    id={f.key}
                    type={f.type || "text"}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    className={errors[f.key] ? "border-destructive" : ""}
                  />
                  {errors[f.key] && (
                    <p className="text-xs text-destructive">{errors[f.key]}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <Label>Curso</Label>
              <Select
                value={form.courseId}
                onValueChange={(v) => handleChange("courseId", v)}
              >
                <SelectTrigger className={errors.courseId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Seleccione un curso" />
                </SelectTrigger>
                <SelectContent>
                  {COURSES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.courseId && (
                <p className="text-xs text-destructive">{errors.courseId}</p>
              )}
            </div>

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Matriculando...
                </span>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Matricular Estudiante
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnrollPage;
