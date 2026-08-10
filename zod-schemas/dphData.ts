import { z } from "zod";

export const DphItemSchema = z.object({
  date: z.date().min(10).max(10),
  dph_kc: z.number().min(1000).max(10000),
});

export const DphDataSchema = z.record(z.string(), z.array(DphItemSchema));

export const AggregatedValuesSchema = z.object({
  inPercant: z.array(DphItemSchema),
  inAverageValue: z.array(DphItemSchema),
});

export type DphData = z.infer<typeof DphDataSchema>;
export type AggregatedValues = z.infer<typeof AggregatedValuesSchema>;
