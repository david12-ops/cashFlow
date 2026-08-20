import { z } from "zod";

export const WageItemSchema = z.object({
  DimDateId: z.number(),
  TransactionDate: z.date(),
  BaseAmount: z.number(),
  Account: z.string(),
  Division: z.number(),
  Currency: z.string(),
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

export type AmountsPairedToCentroid = z.infer<
  typeof AmountsPairedToCentroidSchema
>;

export type WageDataItem = z.infer<typeof WageItemSchema>;
export type WagesData = z.infer<typeof WagesDataSchema>;
export type Cluster = z.infer<typeof ClusterSchema>;
export type PredictionWageResult = z.infer<typeof PredictionWageResultSchema>;
