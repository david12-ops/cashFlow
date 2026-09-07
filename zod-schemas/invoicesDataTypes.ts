import { z } from "zod";

export const InvoiceItemSchema = z.object({
  DueDate: z.date(),
  AmountCze: z.number(),
  AmountPaidCze: z.number(),
  PaymentDelay: z.number().nullable(),
});

export const InvoicesDataSchema = z.array(InvoiceItemSchema);

export const ParamsFromHoltAlgorithmSchema = z.object({
  level: z.number(),
  trend: z.number(),
  rezidua: z.array(z.number()),
});

export const DataForHoltBestParamsSchema = z.object({
  alpha: z.number(),
  beta: z.number(),
  holtValue: ParamsFromHoltAlgorithmSchema,
});

export const ParamsFromHoltWinterAlgorithmSchema = z.object({
  level: z.number(),
  trend: z.number(),
  seasonalVal: z.number(),
  rezidua: z.array(z.number()),
});

export const DataForHoltWinterBestParamsSchema = z.object({
  alpha: z.number(),
  beta: z.number(),
  gama: z.number(),
  holtWinterValue: ParamsFromHoltWinterAlgorithmSchema,
});

export const HaltPredictionDataSchema = z.array(
  z.object({ date: z.string(), value: z.number() })
);

export type InvoiceDataItem = z.infer<typeof InvoiceItemSchema>;
export type InvoicesData = z.infer<typeof InvoicesDataSchema>;
export type ParamsFromHoltAlgorithm = z.infer<
  typeof ParamsFromHoltAlgorithmSchema
>;
export type DataForHoltBestParams = z.infer<typeof DataForHoltBestParamsSchema>;
export type HaltPredictionData = z.infer<typeof HaltPredictionDataSchema>;
export type ParamsFromHoltWinterAlgorithm = z.infer<
  typeof ParamsFromHoltWinterAlgorithmSchema
>;
export type DataForHoltWinterBestParams = z.infer<
  typeof DataForHoltWinterBestParamsSchema
>;
