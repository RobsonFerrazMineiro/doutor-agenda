import { Button } from "@/components/ui/button";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { auth } from "@/lib/auth";
import { Plus } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const DoctorsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/authentication");
  }
  console.log(session.user.clinic);

  if (!session.user.clinic) {
    redirect("/clinic-form");
  }
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>
            Gerencie os médicos cadastrados no sistema.
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <Button>
            <Plus /> Adicionar Médico
          </Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <h1>Médicos</h1>
        <p>
          Esta página permite que você visualize e gerencie os médicos
          cadastrados no sistema. Você pode adicionar, editar ou remover médicos
          conforme necessário.
        </p>
      </PageContent>
    </PageContainer>
  );
};

export default DoctorsPage;
