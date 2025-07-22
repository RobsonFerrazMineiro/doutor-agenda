import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyInCents } from "@/helpers/currency";
import { Calendar, DollarSign, Stethoscope, Users } from "lucide-react";

interface StatsCardsProps {
  totalRevenue: string | null;
  totalAppointments: number;
  totalPatients: number;
  totalDoctors: number;
}

export const StatsCards = ({
  totalRevenue,
  totalAppointments,
  totalPatients,
  totalDoctors,
}: StatsCardsProps) => {
  const stats = [
    {
      title: "Faturamento",
      value: totalRevenue
        ? formatCurrencyInCents(Number(totalRevenue))
        : "R$ 0,00",
      icon: DollarSign,
      description: "Receita do período selecionado",
    },
    {
      title: "Consultas",
      value: totalAppointments.toString(),
      icon: Calendar,
      description: "Total de consultas agendadas",
    },
    {
      title: "Pacientes",
      value: totalPatients.toString(),
      icon: Users,
      description: "Pacientes cadastrados",
    },
    {
      title: "Médicos",
      value: totalDoctors.toString(),
      icon: Stethoscope,
      description: "Médicos na clínica",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="gap-2">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                <Icon className="text-primary h-4 w-4" />
              </div>
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-muted-foreground text-xs">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
