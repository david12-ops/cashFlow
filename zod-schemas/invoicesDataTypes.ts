import { z } from "zod";

export const InvoiceItemSchema = z.object({
  DueDate: z.date(),
  AmountCze: z.number(),
  AmountPaidCze: z.number(),
  PaymentDelay: z.number().nullable(),
});

export const InvoicesDataSchema = z.array(InvoiceItemSchema);

export const DataForSSEbestAplhaSchema = z.object({
  smoothedValues: z.array(z.number()),
  rezidua: z.array(z.number()),
});

export const PredictionDataSchema = z.array(
  z.object({ date: z.string(), value: z.number() })
);

export const IntervalDataSchema = z.array(
  z.object({
    date: z.string(),
    lowerBound: z.number(),
    prediction: z.number(),
    upperBound: z.number(),
  })
);

export type InvoiceDataItem = z.infer<typeof InvoiceItemSchema>;
export type InvoicesData = z.infer<typeof InvoicesDataSchema>;
export type DataForSSEbestAplha = z.infer<typeof DataForSSEbestAplhaSchema>;
export type PredictionData = z.infer<typeof PredictionDataSchema>;
export type IntervalData = z.infer<typeof IntervalDataSchema>;
