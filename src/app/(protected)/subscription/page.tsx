import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { auth } from "@/lib/auth";
import { SubscriptionPlan } from "./_components/subsciption-plan";

const Subscription = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  if (!session.user.clinic) {
    redirect("/clinic-form");
  }
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Assinatura</PageTitle>
          <PageDescription>Gerencie a sua assinatura.</PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <Card className="mb-4">
          <CardHeader>
            <h2 className="text-lg font-semibold">Planos disponíveis</h2>
          </CardHeader>
          <CardContent>
            <p>Em breve, novos planos serão disponibilizados.</p>
          </CardContent>
        </Card>
        <SubscriptionPlan
          className="w-[350px]"
          // active={session.user.plan === "essential"}
          userEmail={session.user.email}
        />
      </PageContent>
    </PageContainer>
  );
};

export default Subscription;
