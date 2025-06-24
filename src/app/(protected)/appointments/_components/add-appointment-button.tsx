"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import AppointmentForm from "./upsert-appointment-form";

interface AppointmentButtonProps {
  patients: Array<any>;
  doctors: Array<any>;
}

const AppointmentButton = ({ patients, doctors }: AppointmentButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Novo agendamento
        </Button>
      </DialogTrigger>
      <AppointmentForm
        isOpen={isDialogOpen}
        patients={patients}
        doctors={doctors}
        onSuccess={() => setIsDialogOpen(false)}
      />
    </Dialog>
  );
};

export default AppointmentButton;
