import { z } from "zod";

export const WageItemSchema = z.object({
  DimDateId: z.number(),
  TransactionDate: z.date(),
  BaseAmount: z.number(),
  Account: z.string(),
  Division: z.number(),
  Currency: z.string(),
});

export const WageDataSchema = z.array(WageItemSchema);

export type WageDataItem = z.infer<typeof WageItemSchema>;
export type WageData = z.infer<typeof WageDataSchema>;

// TYPY POUZITE V wageCostsPrediction
export const AmountsPairedToCentroidSchema = z.array(
  z.object({
    wageItem: WageItemSchema,
    centroidIndex: z.number(),
    distance: z.number(),
  })
);

export const ClusterSchema = z.record(z.number(), z.array(WageItemSchema));

export const PredictionWageResultSchema = z.object({
  centroids: z.array(z.number()),
  cluster: ClusterSchema,
});

export type AmountsPairedToCentroid = z.infer<
  typeof AmountsPairedToCentroidSchema
>;

export type Cluster = z.infer<typeof ClusterSchema>;

export type PredictionWageResult = z.infer<typeof PredictionWageResultSchema>;
