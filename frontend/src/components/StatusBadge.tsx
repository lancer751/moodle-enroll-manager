import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from "lucide-react";

const StatusBadge = ({ status }: { status: "Matriculado" | "En espera" }) => {
  if (status === "Matriculado") {
    return (
      <Badge className="gap-1 bg-success/15 text-success border-success/20 hover:bg-success/20">
        <CheckCircle2 className="h-3 w-3" />
        Matriculado
      </Badge>
    );
  }
  return (
    <Badge className="gap-1 bg-warning/15 text-warning border-warning/20 hover:bg-warning/20">
      <Clock className="h-3 w-3" />
      En espera
    </Badge>
  );
};

export default StatusBadge;
