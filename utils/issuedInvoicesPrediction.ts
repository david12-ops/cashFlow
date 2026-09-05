import {
  DataForHoltBestParams,
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

        // 1 000–500 000
        const amountCze =
          Math.floor(Math.random() * (500000 - 1000 + 1)) + 1000;

        if (paymentType < 0.7) {
          // 70 % zaplaceno vcas
          amountPaid = amountCze;
          delay = 0;
        } else if (paymentType < 0.9) {
          // 20 % zaplaceno se zpozdenim
          amountPaid = amountCze;
          delay = Math.floor(Math.random() * 60) + 1;
        } else if (paymentType < 0.95) {
          // 5 % zaplaceno častečně
          amountPaid = Math.floor(amountCze * (0.3 + Math.random() * 0.5));
          delay = Math.floor(Math.random() * 60) + 1;
        } else {
          // 5 % zatim nezaplaceno
          amountPaid = 0;
          delay = null;
        }

        invoiceData.push({
          DueDate: dueDate,
          AmountCze: amountCze,
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
function exponentialSmoothing(data: number[], alpha: number) {
  const smooothValues: number[] = [];
  let currentVal;

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      currentVal = data[0];
      smooothValues[i] = currentVal;
    } else {
      currentVal = data[i];
      const previousSmoothVal = smooothValues[i - 1];

      const newSmoothValue =
        alpha * currentVal + (1 - alpha) * previousSmoothVal;
      smooothValues[i] = newSmoothValue;
    }
  }

  return smooothValues;
}

function pickBestAlpha(aggregatedData: number[]): number {
  let bestAlpha = 0;
  let bestErrorValue = Number.MAX_VALUE;

  for (let alpha = 0.1; alpha < 1; alpha += 0.1) {
    let totalError = 0;
    const smoothValues = exponentialSmoothing(aggregatedData, alpha);

    for (let x = 0; x < aggregatedData.length; x++) {
      const errorValue = Math.abs(aggregatedData[x] - smoothValues[x]);
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

//Holtovo exponenciální vyhlazování
function computeAIC(rezidua: number[]): number {
  const k = 2; // tady jeste uvidime

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

      const aic = computeAIC(values.holtValue.rezidua);

      if (aic < bestAic) {
        bestAic = aic;
        bestParams = { bestAlpha: alpha, bestBeta: beta };
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
      currentLevel =
        alpha * aggregatedData[i] +
        (1 - alpha) * (values[i - 1].level + values[i - 1].trend);
      trend =
        beta * (currentLevel - values[i - 1].level) +
        (1 - beta) * values[i - 1].trend;
      rezidua[i] = aggregatedData[i] - (currentLevel + trend);

      values[i] = {
        level: currentLevel,
        trend,
        rezidua,
      };
    }
  }

  return values[values.length - 1];
}

function haltPrediction(
  countOfFutureMonths: number,
  lastLevelAndTrend: { level: number; trend: number },
  lastDate: string
): HaltPredictionData {
  const [year, month] = lastDate.split("-");
  const { level, trend } = lastLevelAndTrend;

  const predictionData: HaltPredictionData = [];

  for (let i = 1; i <= countOfFutureMonths; i++) {
    const date = new Date(Number(year), Number(month) + i);
    const value = level + i * trend;

    predictionData.push({
      date: `${date.getFullYear()}-${date.getMonth() + 1}`,
      value,
    });
  }

  return predictionData;
}

//Holt-Winters - falesna data mohou delat brikule
// Vytvořit intervaly spolehlivosti

function issuedInvoicesPrediction() {
  const data: InvoicesData = prepareInvoiceData();

  const aggregatedData = aggregateInvoicesByMonth(data);
  const bestAlpha = pickBestAlpha(aggregatedData);

  const smoothedDataBySSE = exponentialSmoothing(aggregatedData, bestAlpha);

  const bestParams = pickBestHoltParameters(aggregatedData);
  const smoothedDataByHolt = holtExponentialSmoothing(
    aggregatedData,
    bestParams.bestAlpha,
    bestParams.bestBeta
  );
  const prediction = haltPrediction(
    6,
    {
      level: smoothedDataByHolt.level,
      trend: smoothedDataByHolt.trend,
    },
    new Date(2025, 11, 1).toString()
  );

  console.log("invoice data " + data);
  console.log("smoothed data " + smoothedDataBySSE);
  console.log("prediction " + smoothedDataBySSE[smoothedDataBySSE.length - 1]);

  console.log("smoothed data by Holt" + smoothedDataByHolt);
  console.log("prediction by Holt" + prediction);
}

// Tvoje funkce:

// alpha → zkoušíš 9 hodnot
// beta → zkoušíš 9 hodnot
// level → pouze inicializuješ z první hodnoty dat
// trend → pouze inicializuješ z prvních dvou hodnot dat
// rezidua → nejsou parametrem modelu, ale chybami
