import { z } from "zod";

export const VatItemSchema = z.object({
  date_val: z.date().min(10).max(10),
  vat_val: z.number().min(1000).max(10000),
});

export const VatDataSchema = z.record(z.string(), z.array(VatItemSchema));

export const MonthDataSchema = z.array(
  z.object({
    date_val: z.date(),
    vat_val: z.number(),
  })
);

export const MonthsDataSchema = z.array(MonthDataSchema);

export const TestDataSchema = z
  .object({
    key: z.string(),
    data: VatDataSchema,
  })
  .nullable();

export const DataForVatPredictionSchema = z.object({
  data: VatDataSchema,
  trainingData: VatDataSchema,
  testData: TestDataSchema,
  aggMonthNumbersInPercent: MonthDataSchema,
  activeMonth: MonthDataSchema,
});

export type MonthData = z.infer<typeof MonthDataSchema>;
export type MonthsData = z.infer<typeof MonthsDataSchema>;
export type VatData = z.infer<typeof VatDataSchema>;
export type TestData = z.infer<typeof TestDataSchema>;
export type DataForVatPrediction = z.infer<typeof DataForVatPredictionSchema>;
