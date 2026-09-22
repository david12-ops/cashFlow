import { z } from "zod";
export * from "./dphDataTypes";
export * from "./invoicesDataTypes";
export * from "./loanDataTypes";
export * from "./wageDataTypes";

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

export const StatisticsSchema = z.object({
  valueMAE: z.number(),
  valueRMSE: z.number(),
  valueMAPE: z.number().nullable(),
  valueMRE: z.number().nullable(),
});

export const DataForSSEbestAplhaSchema = z.object({
  smoothedValues: z.array(z.number()),
  rezidua: z.array(z.number()),
});

export type PredictionData = z.infer<typeof PredictionDataSchema>;
export type IntervalData = z.infer<typeof IntervalDataSchema>;
export type Statistics = z.infer<typeof StatisticsSchema>;
export type DataForSSEbestAplha = z.infer<typeof DataForSSEbestAplhaSchema>;
