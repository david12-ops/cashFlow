import {
  DataForSSEbestAplha,
  PredictionData,
  LoansData,
  DataForHoltBestParams,
  DataForHoltWinterBestParams,
  IntervalData,
  Statistics,
  DataForLoanPrediction,
  AlgorithmsParams,
} from "@/zod-schemas";
import {
  computeConfidenceIntervals,
  createStatitics,
} from "./statisticsFunctions";
import { UsedDataLoans } from "./classes";

function prepareLoanData(): LoansData {
  const loanData: LoansData = [];

  const startYear = 2021;
  const endYear = 2025;

  const loans = [];

  for (let i = 0; i < 100; i++) {
    loans.push({
      creditNumber: 1200451 + i,
      amount: [3000, 5500, 4200, 7500, 12000][Math.floor(Math.random() * 5)],
      startMonth: Math.floor(Math.random() * 12) + 1,
    });
  }

  for (let loanIndex = 0; loanIndex < loans.length; loanIndex++) {
    const loan = loans[loanIndex];

    const startDate = new Date(startYear, loan.startMonth - 1, 15);

    let paymentNumber = 1;
    let nonPayerDelay = 0;

    const referenceDate = new Date(2025, 11, 31);

    for (let year = startYear; year <= endYear; year++) {
      for (let month = 0; month < 12; month++) {
        const dueDate = new Date(year, month, 15);

        if (dueDate < startDate) {
          continue;
        }

        if (dueDate > referenceDate) {
          loanData.push({
            creditNumber: loan.creditNumber,
            paymentNumber,
            dueDate,
            delay: null,
            amount: loan.amount,
            amountPaid: 0,
          });

          paymentNumber++;
          continue;
        }

        /*
         * First 59 loans
         * Done loans
         */
        if (loanIndex < 60) {
          const endMonth = loanIndex % 12;

          if (year > 2024 || (year === 2024 && month > endMonth)) {
            continue;
          }
        }

        /*
         * Loans 60-79
         * Paid normally and in last period
         * Stopped paying back
         */
        const isNonPayer =
          loanIndex >= 60 && loanIndex < 80 && year === 2025 && month >= 5;

        // Season coefficient
        const seasonality = Math.sin((2 * Math.PI * month) / 12);

        const amountCzeWithSeasonality = loan.amount * (1 + 0.3 * seasonality);

        let amountPaid: number;
        let delay: number | null;

        if (isNonPayer) {
          /*
           * Non-payer:
           * installment is not paid and the delay
           * is longer than a month.
           */

          amountPaid = 0;
          nonPayerDelay += 30;
          delay = nonPayerDelay;
        } else {
          /*
           * Regular payer:
           */
          amountPaid = amountCzeWithSeasonality;
          delay = Math.random() < 0.8 ? 0 : Math.floor(Math.random() * 10) + 1;
        }

        loanData.push({
          creditNumber: loan.creditNumber,
          paymentNumber,
          dueDate: dueDate,
          delay,
          amount: loan.amount,
          amountPaid,
        });

        paymentNumber++;
      }
    }
  }
  return loanData;
}

function aggregateLoansDelayByMonth(data: LoansData): number[] {
  const monthlyValues = new Map<string, number[]>();

  data.forEach(item => {
    if (item.delay == null) {
      return;
    }

    const paymentDelayDate = new Date(item.dueDate);

    const key = `${paymentDelayDate.getFullYear()} - ${paymentDelayDate.getMonth()}`;

    if (!monthlyValues.has(key)) {
      monthlyValues.set(key, []);
    }

    monthlyValues.get(key)!.push(item.delay);
  });

  return Array.from(monthlyValues.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, values]) => {
      return values.reduce((acc, val) => acc + val, 0) / values.length;
    });
}

function computeAIC(rezidua: number[], paramsCount: number): number {
  const k = paramsCount; // We'll see here after optimization, how many parameters we have in the model

  const sse = rezidua.map(numb => numb * numb);
  const sseSum = sse.reduce((acc, val) => acc + val, 0);

  return rezidua.length * Math.log(sseSum / rezidua.length) + 2 * k;
}

