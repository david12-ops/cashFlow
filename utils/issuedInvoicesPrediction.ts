import {
  DataForHoltBestParams,
  DataForHoltWinterBestParams,
  HaltPredictionData,
  InvoicesData,
} from "@/zod-schemas/invoicesDataTypes";

function prepareInvoiceData(): InvoicesData {
  const invoiceData: InvoicesData = [];

  const startYear = 2021;
  const endYear = 2025;

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 0; month < 12; month++) {
      const invoiceCount = Math.floor(Math.random() * 31) + 20;

      for (let i = 0; i < invoiceCount; i++) {
        const paymentType = Math.random();

        let amountPaid: number;
        let delay: number | null;

        const dueDate = new Date(
          year,
          month,
          Math.floor(Math.random() * 28) + 1
        );

        //seson koeficient
        const seasonality = Math.sin((2 * Math.PI * month) / 12);

        // 1 000–500 000
        const amountCze =
          Math.floor(Math.random() * (500000 - 1000 + 1)) + 1000;

        const amountCzeWithSeasonality = amountCze * (1 + 0.3 * seasonality);

        if (paymentType < 0.7) {
          // 70 % zaplaceno vcas
          amountPaid = amountCzeWithSeasonality;
          delay = 0;
        } else if (paymentType < 0.9) {
          // 20 % zaplaceno se zpozdenim
          amountPaid = amountCzeWithSeasonality;
          delay = Math.floor(Math.random() * 60) + 1;
        } else if (paymentType < 0.95) {
          // 5 % zaplaceno častečně
          amountPaid = Math.floor(
            amountCzeWithSeasonality * (0.3 + Math.random() * 0.5)
          );
          delay = Math.floor(Math.random() * 60) + 1;
        } else {
          // 5 % zatim nezaplaceno
          amountPaid = 0;
          delay = null;
        }

        invoiceData.push({
          DueDate: dueDate,
          AmountCze: amountCzeWithSeasonality,
          AmountPaidCze: amountPaid,
          PaymentDelay: delay,
        });
      }
    }
  }

  return invoiceData;
}

function aggregateInvoicesByMonth(data: InvoicesData): number[] {
  const monthlyValues = new Map<string, number[]>();

  data.forEach(item => {
    if (item.PaymentDelay == null) {
      return;
    }
    // datum skutečné platby
    // DueDate + PaymentDelay
    const date = new Date(item.DueDate);

    if (item.PaymentDelay != null)
      date.setDate(date.getDate() + item.PaymentDelay);

    const key = `${date.getFullYear()} - ${date.getMonth()}`;

    if (!monthlyValues.has(key)) {
      monthlyValues.set(key, []);
    }

    monthlyValues.get(key)!.push(item.AmountPaidCze);
  });

  return Array.from(monthlyValues.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, values]) => {
      return values.reduce((acc, val) => acc + val, 0);
    });
}

// SES
// picked by MAE
function pickBestAlpha(aggregatedData: number[]): number {
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
  sseData: { smoothedValues: number[]; rezidua: number[] }
): {
  date: string;
  value: number;
}[] {
  //TODO
  for (let i = 1; i <= countOfFutureMonths; i++) {}

  return [];
}

//Holtovo exponenciální vyhlazování
function computeAIC(rezidua: number[], paramsCount: number): number {
  const k = paramsCount; // tady jeste uvidime

  const sse = rezidua.map(numb => numb * numb);
  const sseSum = sse.reduce((acc, val) => acc + val, 0);

  return rezidua.length * Math.log(sseSum / rezidua.length) + 2 * k;
}

function pickBestHoltParameters(aggregatedData: number[]): {
  bestAlpha: number;
  bestBeta: number;
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

  return bestParams;
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

  return bestParams;
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
): HaltPredictionData {
  const [year, month] = lastDate.split("-").map(Number);
  let predictionData: HaltPredictionData = [];

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

function issuedInvoicesPrediction() {
  const data: InvoicesData = prepareInvoiceData();

  const aggregatedData = aggregateInvoicesByMonth(data);

  // SSE
  const bestAlpha = pickBestAlpha(aggregatedData);
  const smoothedDataBySSE = exponentialSmoothing(aggregatedData, bestAlpha);

  const predictionSSE = sesPrediction(
    6,
    new Date(2025, 11, 1).toString(),
    smoothedDataBySSE
  );

  // Holt
  const bestParams = pickBestHoltParameters(aggregatedData);
  const smoothedDataByHolt = holtExponentialSmoothing(
    aggregatedData,
    bestParams.bestAlpha,
    bestParams.bestBeta
  );

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
  const bestWinterParams = pickBestHoltWintersParameters(aggregatedData);
  const smoothedDataByHoltWinter = holtWintersExponentialSmoothing(
    aggregatedData,
    bestWinterParams.bestAlpha,
    bestWinterParams.bestBeta,
    bestWinterParams.bestGama
  );

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

  console.log("smoothed data " + smoothedDataBySSE);
  console.log("prediction " + predictionSSE);

  console.log("smoothed data by Holt" + smoothedDataByHolt);
  console.log("prediction by Holt" + predictionHolt);

  console.log("smoothed data by Holt-Winter" + smoothedDataByHoltWinter);
  console.log("prediction by Holt" + predictionHoltWinter);
}

// Tvoje funkce:

// alpha → zkoušíš 9 hodnot
// beta → zkoušíš 9 hodnot
// level → pouze inicializuješ z první hodnoty dat
// trend → pouze inicializuješ z prvních dvou hodnot dat
// rezidua → nejsou parametrem modelu, ale chybami

// Vytvořit intervaly spolehlivosti
