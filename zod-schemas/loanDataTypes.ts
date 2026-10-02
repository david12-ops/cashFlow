import { z } from "zod";
import { IntervalDataSchema, StatisticsSchema } from ".";

export const LoanItemSchema = z.object({
  creditNumber: z.number(),
  paymentNumber: z.number(),
  dueDate: z.date(),
  delay: z.number().nullable(),
  amount: z.number(),
  amountPaid: z.number(),
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

export const PredictionsDataSchema = z.object({
  sesModel: z
    .object({
      countOfFutureMonthsToPredict: z.number(),
      confidenceIntervals: IntervalDataSchema,
      statistics: StatisticsSchema,
    })
    .nullable(),
  holtModel: z
    .object({
      countOfFutureMonthsToPredict: z.number(),
      confidenceIntervals: IntervalDataSchema,
      statistics: StatisticsSchema,
    })
    .nullable(),
  holtWinterModel: z
    .object({
      countOfFutureMonthsToPredict: z.number(),
      confidenceIntervals: IntervalDataSchema,
      statistics: StatisticsSchema,
    })
    .nullable(),
});

export const DataForLoanPredictionSchema = z.object({
  data: LoansDataSchema,
  trainingData: LoansDataSchema,
  testData: LoansDataSchema,
  aics: AicsDataSchema,
  algorithmsParams: AlgorithmsParamsSchema,
  predictionsData: PredictionsDataSchema,
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
