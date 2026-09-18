import { z } from "zod";

export const LoanItemSchema = z.object({
  CreditNumber: z.number(),
  PaymentNumber: z.number(),
  DueDate: z.date(),
  Delay: z.number().nullable(),
  Amount: z.number(),
  AmountPaid: z.number(),
});

export const LoansDataSchema = z.array(LoanItemSchema);

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
  seasonalValues: z.array(z.number()),
  rezidua: z.array(z.number()),
});

export const DataForHoltWinterBestParamsSchema = z.object({
  alpha: z.number(),
  beta: z.number(),
  gama: z.number(),
  holtWinterValue: ParamsFromHoltWinterAlgorithmSchema,
});

export type LoanDataItem = z.infer<typeof LoanItemSchema>;
export type LoansData = z.infer<typeof LoansDataSchema>;
export type ParamsFromHoltAlgorithm = z.infer<
  typeof ParamsFromHoltAlgorithmSchema
>;
export type DataForHoltBestParams = z.infer<typeof DataForHoltBestParamsSchema>;
export type ParamsFromHoltWinterAlgorithm = z.infer<
  typeof ParamsFromHoltWinterAlgorithmSchema
>;
export type DataForHoltWinterBestParams = z.infer<
  typeof DataForHoltWinterBestParamsSchema
>;