// SES
// Picked by MAE
function pickBestAlphaByMAE(aggregatedData: number[]): number {
  let bestAlpha = 0;
  let bestErrorValue = Number.MAX_VALUE;

  for (let alpha = 0.1; alpha < 1; alpha += 0.1) {
    let totalError = 0;
    const smoothValues = exponentialSmoothing(aggregatedData, alpha);

    for (let x = 0; x < aggregatedData.length; x++) {
      const errorValue = Math.abs(
        aggregatedData[x] - smoothValues.smoothedValues[x]
      );
      totalError += errorValue;
    }

    const avaregeError = totalError / aggregatedData.length;

    if (avaregeError < bestErrorValue) {
      bestAlpha = alpha;
      bestErrorValue = avaregeError;
    }
  }

  return bestAlpha;
}

function pickBestAlphaByAIC(aggregatedData: number[]): {
  bestAlpha: number;
  bestAic: number;
} {
  let values: DataForSSEbestAplha = {
    smoothedValues: [],
    rezidua: [],
  };

  let bestAlpha = 0;

  let bestAic = Number.MAX_VALUE;

  for (let alpha = 0.1; alpha < 1; alpha += 0.1) {
    values = exponentialSmoothing(aggregatedData, alpha);

    const aic = computeAIC(values.rezidua, 1);

    if (aic < bestAic) {
      bestAlpha = alpha;
      bestAic = aic;
    }
  }

  return { bestAic, bestAlpha };
}

function exponentialSmoothing(
  data: number[],
  alpha: number
): { smoothedValues: number[]; rezidua: number[] } {
  const smoothedValues: number[] = [];
  const rezidua: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      smoothedValues[i] = data[i];
    } else {
      const previousSmoothValue = smoothedValues[i - 1];

      rezidua.push(data[i] - previousSmoothValue);

      const newSmoothValue =
        alpha * data[i] + (1 - alpha) * previousSmoothValue;
      smoothedValues[i] = newSmoothValue;
    }
  }

  return { smoothedValues, rezidua };
}

function sesPrediction(
  countOfFutureMonths: number,
  lastDate: Date,
  sesData: { smoothedValues: number[]; rezidua: number[] }
): PredictionData {
  const year = lastDate.getFullYear();
  const month = lastDate.getMonth();

  const predictionData: PredictionData = [];
  const lastSmoothedValue =
    sesData.smoothedValues[sesData.smoothedValues.length - 1];

  for (let i = 1; i <= countOfFutureMonths; i++) {
    const date = new Date(year, month + i);

    predictionData.push({
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      value: lastSmoothedValue,
    });
  }

  return predictionData;
}

// Holt's exponential smoothing
function pickBestHoltParameters(aggregatedData: number[]): {
  bestAlpha: number;
  bestBeta: number;
  bestAic: number;
} {
  let values: DataForHoltBestParams = {
    alpha: 0,
    beta: 0,
    holtValue: { level: 0, trend: 0, rezidua: [] },
  };

  let bestParams = {
    bestAlpha: 0,
    bestBeta: 0,
  };

  let bestAic = Number.MAX_VALUE;

  for (let alpha = 0.1; alpha < 1; alpha += 0.1) {
    for (let beta = 0.1; beta < 1; beta += 0.1) {
      const holtValue = holtExponentialSmoothing(aggregatedData, alpha, beta);
      values = { alpha, beta, holtValue };

      const aic = computeAIC(values.holtValue.rezidua, 2);

      if (aic < bestAic) {
        bestAic = aic;
        bestParams = { bestAlpha: values.alpha, bestBeta: values.beta };
      }
    }
  }

  return { ...bestParams, bestAic };
}

function holtExponentialSmoothing(
  aggregatedData: number[],
  alpha: number,
  beta: number
): { level: number; trend: number; rezidua: number[] } {
  const rezidua: number[] = [];

  let currentLevel = 0;
  let trend = 0;

  for (let i = 0; i < aggregatedData.length; i++) {
    if (i === 0) {
      currentLevel = aggregatedData[i];

      if (aggregatedData.length > 1) {
        trend = aggregatedData[i + 1] - aggregatedData[i];
      } else {
        trend = 0;
      }
    } else {
      rezidua.push(aggregatedData[i] - (currentLevel + trend));

      const previousLevel = currentLevel;
      const previousTrend = trend;

      currentLevel =
        alpha * aggregatedData[i] +
        (1 - alpha) * (previousLevel + previousTrend);
      trend =
        beta * (currentLevel - previousLevel) + (1 - beta) * previousTrend;
    }
  }

  return {
    level: currentLevel,
    trend,
    rezidua,
  };
}

