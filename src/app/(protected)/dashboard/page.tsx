import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";
import { and, count, eq, gte, lte, sum } from "drizzle-orm";
import { DatePicker } from "./_components/date-picker";
import { StatsCards } from "./_components/stats-cards";

interface DashboardPageProps {
  searchParams: Promise<{ from?: string; to?: string }>;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect("/authentication");
  }
  if (!session.user.clinic) {
    redirect("/clinic-form");
  }
  const { from, to } = await searchParams;

  // Definir valores padrão para from e to caso sejam undefined ou inválidos
  const now = new Date();
  const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1); // Primeiro dia do mês atual
  const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Último dia do mês atual

  // Função para validar e converter string para Date
  const parseDate = (defaultDate: Date, dateString?: string): Date => {
    if (!dateString) return defaultDate;

    try {
      const date = new Date(dateString);
      return !isNaN(date.getTime()) ? date : defaultDate;
    } catch {
      return defaultDate;
    }
  };

  const validFromDate = parseDate(defaultFrom, from);
  const validToDate = parseDate(defaultTo, to);
  const [[totalRevenue], [totalAppointments], [totalPatients], [totalDoctors]] =
    await Promise.all([
      db
        .select({ total: sum(appointmentsTable.appointmentPriceInCents) })
        .from(appointmentsTable)
        .where(
          and(
            eq(appointmentsTable.clinicId, session.user.clinic.id),
            gte(appointmentsTable.date, validFromDate),
            lte(appointmentsTable.date, validToDate),
          ),
        ),
      db
        .select({ total: count() })
        .from(appointmentsTable)
        .where(
          and(
            eq(appointmentsTable.clinicId, session.user.clinic.id),
            gte(appointmentsTable.date, validFromDate),
            lte(appointmentsTable.date, validToDate),
          ),
        ),
      db
        .select({ total: count() })
        .from(patientsTable)
        .where(eq(patientsTable.clinicId, session.user.clinic.id)),
      db
        .select({ total: count() })
        .from(doctorsTable)
        .where(eq(doctorsTable.clinicId, session.user.clinic.id)),
    ]);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Gerencie sua clínica, médicos e pacientes de forma simples e rápida.
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <DatePicker />
        </PageActions>
      </PageHeader>
      <PageContent>
        <StatsCards
          totalRevenue={totalRevenue.total}
          totalAppointments={totalAppointments.total}
          totalPatients={totalPatients.total}
          totalDoctors={totalDoctors.total}
        />
      </PageContent>
    </PageContainer>
  );
};
export default DashboardPage;
