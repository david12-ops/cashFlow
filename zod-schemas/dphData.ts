import { z } from "zod";

export const DphItemSchema = z.object({
  Date_val: z.date().min(10).max(10),
  Dph_val: z.number().min(1000).max(10000),
});

export const DphDataSchema = z.record(z.string(), z.array(DphItemSchema));

export const MonthDataSchema = z.array(
  z.object({
    Date_val: z.date(),
    Dph_val: z.number(),
  })
);

export const MonthsData = z.array(MonthDataSchema);

export type MonthsData = z.infer<typeof MonthsData>;

export type MonthData = z.infer<typeof MonthDataSchema>;

export type DphData = z.infer<typeof DphDataSchema>;