// Holt-Winters
function pickBestHoltWintersParameters(aggregatedData: number[]): {
  bestAlpha: number;
  bestBeta: number;
  bestGama: number;
  bestAic: number;
} {
  let values: DataForHoltWinterBestParams = {
    alpha: 0,
    beta: 0,
    gama: 0,
    holtWinterValue: { level: 0, trend: 0, seasonalValues: [], rezidua: [] },
  };

  let bestParams = {
    bestAlpha: 0,
    bestBeta: 0,
    bestGama: 0,
  };

  let bestAic = Number.MAX_VALUE;

  for (let alpha = 0.1; alpha < 1; alpha += 0.1) {
    for (let beta = 0.1; beta < 1; beta += 0.1) {
      for (let gama = 0.1; gama < 1; gama += 0.1) {
        const holtWinterValue = holtWintersExponentialSmoothing(
          aggregatedData,
          alpha,
          beta,
          gama
        );

        values = {
          alpha,
          beta,
          gama,
          holtWinterValue,
        };

        const aic = computeAIC(values.holtWinterValue.rezidua, 3);

        if (bestAic < aic) {
          bestAic = aic;
          bestParams = {
            bestAlpha: values.alpha,
            bestBeta: values.beta,
            bestGama: values.gama,
          };
        }
      }
    }
  }

  return { ...bestParams, bestAic };
}

function computeSeasonality(aggregatedData: number[]): number[] {
  if (aggregatedData.length < 12) {
    throw new Error("Holt-Winters vyžaduje alespoň 12 hodnot pro sezónnost.");
  }

  const valuesOfFirstYear = aggregatedData.slice(0, 12);
  const averageValueOfFirstYear =
    valuesOfFirstYear.reduce((acc, val) => acc + val, 0) /
    valuesOfFirstYear.length;

  const seasonalityValues: number[] = [];

  for (let i = 0; i < valuesOfFirstYear.length; i++) {
    seasonalityValues[i] = valuesOfFirstYear[i] - averageValueOfFirstYear;
  }

  return seasonalityValues;
}

function holtWintersExponentialSmoothing(
  aggregatedData: number[],
  alpha: number,
  beta: number,
  gama: number
): {
  level: number;
  trend: number;
  seasonalValues: number[];
  rezidua: number[];
} {
  const rezidua: number[] = [];

  let currentLevel = 0;
  let trend =
    aggregatedData.length > 11
      ? (aggregatedData[11] - aggregatedData[0]) / 11
      : 0;

  const seasonalityValues = computeSeasonality(aggregatedData);

  for (let i = 0; i < aggregatedData.length; i++) {
    const seasonalIndex = i % 12;

    if (i === 0) {
      currentLevel = aggregatedData[i];
      continue;
    }

    const previousLevel = currentLevel;
    const previousTrend = trend;

    const previousSeasonalValue = seasonalityValues[seasonalIndex];

    const prediction = previousLevel + previousTrend + previousSeasonalValue;

    rezidua.push(aggregatedData[i] - prediction);

    currentLevel =
      alpha * (aggregatedData[i] - previousSeasonalValue) +
      (1 - alpha) * (previousLevel + previousTrend);
    trend = beta * (currentLevel - previousLevel) + (1 - beta) * previousTrend;
    const newSeasonalValue =
      gama * (aggregatedData[i] - currentLevel) +
      (1 - gama) * previousSeasonalValue;

    seasonalityValues[seasonalIndex] = newSeasonalValue;
  }

  return {
    level: currentLevel,
    trend,
    seasonalValues: seasonalityValues,
    rezidua,
  };
}

function holtPrediction(
  countOfFutureMonths: number,
  lastDate: Date,
  type: "holt" | "holt-winter",
  lastLevelAndTrend?: { level: number; trend: number },
  lastLevelTrendSeasonalVal?: {
    level: number;
    trend: number;
    seasonalValues: number[];
  }
): PredictionData {
  let predictionData: PredictionData = [];

  const year = lastDate.getFullYear();
  const month = lastDate.getMonth();

  if (type === "holt" && lastLevelAndTrend) {
    const { level, trend } = lastLevelAndTrend;

    for (let i = 1; i <= countOfFutureMonths; i++) {
      const date = new Date(year, month + i);
      const value = level + i * trend;

      predictionData.push({
        date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
        value,
      });
    }
  } else if (type === "holt-winter" && lastLevelTrendSeasonalVal) {
    for (let i = 1; i <= countOfFutureMonths; i++) {
      const date = new Date(year, month + i);
      const seasonalValue =
        lastLevelTrendSeasonalVal.seasonalValues[(month - 1 + i) % 12];

      const value =
        lastLevelTrendSeasonalVal.level +
        i * lastLevelTrendSeasonalVal.trend +
        seasonalValue;

      predictionData.push({
        date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
        value,
      });
    }
  } else {
    console.error("Unknown holt algorithm type -" + `${type}`);
    predictionData = [];
  }

  return predictionData;
}

