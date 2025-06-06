"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import UpsertDorctorForm from "./upsert-doctor-form";

const AddDoctorButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <UpsertDorctorForm></UpsertDorctorForm>
    </Dialog>
  );
};

export default AddDoctorButton;
