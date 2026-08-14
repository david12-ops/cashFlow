import { z } from "zod";

export const DphItemSchema = z.object({
  Date_val: z.date().min(10).max(10),
  Dph_val: z.number().min(1000).max(10000),
});

export const DphDataSchema = z.record(z.string(), z.array(DphItemSchema));

export type DphData = z.infer<typeof DphDataSchema>;