function pickbestPredictionModel(
  values: { model: "holt" | "holt-winter" | "ses"; aicValue: number }[]
): "holt" | "holt-winter" | "ses" {
  // reduce can be used there too
  // const indexOfBestModel = values.reduce(
  //   (best, current, currentIndex) =>
  //     current.aicValue < values[best].aicValue ? currentIndex : best,
  //   0
  // );

  // return values[indexOfBestModel].model;

  const aics = values.map(itm => {
    return Number(itm.aicValue);
  });

  let bestModel: "holt" | "holt-winter" | "ses" = "ses";

  switch (aics.indexOf(Math.min(...aics))) {
    case 0:
      bestModel = values[0].model;
      break;
    case 1:
      bestModel = values[1].model;
      break;
    case 2:
      bestModel = values[2].model;
      break;
  }

  return bestModel;
}

function prepareDataToAlgorithm(data: LoansData): {
  trainingData: LoansData;
  testData: LoansData;
} {
  const years = Array.from(
    new Set([
      ...data.map(item => {
        return item.dueDate.getFullYear();
      }),
    ])
  ).sort((a, b) => a - b);

  const secondToLastYear = years[years.length - 2];
  const lastYear = years[years.length - 1];

  const trainingData = data.filter(
    item => item.dueDate.getFullYear() <= secondToLastYear
  );

  const testData = data.filter(item => item.dueDate.getFullYear() === lastYear);

  return { trainingData, testData };
}

const getPredictionData = (data: LoansData): LoansData => {
  const creditNumbersWithLongDelay = new Set(
    data
      .filter(item => item.delay != null && item.delay > 30)
      .map(item => item.creditNumber)
  );

  return data.filter(
    item => !creditNumbersWithLongDelay.has(item.creditNumber)
  );
};

