import { z } from "zod";

export const InvoiceItemSchema = z.object({
  DueDate: z.date(),
  AmountCze: z.number(),
  AmountPaidCze: z.number(),
  PaymentDelay: z.number().nullable(),
});

export const InvoicesDataSchema = z.array(InvoiceItemSchema);

export const AlgorithmSESParamsSchema = z.object({
  alpha: z.number(),
  aic: z.number(),
});

export const PredictionSESdataSchema = z.object({
  params: z.object({
    smoothedValues: z.array(z.number()),
    rezidua: z.array(z.number()),
  }),
  values: z.array(z.object({ date: z.string(), value: z.number() })),
});

export const DataForInvoicePredictionSchema = z.object({
  data: InvoicesDataSchema,
  excludetData: InvoicesDataSchema,
  aggregatedTrainingData: z.array(z.number()),
  aggregatedTestData: z.array(z.number()),
  algorithmParams: AlgorithmSESParamsSchema,
  predictionsData: z.object({
    countOfFutureMonthsToPredict: z.number(),
    data: PredictionSESdataSchema,
  }),
});

export type InvoiceDataItem = z.infer<typeof InvoiceItemSchema>;
export type InvoicesData = z.infer<typeof InvoicesDataSchema>;
export type AlgorithmSESParams = z.infer<typeof AlgorithmSESParamsSchema>;
export type PredictionSESdata = z.infer<typeof PredictionSESdataSchema>;
export type DataForInvoicePrediction = z.infer<
  typeof DataForInvoicePredictionSchema
>;
