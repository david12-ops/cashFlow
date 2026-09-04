import { z } from "zod";

export const CurrencySchema = z.enum(["CZK", "EUR", "USD", "GBP", "PLN"]);

export const WageItemSchema = z.object({
  DimDateId: z.number(),
  TransactionDate: z.date(),
  BaseAmount: z.number(),
  Account: z.string(),
  Division: z.number(),
  Currency: CurrencySchema,
});

export const WagesDataSchema = z.array(WageItemSchema);

export const AmountsPairedToCentroidSchema = z.array(
  z.object({
    WageItem: WageItemSchema,
    CentroidIndex: z.number(),
    Distance: z.number(),
  })
);

export const ClusterSchema = z.record(z.number(), z.array(WageItemSchema));

export const PredictionWageResultSchema = z.object({
  Centroids: z.array(z.number()),
  Cluster: ClusterSchema,
});

export const CurrencyConvertMapSchema = z.record(
  CurrencySchema,
  z.array(
    z.object({
      Currency: CurrencySchema,
      Value: z.number(),
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
