import { z } from "zod";

export const CurrencySchema = z.enum(["CZK", "EUR", "USD", "GBP", "PLN"]);

export const WageItemSchema = z.object({
  dimDateId: z.number(),
  transactionDate: z.date(),
  baseAmount: z.number(),
  account: z.string(),
  division: z.number(),
  currency: CurrencySchema,
});

export const WagesDataSchema = z.array(WageItemSchema);

export const AmountsPairedToCentroidSchema = z.array(
  z.object({
    wageItem: WageItemSchema,
    centroidIndex: z.number(),
    distance: z.number(),
  })
);

export const ClusterSchema = z.record(z.number(), z.array(WageItemSchema));

export const PredictionWageResultSchema = z.object({
  predictedValue: z.number(),
  predictionValues: WagesDataSchema,
});

export const CurrencyConvertMapSchema = z.record(
  CurrencySchema,
  z.array(
    z.object({
      currency: CurrencySchema,
      value: z.number(),
    })
  )
);

export const EchangeRatesSchema = z.record(
  z.number(),
  CurrencyConvertMapSchema
);

export type Currency = z.infer<typeof CurrencySchema>;
export type WageDataItem = z.infer<typeof WageItemSchema>;
export type WagesData = z.infer<typeof WagesDataSchema>;
export type AmountsPairedToCentroid = z.infer<
  typeof AmountsPairedToCentroidSchema
>;
export type Cluster = z.infer<typeof ClusterSchema>;
export type PredictionWageResult = z.infer<typeof PredictionWageResultSchema>;
export type CurrencyConvertMap = z.infer<typeof CurrencyConvertMapSchema>;
export type EchangeRates = z.infer<typeof EchangeRatesSchema>;
