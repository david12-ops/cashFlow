import { z } from "zod";

export const InvoiceItemSchema = z.object({
  dueDate: z.date(),
  amountCze: z.number(),
  amountPaidCze: z.number(),
  paymentDelay: z.number().nullable(),
});

export const InvoicesDataSchema = z.array(InvoiceItemSchema);

export const AlgorithmSESDataSchema = z.object({
  alpha: z.number(),
  aic: z.number(),
});

export const DataForInvoicePredictionSchema = z.object({
  data: InvoicesDataSchema,
  excludetData: InvoicesDataSchema,
  trainingData: InvoicesDataSchema,
  testData: InvoicesDataSchema,
  algorithmParams: AlgorithmSESDataSchema,
});

export type InvoiceDataItem = z.infer<typeof InvoiceItemSchema>;
export type InvoicesData = z.infer<typeof InvoicesDataSchema>;
export type AlgorithmSESData = z.infer<typeof AlgorithmSESDataSchema>;
export type DataForInvoicePrediction = z.infer<
  typeof DataForInvoicePredictionSchema
>;
