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

export const ParamsFromHoltAlgorithmSchema = z.object({
  level: z.number(),
  trend: z.number(),
  rezidua: z.array(z.number()),
});

export const DataForHoltBestParamsSchema = z.object({
  alpha: z.number(),
  beta: z.number(),
  holtValue: ParamsFromHoltAlgorithmSchema,
});

export const ParamsFromHoltWinterAlgorithmSchema = z.object({
  level: z.number(),
  trend: z.number(),
  seasonalValues: z.array(z.number()),
  rezidua: z.array(z.number()),
});

export const DataForHoltWinterBestParamsSchema = z.object({
  alpha: z.number(),
  beta: z.number(),
  gama: z.number(),
  holtWinterValue: ParamsFromHoltWinterAlgorithmSchema,
});

export const AicsDataSchema = z.array(
  z.object({
    model: z.enum(["holt", "holt-winter", "ses"]),
    aicValue: z.number(),
  })
);

export const AlgorithmsParamsSchema = z.array(
  z.discriminatedUnion("model", [
    z.object({
      model: z.literal("ses"),
      alpha: z.number(),
    }),
    z.object({
      model: z.literal("holt"),
      params: z.object({
        alpha: z.number(),
        beta: z.number().nullable(),
      }),
    }),
    z.object({
      model: z.literal("holt-winter"),
      params: z.object({
        alpha: z.number(),
        beta: z.number(),
        gama: z.number(),
      }),
    }),
  ])
);

export const PredictionsDataSchema = z.array(
  z.discriminatedUnion("model", [
    z.object({
      model: z.literal("ses"),
      params: z.object({
        smoothedValues: z.array(z.number()),
        rezidua: z.array(z.number()),
      }),
      values: z.array(z.object({ date: z.string(), value: z.number() })),
    }),
    z.object({
      model: z.literal("holt"),
      params: z.object({
        level: z.number(),
        trend: z.number(),
        rezidua: z.array(z.number()),
      }),
      values: z.array(z.object({ date: z.string(), value: z.number() })),
    }),
    z.object({
      model: z.literal("holt-winter"),
      params: z.object({
        level: z.number(),
        trend: z.number(),
        seasonalValues: z.array(z.number()),
        rezidua: z.array(z.number()),
      }),
      values: z.array(z.object({ date: z.string(), value: z.number() })),
    }),
  ])
);

export const DataForLoanPredictionSchema = z.object({
  data: LoansDataSchema,
  aggregatedTrainingData: z.array(z.number()),
  aggregatedTestData: z.array(z.number()),
  aics: AicsDataSchema,
  algorithmsParams: AlgorithmsParamsSchema,
  predictionsData: z.object({
    countOfFutureMonthsToPredict: z.number(),
    data: PredictionsDataSchema,
  }),
});

export type LoanDataItem = z.infer<typeof LoanItemSchema>;
export type LoansData = z.infer<typeof LoansDataSchema>;
export type ParamsFromHoltAlgorithm = z.infer<
  typeof ParamsFromHoltAlgorithmSchema
>;
export type DataForHoltBestParams = z.infer<typeof DataForHoltBestParamsSchema>;
export type ParamsFromHoltWinterAlgorithm = z.infer<
  typeof ParamsFromHoltWinterAlgorithmSchema
>;
export type DataForHoltWinterBestParams = z.infer<
  typeof DataForHoltWinterBestParamsSchema
>;
export type AicsData = z.infer<typeof AicsDataSchema>;
export type AlgorithmsParams = z.infer<typeof AlgorithmsParamsSchema>;
export type PredictionsData = z.infer<typeof PredictionsDataSchema>;
export type DataForLoanPrediction = z.infer<typeof DataForLoanPredictionSchema>;
