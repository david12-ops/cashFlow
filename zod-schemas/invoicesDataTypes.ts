import { z } from "zod";

export const InvoiceItemSchema = z.object({
  DueDate: z.date(),
  AmountCze: z.number(),
  AmountPaidCze: z.number(),
  PaymentDelay: z.number(),
});

export const InvoicesDataSchema = z.array(InvoiceItemSchema);

export type InvoiceDataItem = z.infer<typeof InvoiceItemSchema>;
export type InvoicesData = z.infer<typeof InvoicesDataSchema>;
