import { z } from "zod";

export const DphItemSchema = z.object({
  date_val: z.date().min(10).max(10),
  dph_val: z.number().min(1000).max(10000),
});

export const DphDataSchema = z.record(z.string(), z.array(DphItemSchema));

export const MonthDataSchema = z.array(
  z.object({
    date_val: z.date(),
    dph_val: z.number(),
  })
);

export const MonthsDataSchema = z.array(MonthDataSchema);

export const TestDataSchema = z
  .object({
    key: z.string(),
    data: DphDataSchema,
  })
  .nullable();

export const DataForDPHpredictionSchema = z.object({
  data: DphDataSchema,
  trainingData: DphDataSchema,
  testData: TestDataSchema,
  aggMonthNumbersInPercent: MonthDataSchema,
  activeMonth: MonthDataSchema,
});

export type MonthData = z.infer<typeof MonthDataSchema>;
export type MonthsData = z.infer<typeof MonthsDataSchema>;
export type DphData = z.infer<typeof DphDataSchema>;
export type TestData = z.infer<typeof TestDataSchema>;
export type DataForDPHprediction = z.infer<typeof DataForDPHpredictionSchema>;
