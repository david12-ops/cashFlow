import {
  LoansData,
  DataForHoltBestParams,
  DataForHoltWinterBestParams,
  PredictionData,
  IntervalData,
  DataForSSEbestAplha,
} from "../zod-schemas/loanDataTypes";

function prepareLoanData(): LoansData {
  const loanData: LoansData = [];

  const startYear = 2021;
  const endYear = 2025;

  const loans = [
    { CreditNumber: 1200451, Amount: 3000, StartMonth: 1 },
    { CreditNumber: 1200452, Amount: 5500, StartMonth: 3 },
    { CreditNumber: 1200453, Amount: 4200, StartMonth: 6 },
    { CreditNumber: 1200454, Amount: 7500, StartMonth: 9 },
    { CreditNumber: 1200455, Amount: 12000, StartMonth: 2 },
  ];

  for (const loan of loans) {
    const startDate = new Date(startYear, loan.StartMonth - 1, 15);

    for (let year = startYear; year <= endYear; year++) {
      for (let month = 0; month < 12; month++) {
        const dueDate = new Date(year, month, 15);
        let paymentNumber = 1;

        if (dueDate < startDate) {
          continue;
        }

        const paymentType = Math.random();

        let amountPaid: number;
        let delay: number | null;

        if (paymentType < 0.7) {
          // 70 % zaplaceno vcas
          amountPaid = loan.Amount;
          delay = 0;
        } else if (paymentType < 0.9) {
          // 20 % zaplaceno se zpozdenim
          amountPaid = loan.Amount;
          delay = Math.floor(Math.random() * 30) + 1;
        } else if (paymentType < 0.95) {
          // 5 % zaplaceno častečně
          amountPaid = Math.floor(loan.Amount * (0.3 + Math.random() * 0.5));
          delay = Math.floor(Math.random() * 30) + 1;
        } else {
          // 5 % zatim nezaplaceno
          amountPaid = 0;
          delay = null;
        }

        loanData.push({
          CreditNumber: loan.CreditNumber,
          PaymentNumber: paymentNumber,
          DueDate: dueDate,
          Delay: delay,
          Amount: loan.Amount,
          AmountPaid: amountPaid,
        });

        paymentNumber++;
      }
    }
  }
  return loanData;
}

function aggregateInvoicesByMonth(data: LoansData): number[] {
  const monthlyValues = new Map<string, number[]>();

  data.forEach(item => {
    if (item.Delay == null) {
      return;
    }

    const paymentDelayDate = new Date(item.DueDate);

    const key = `${paymentDelayDate.getFullYear()} - ${paymentDelayDate.getMonth()}`;

    if (!monthlyValues.has(key)) {
      monthlyValues.set(key, []);
    }

    monthlyValues.get(key)!.push(item.Delay);
  });

  return Array.from(monthlyValues.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, values]) => {
      return values.reduce((acc, val) => acc + val, 0);
    });
}

function computeAIC(rezidua: number[], paramsCount: number): number {
  const k = paramsCount; // tady jeste uvidime

  const sse = rezidua.map(numb => numb * numb);
  const sseSum = sse.reduce((acc, val) => acc + val, 0);

  return rezidua.length * Math.log(sseSum / rezidua.length) + 2 * k;
}

// SES
// picked by MAE
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

  let currentVal;

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      currentVal = data[0];
      smoothedValues[i] = currentVal;
    } else {
      rezidua[i] = data[i] - smoothedValues[i - 1];

      currentVal = data[i];
      const previousSmoothVal = smoothedValues[i - 1];

      const newSmoothValue =
        alpha * currentVal + (1 - alpha) * previousSmoothVal;
      smoothedValues[i] = newSmoothValue;
    }
  }

  return { smoothedValues, rezidua };
}

function sesPrediction(
  countOfFutureMonths: number,
  lastDate: string,
  sesData: { smoothedValues: number[]; rezidua: number[] }
): {
  date: string;
  value: number;
}[] {
  const [year, month] = lastDate.split("-").map(Number);

  const predictionData: PredictionData = [];
  const lastSmoothedValue =
    sesData.smoothedValues[sesData.smoothedValues.length - 1];

  for (let i = 1; i <= countOfFutureMonths; i++) {
    const date = new Date(year, month + i);

    predictionData.push({
      date: `${date.getFullYear()}-${date.getMonth() + 1}`,
      value: lastSmoothedValue,
    });
  }

  return predictionData;
}

