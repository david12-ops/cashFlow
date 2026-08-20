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

export type LoanDataItem = z.infer<typeof LoanItemSchema>;
export type LoansData = z.infer<typeof LoansDataSchema>;
