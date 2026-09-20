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

export const PredictionClusterResultSchema = z.object({
  predictedValues: z.array(
    z.object({
      date: z.string(),
      value: z.number(),
    })
  ),
  predictionValues: WagesDataSchema,
});

export const PredictionClusterResultsSchema = z.array(
  PredictionClusterResultSchema
);

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

export const IterationsKmeansDataSchema = z.array(
  z.object({
    values: AmountsPairedToCentroidSchema,
    clusteredData: ClusterSchema,
    oldCentroids: z.array(z.number()),
    newCentroids: z.array(z.number()),
  })
);

export const DataForWagePredictionSchema = z.object({
  data: WagesDataSchema,
  aggregatedTrainingData: z.array(z.number()),
  aggregatedTestData: z.array(z.number()),
  optimalK: z.number(),
  iterationsKmeansData: IterationsKmeansDataSchema,
  predictedClusterAmounts: PredictionClusterResultsSchema,
});

export type Currency = z.infer<typeof CurrencySchema>;
export type WageDataItem = z.infer<typeof WageItemSchema>;
export type WagesData = z.infer<typeof WagesDataSchema>;
export type AmountsPairedToCentroid = z.infer<
  typeof AmountsPairedToCentroidSchema
>;
export type Cluster = z.infer<typeof ClusterSchema>;
export type PredictionClusterResult = z.infer<
  typeof PredictionClusterResultSchema
>;
export type PredictionClusterResults = z.infer<
  typeof PredictionClusterResultsSchema
>;
export type CurrencyConvertMap = z.infer<typeof CurrencyConvertMapSchema>;
export type EchangeRates = z.infer<typeof EchangeRatesSchema>;
export type IterationsKmeansData = z.infer<typeof IterationsKmeansDataSchema>;
export type DataForWagePrediction = z.infer<typeof DataForWagePredictionSchema>;