//Holtovo exponenciální vyhlazování
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
  const values = [{ level: 0, trend: 0, rezidua }];

  let currentLevel;
  let trend;

  for (let i = 0; i < aggregatedData.length; i++) {
    if (i === 0) {
      currentLevel = aggregatedData[i];
      trend = aggregatedData[i + 1] - aggregatedData[i];

      values[i] = {
        level: currentLevel,
        trend,
        rezidua,
      };
    } else {
      rezidua[i] =
        aggregatedData[i] - (values[i - 1].level + values[i - 1].trend);

      currentLevel =
        alpha * aggregatedData[i] +
        (1 - alpha) * (values[i - 1].level + values[i - 1].trend);
      trend =
        beta * (currentLevel - values[i - 1].level) +
        (1 - beta) * values[i - 1].trend;

      values[i] = {
        level: currentLevel,
        trend,
        rezidua,
      };
    }
  }

  return values[values.length - 1];
}

//Holt-Winters
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

  let currentLevel;
  let trend;

  const seasonalityValues = computeSeasonality(aggregatedData);
  const values = [
    { level: 0, trend: 0, seasonalValues: seasonalityValues, rezidua },
  ];

  for (let i = 0; i < aggregatedData.length; i++) {
    const seasonalIndex = i % 12;

    if (i === 0) {
      currentLevel = aggregatedData[i];
      trend = (aggregatedData[11] - aggregatedData[i]) / 11;

      values[i] = {
        level: currentLevel,
        trend,
        seasonalValues: seasonalityValues,
        rezidua,
      };
    } else if (i < 12) {
      rezidua[i] =
        aggregatedData[i] -
        (values[i - 1].level +
          values[i - 1].trend +
          seasonalityValues[seasonalIndex]);

      currentLevel =
        alpha * aggregatedData[i] +
        (1 - alpha) * (values[i - 1].level + values[i - 1].trend);
      trend =
        beta * (currentLevel - values[i - 1].level) +
        (1 - beta) * values[i - 1].trend;

      values[i] = {
        level: currentLevel,
        trend,
        seasonalValues: seasonalityValues,
        rezidua,
      };
    } else {
      rezidua[i] =
        aggregatedData[i] -
        (values[i - 1].level +
          values[i - 1].trend +
          values[i - 12].seasonalValues[seasonalIndex]);

      currentLevel =
        alpha * aggregatedData[i] +
        (1 - alpha) * (values[i - 1].level + values[i - 1].trend);
      trend =
        beta * (currentLevel - values[i - 1].level) +
        (1 - beta) * values[i - 1].trend;
      const newSeasonalValue =
        gama * (aggregatedData[i] - currentLevel) +
        (1 - gama) * seasonalityValues[seasonalIndex];

      seasonalityValues[seasonalIndex] = newSeasonalValue;

      values[i] = {
        level: currentLevel,
        trend,
        seasonalValues: seasonalityValues,
        rezidua,
      };
    }
  }

  return values[values.length - 1];
}

function holtPrediction(
  countOfFutureMonths: number,
  lastDate: string,
  type: "holt" | "holt-winter",
  lastLevelAndTrend?: { level: number; trend: number },
  lastLevelTrendSeasonalVal?: {
    level: number;
    trend: number;
    seasonalValues: number[];
  }
): PredictionData {
  const [year, month] = lastDate.split("-").map(Number);
  let predictionData: PredictionData = [];

  if (type === "holt" && lastLevelAndTrend) {
    const { level, trend } = lastLevelAndTrend;

    for (let i = 1; i <= countOfFutureMonths; i++) {
      const date = new Date(year, month + i);
      const value = level + i * trend;

      predictionData.push({
        date: `${date.getFullYear()}-${date.getMonth() + 1}`,
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
        date: `${date.getFullYear()}-${date.getMonth() + 1}`,
        value,
      });
    }
  } else {
    console.error("Uknown holt algorithm type -" + `${type}`);
    predictionData = [];
  }

  return predictionData;
}