export default function providedLoansPrediction():
  | {
      usedData: DataForLoanPrediction;
      confidenceIntervals: IntervalData;
      statistics: Statistics;
    }
  | undefined {
  let data: LoansData = prepareLoanData();
  data = getPredictionData(data);

  const { trainingData, testData } = prepareDataToAlgorithm(data);

  const trainingDates = trainingData.map(item => item.dueDate);
  const sortedTrainingDates = [...trainingDates].sort(
    (a, b) => a.getTime() - b.getTime()
  );

  const aggtrainingData = aggregateLoansDelayByMonth(trainingData);
  const aggtestData = aggregateLoansDelayByMonth(testData);

  const aics: { model: "holt" | "holt-winter" | "ses"; aicValue: number }[] =
    [];

  const countOfFutureMonthsToPredict = 12;

  // SES
  const bestAlphaPickedByMAE = pickBestAlphaByMAE(aggtrainingData);
  console.log("bestAlphaPickedByMAE SES " + bestAlphaPickedByMAE);
  const bestSESparams = pickBestAlphaByAIC(aggtrainingData);
  const smoothedDataBySES = exponentialSmoothing(
    aggtrainingData,
    bestSESparams.bestAlpha
  );

  aics.push({ model: "ses", aicValue: bestSESparams.bestAic });

  const predictionSES = sesPrediction(
    countOfFutureMonthsToPredict,
    sortedTrainingDates[sortedTrainingDates.length - 2],
    smoothedDataBySES
  );

  // Holt
  const bestHoltParams = pickBestHoltParameters(aggtrainingData);
  const smoothedDataByHolt = holtExponentialSmoothing(
    aggtrainingData,
    bestHoltParams.bestAlpha,
    bestHoltParams.bestBeta
  );

  aics.push({ model: "holt", aicValue: bestHoltParams.bestAic });

  const predictionHolt = holtPrediction(
    countOfFutureMonthsToPredict,
    sortedTrainingDates[sortedTrainingDates.length - 2],
    "holt",
    {
      level: smoothedDataByHolt.level,
      trend: smoothedDataByHolt.trend,
    }
  );

  // Holt-Winter
  const bestHoltWinterParams = pickBestHoltWintersParameters(aggtrainingData);
  const smoothedDataByHoltWinter = holtWintersExponentialSmoothing(
    aggtrainingData,
    bestHoltWinterParams.bestAlpha,
    bestHoltWinterParams.bestBeta,
    bestHoltWinterParams.bestGama
  );

  aics.push({ model: "holt-winter", aicValue: bestHoltWinterParams.bestAic });

  const predictionHoltWinter = holtPrediction(
    countOfFutureMonthsToPredict,
    sortedTrainingDates[sortedTrainingDates.length - 2],
    "holt-winter",
    undefined,
    {
      level: smoothedDataByHoltWinter.level,
      trend: smoothedDataByHoltWinter.trend,
      seasonalValues: smoothedDataByHoltWinter.seasonalValues,
    }
  );

  const algorithmParams: AlgorithmsParams = [];
  algorithmParams.push(
    { model: "ses", alpha: bestSESparams.bestAlpha },
    {
      model: "holt",
      params: {
        alpha: bestHoltParams.bestAlpha,
        beta: bestHoltParams.bestBeta,
      },
    },
    {
      model: "holt-winter",
      params: {
        alpha: bestHoltWinterParams.bestAlpha,
        beta: bestHoltWinterParams.bestBeta,
        gama: bestHoltWinterParams.bestGama,
      },
    }
  );

  const savedUsedData = new UsedDataLoans(
    data,
    trainingData,
    testData,
    aics,
    algorithmParams
  );

  const bestModel = pickbestPredictionModel(aics);

  let confidenceIntervals: IntervalData = [];

  const sesConfidenceIntervals = computeConfidenceIntervals(
    smoothedDataBySES.rezidua,
    predictionSES
  );

  const holtWinterConfidenceIntervals = computeConfidenceIntervals(
    smoothedDataByHoltWinter.rezidua,
    predictionHoltWinter
  );

  const holtConfidenceIntervals = computeConfidenceIntervals(
    smoothedDataByHolt.rezidua,
    predictionHolt
  );

  if (bestModel === "holt") {
    confidenceIntervals = holtConfidenceIntervals;

    savedUsedData.setOtherPredictionsData({
      sesModel: {
        countOfFutureMonthsToPredict,
        confidenceIntervals: sesConfidenceIntervals,
        statistics: createStatitics(aggtestData, sesConfidenceIntervals),
      },
      holtWinterModel: {
        countOfFutureMonthsToPredict,
        confidenceIntervals: holtWinterConfidenceIntervals,
        statistics: createStatitics(aggtestData, holtWinterConfidenceIntervals),
      },
      holtModel: null,
    });
  }

  if (bestModel === "holt-winter") {
    confidenceIntervals = holtWinterConfidenceIntervals;

    savedUsedData.setOtherPredictionsData({
      sesModel: {
        countOfFutureMonthsToPredict,
        confidenceIntervals: sesConfidenceIntervals,
        statistics: createStatitics(aggtestData, sesConfidenceIntervals),
      },
      holtWinterModel: null,
      holtModel: {
        countOfFutureMonthsToPredict,
        confidenceIntervals: holtConfidenceIntervals,
        statistics: createStatitics(aggtestData, holtConfidenceIntervals),
      },
    });
  }

  if (bestModel === "ses") {
    confidenceIntervals = sesConfidenceIntervals;

    savedUsedData.setOtherPredictionsData({
      sesModel: null,
      holtWinterModel: {
        countOfFutureMonthsToPredict,
        confidenceIntervals: holtWinterConfidenceIntervals,
        statistics: createStatitics(aggtestData, holtWinterConfidenceIntervals),
      },
      holtModel: {
        countOfFutureMonthsToPredict,
        confidenceIntervals: holtConfidenceIntervals,
        statistics: createStatitics(aggtestData, holtConfidenceIntervals),
      },
    });
  }

  const usedData: DataForLoanPrediction = {
    data: savedUsedData.getData(),
    trainingData: savedUsedData.getTrainingData(),
    testData: savedUsedData.getTestData(),
    aics,
    algorithmsParams: savedUsedData.getAlgorithmsParams(),
    predictionsData: savedUsedData.getOtherPredictionsData(),
  };

  return {
    usedData,
    confidenceIntervals,
    statistics: createStatitics(aggtestData, confidenceIntervals),
  };
}
