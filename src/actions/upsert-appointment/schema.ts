import z from "zod";

export const upsertAppointmentSchema = z.object({
  id: z.string().uuid().optional(),
  patientId: z.string().uuid({ message: "Selecione um paciente" }),
  doctorId: z.string().uuid({ message: "Selecione um médico" }),
  appointmentPrice: z
    .number()
    .min(1, { message: "Informe o valor da consulta" }),
  date: z.date({ required_error: "Selecione a data" }),
  time: z.string().min(1, { message: "Selecione o horário" }),
});

export type UpsertAppointmentSchema = z.infer<typeof upsertAppointmentSchema>;