function pickbestPredictionModel(
  values: { model: "holt" | "holt-winter" | "ses"; aicValue: number }[]
): "holt" | "holt-winter" | "ses" {
  //jde i pomoci reduce
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

// Intervaly spolehlivosti
function computeConfidenceIntervals(
  rezidua: number[],
  prediction: { date: string; value: number }[]
): IntervalData {
  const data: IntervalData = [];

  const sumOfRezidua = rezidua.reduce((acc, val) => acc + val, 0);
  const meanOfRezidua = sumOfRezidua / rezidua.length;
  const z = 1.96; // pro 95% interval spolehlivosti

  let sumSquaredDeviations = 0;
  for (let i = 0; i < rezidua.length; i++) {
    sumSquaredDeviations += Math.pow(rezidua[i] - meanOfRezidua, 2);
  }

  for (let i = 0; i < prediction.length; i++) {
    const sigma = Math.sqrt(sumSquaredDeviations / rezidua.length);
    const h = i + 1; // kolikaty mesic

    const lowerBound = prediction[i].value - z * sigma * Math.sqrt(h);
    const upperBound = prediction[i].value + z * sigma * Math.sqrt(h);

    data.push({
      date: prediction[i].date,
      lowerBound,
      prediction: prediction[i].value,
      upperBound,
    });
  }

  return data;
}

export default function providedLoansPrediction() {
  const data: LoansData = prepareLoanData();

  const aggregatedData = aggregateInvoicesByMonth(data);

  const trainingData = aggregatedData.slice(0, 48);
  const testData = aggregatedData.slice(48, 60);

  const aics: { model: "holt" | "holt-winter" | "ses"; aicValue: number }[] =
    [];

  // SES
  const bestAlphaPickedByMAE = pickBestAlphaByMAE(trainingData);
  const bestSESparams = pickBestAlphaByAIC(trainingData);
  const smoothedDataBySES = exponentialSmoothing(
    trainingData,
    bestSESparams.bestAlpha
  );

  aics.push({ model: "ses", aicValue: bestSESparams.bestAic });

  const predictionSES = sesPrediction(
    6,
    new Date(2025, 11, 1).toString(),
    smoothedDataBySES
  );

  // Holt
  const bestHoltParams = pickBestHoltParameters(trainingData);
  const smoothedDataByHolt = holtExponentialSmoothing(
    trainingData,
    bestHoltParams.bestAlpha,
    bestHoltParams.bestBeta
  );

  aics.push({ model: "holt", aicValue: bestHoltParams.bestAic });

  const predictionHolt = holtPrediction(
    6,
    new Date(2025, 11, 1).toString(),
    "holt",
    {
      level: smoothedDataByHolt.level,
      trend: smoothedDataByHolt.trend,
    }
  );

  // Holt-Winter
  const bestHoltWinterParams = pickBestHoltWintersParameters(trainingData);
  const smoothedDataByHoltWinter = holtWintersExponentialSmoothing(
    trainingData,
    bestHoltWinterParams.bestAlpha,
    bestHoltWinterParams.bestBeta,
    bestHoltWinterParams.bestGama
  );

  aics.push({ model: "holt-winter", aicValue: bestHoltWinterParams.bestAic });

  const predictionHoltWinter = holtPrediction(
    6,
    new Date(2025, 11, 1).toString(),
    "holt-winter",
    undefined,
    {
      level: smoothedDataByHoltWinter.level,
      trend: smoothedDataByHoltWinter.trend,
      seasonalValues: smoothedDataByHoltWinter.seasonalValues,
    }
  );

  console.log("invoice data " + data);

  console.log("best aplpha picked by MAE " + bestAlphaPickedByMAE);
  console.log("smoothed data " + smoothedDataBySES);
  console.log("prediction " + predictionSES);

  console.log("smoothed data by Holt" + smoothedDataByHolt);
  console.log("prediction by Holt" + predictionHolt);

  console.log("smoothed data by Holt-Winter" + smoothedDataByHoltWinter);
  console.log("prediction by Holt" + predictionHoltWinter);

  const bestModel = pickbestPredictionModel(aics);

  console.log("best model " + bestModel);

  let confidenceInterval = [];
  switch (bestModel) {
    case "holt":
      confidenceInterval = computeConfidenceIntervals(
        smoothedDataByHolt.rezidua,
        predictionHolt
      );
      console.log("Confidence interval " + `${confidenceInterval}`);
      console.log("test data " + testData);
      return confidenceInterval;
    case "holt-winter":
      confidenceInterval = computeConfidenceIntervals(
        smoothedDataByHoltWinter.rezidua,
        predictionHoltWinter
      );
      console.log("Confidence interval " + `${confidenceInterval}`);
      console.log("test data " + testData);
      return confidenceInterval;
    case "ses":
      confidenceInterval = computeConfidenceIntervals(
        smoothedDataBySES.rezidua,
        predictionSES
      );
      console.log("Confidence interval " + `${confidenceInterval}`);
      console.log("test data " + testData);
      return confidenceInterval;
    default:
      console.error("Uknown model " + `${bestModel}`);
      return [];
  }
}

// Tvoje funkce:

// alpha → zkoušíš 9 hodnot
// beta → zkoušíš 9 hodnot
// level → pouze inicializuješ z první hodnoty dat
// trend → pouze inicializuješ z prvních dvou hodnot dat
// rezidua → nejsou parametrem modelu, ale chybami
