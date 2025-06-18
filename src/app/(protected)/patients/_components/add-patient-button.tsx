"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { UpsertPatientForm } from "./upsert-patient-form";

export const AddPatientButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar paciente</Button>
      </DialogTrigger>
      <UpsertPatientForm
        isOpen={isDialogOpen}
        onSuccess={() => setIsDialogOpen(false)}
      />
    </Dialog>
  );
};
