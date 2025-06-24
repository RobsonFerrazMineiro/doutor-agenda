"use client";

import { upsertAppointment } from "@/actions/upsert-appointment";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  patientId: z.string().min(1, { message: "Selecione um paciente" }),
  doctorId: z.string().min(1, { message: "Selecione um médico" }),
  appointmentPrice: z
    .number()
    .min(1, { message: "Informe o valor da consulta" }),
  date: z.date({ message: "Selecione a data" }),
  time: z.string().min(1, { message: "Selecione o horário" }),
});

interface AppointmentFormProps {
  isOpen: boolean;
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
  appointment?: typeof appointmentsTable.$inferSelect;
  onSuccess?: () => void;
}

const AppointmentForm = ({
  appointment,
  patients,
  doctors,
  onSuccess,
  isOpen,
}: AppointmentFormProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  const selectedDoctor = useMemo(
    () => doctors.find((d) => d.id === selectedDoctorId),
    [selectedDoctorId, doctors],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: appointment?.patientId ?? "",
      doctorId: appointment?.doctorId ?? "",
      appointmentPrice: 0,
      date: appointment?.date ?? undefined,
      time: "",
    },
  });

  const watchDoctorId = form.watch("doctorId");
  const watchPatientId = form.watch("patientId");

  const upsertAppointmentAction = useAction(upsertAppointment, {
    onSuccess: () => {
      toast.success("Agendamento salvo com sucesso!");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao salvar agendamento.");
    },
  });

  useEffect(() => {
    if (watchDoctorId) {
      const selectedDoctor = doctors.find(
        (doctor) => doctor.id === watchDoctorId,
      );
      if (selectedDoctor) {
        form.setValue(
          "appointmentPrice",
          selectedDoctor.appointmentPriceInCents / 100,
        );
      }
    }
  }, [watchDoctorId, doctors, form]);

  useEffect(() => {
    if (isOpen) {
      form.reset({
        patientId: "",
        doctorId: "",
        appointmentPrice: 0,
        date: appointment?.date ?? undefined,
        time: "",
      });
    }
  }, [isOpen, form, appointment]);

  const upsertedAppointmentAction = useAction(upsertAppointment, {
    onSuccess: () => {
      toast.success("Agendamento salvo com sucesso!");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao salvar agendamento.");
    },
  });

  // Habilita campos conforme seleção
  const isDoctorSelected = !!selectedDoctorId;
  const isPatientSelected = !!selectedPatientId;
  const isDateTimeEnabled = watchDoctorId && watchPatientId;
  const isPriceEnabled = isDoctorSelected;

  // Atualiza valor do preço ao selecionar médico
  const handleDoctorChange = (value: string) => {
    setSelectedDoctorId(value);
    const doctor = doctors.find((d) => d.id === value);
    if (doctor) {
      form.setValue("appointmentPrice", doctor.appointmentPriceInCents / 100);
    } else {
      form.setValue("appointmentPrice", 0);
    }
    form.setValue("doctorId", value);
  };

  const handlePatientChange = (value: string) => {
    setSelectedPatientId(value);
    form.setValue("patientId", value);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    upsertAppointmentAction.execute({
      ...values,
      id: appointment?.id,
      appointmentPrice: values.appointmentPrice * 100,
    });
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>
          {appointment ? "Editar agendamento" : "Novo agendamento"}
        </DialogTitle>
        <DialogDescription>
          {appointment
            ? "Edite os detalhes do agendamento."
            : "Preencha os dados para criar um novo agendamento."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paciente</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={handlePatientChange}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o paciente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médico</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={handleDoctorChange}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o médico" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="appointmentPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da consulta</FormLabel>
                <FormControl>
                  <NumericFormat
                    value={field.value}
                    onValueChange={(values: { floatValue: any }) => {
                      field.onChange(values.floatValue);
                    }}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    thousandSeparator="."
                    customInput={Input}
                    prefix="R$ "
                    disabled={!isPriceEnabled}
                    placeholder="R$ 0,00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                      disabled={!isDateTimeEnabled}
                    >
                      <CalendarIcon />
                      {field.value ? (
                        format(field.value, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione a data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!isDateTimeEnabled}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Manhã</SelectLabel>
                      <SelectItem value="05:00:00">05:00</SelectItem>
                      <SelectItem value="05:30:00">05:30</SelectItem>
                      <SelectItem value="06:00:00">06:00</SelectItem>
                      <SelectItem value="06:30:00">06:30</SelectItem>
                      <SelectItem value="07:00:00">07:00</SelectItem>
                      <SelectItem value="07:30:00">07:30</SelectItem>
                      <SelectItem value="08:00:00">08:00</SelectItem>
                      <SelectItem value="08:30:00">08:30</SelectItem>
                      <SelectItem value="09:00:00">09:00</SelectItem>
                      <SelectItem value="09:30:00">09:30</SelectItem>
                      <SelectItem value="10:00:00">10:00</SelectItem>
                      <SelectItem value="10:30:00">10:30</SelectItem>
                      <SelectItem value="11:00:00">11:00</SelectItem>
                      <SelectItem value="11:30:00">11:30</SelectItem>
                      <SelectItem value="12:00:00">12:00</SelectItem>
                      <SelectItem value="12:30:00">12:30</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Tarde</SelectLabel>
                      <SelectItem value="13:00:00">13:00</SelectItem>
                      <SelectItem value="13:30:00">13:30</SelectItem>
                      <SelectItem value="14:00:00">14:00</SelectItem>
                      <SelectItem value="14:30:00">14:30</SelectItem>
                      <SelectItem value="15:00:00">15:00</SelectItem>
                      <SelectItem value="15:30:00">15:30</SelectItem>
                      <SelectItem value="16:00:00">16:00</SelectItem>
                      <SelectItem value="16:30:00">16:30</SelectItem>
                      <SelectItem value="17:00:00">17:00</SelectItem>
                      <SelectItem value="17:30:00">17:30</SelectItem>
                      <SelectItem value="18:00:00">18:00</SelectItem>
                      <SelectItem value="18:30:00">18:30</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Noite</SelectLabel>
                      <SelectItem value="19:00:00">19:00</SelectItem>
                      <SelectItem value="19:30:00">19:30</SelectItem>
                      <SelectItem value="20:00:00">20:00</SelectItem>
                      <SelectItem value="20:30:00">20:30</SelectItem>
                      <SelectItem value="21:00:00">21:00</SelectItem>
                      <SelectItem value="21:30:00">21:30</SelectItem>
                      <SelectItem value="22:00:00">22:00</SelectItem>
                      <SelectItem value="22:30:00">22:30</SelectItem>
                      <SelectItem value="23:00:00">23:00</SelectItem>
                      <SelectItem value="23:30:00">23:30</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={upsertAppointmentAction.isPending}
            >
              {upsertAppointmentAction.isPending
                ? "Salvando..."
                : "Criar agendamento"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default AppointmentForm;
