import {
  DataForInvoicePrediction,
  DataForSSEbestAplha,
  IntervalData,
  InvoicesData,
  PredictionData,
  Statistics,
} from "@/zod-schemas";
import {
  computeConfidenceIntervals,
  createStatitics,
} from "./statisticsFunctions";
import { UsedDataInvoices } from "./classes";

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

        // Season coefficient
        const seasonality = Math.sin((2 * Math.PI * month) / 12);

        // 1 000–500 000
        const amountCze =
          Math.floor(Math.random() * (500000 - 1000 + 1)) + 1000;

        const amountCzeWithSeasonality = amountCze * (1 + 0.3 * seasonality);

        if (paymentType < 0.7) {
          // 70% paid on time
          amountPaid = amountCzeWithSeasonality;
          delay = 0;
        } else if (paymentType < 0.9) {
          // 20% paid late
          amountPaid = amountCzeWithSeasonality;
          delay = Math.floor(Math.random() * 60) + 1;
        } else if (paymentType < 0.95) {
          // 5% paid partially
          amountPaid = Math.floor(
            amountCzeWithSeasonality * (0.3 + Math.random() * 0.5)
          );
          delay = Math.floor(Math.random() * 60) + 1;
        } else {
          // 5% not paid yet
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

// There can be misunderstanding. (CHECK)
function excludeOutliers(data: InvoicesData): InvoicesData {
  const sorted = [...data].sort(
    (a, b) => a.DueDate.getTime() - b.DueDate.getTime()
  );

  const firtsNotPaidInvoice = sorted.find(
    item => item.AmountCze !== item.AmountPaidCze
  );

  if (!firtsNotPaidInvoice) {
    return data;
  }

  // First not paid invoice index
  const firstNotPaidInvoiceIndex = sorted.indexOf(firtsNotPaidInvoice);

  let countOfPaidInvoices = 0;

  for (let i = firstNotPaidInvoiceIndex + 1; i < sorted.length; i++) {
    const isPaid = sorted[i].AmountCze === sorted[i].AmountPaidCze;

    if (isPaid) {
      countOfPaidInvoices = countOfPaidInvoices + 1;
    } else {
      break;
    }
  }

  if (countOfPaidInvoices > 10) {
    console.warn(
      "Warning: There are more than 10 paid invoices after the first not paid invoice."
    );
    return [];
  }

  return sorted.slice(0, firstNotPaidInvoiceIndex);
}

function aggregateInvoicesPaymentDelayByMonth(data: InvoicesData): number[] {
  const monthlyValues = new Map<string, number[]>();

  data.forEach(item => {
    if (item.PaymentDelay == null) {
      return;
    }

    const paymentDelayDate = new Date(item.DueDate);

    const key = `${paymentDelayDate.getFullYear()} - ${paymentDelayDate.getMonth()}`;

    if (!monthlyValues.has(key)) {
      monthlyValues.set(key, []);
    }

    monthlyValues.get(key)!.push(item.PaymentDelay);
  });

  return Array.from(monthlyValues.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, values]) => {
      return values.reduce((acc, val) => acc + val, 0) / values.length;
    });
}

function computeAIC(rezidua: number[], paramsCount: number): number {
  const k = paramsCount;

  const sse = rezidua.map(numb => numb * numb);
  const sseSum = sse.reduce((acc, val) => acc + val, 0);

  return rezidua.length * Math.log(sseSum / rezidua.length) + 2 * k;
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
  const predictionData: PredictionData = [];

  const year = lastDate.getFullYear();
  const month = lastDate.getMonth();

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

function prepareDataToAlgorithm(data: InvoicesData): {
  trainingData: InvoicesData;
  testData: InvoicesData;
} {
  const years = [
    ...data.map(item => {
      return item.DueDate.getFullYear();
    }),
  ].sort((a, b) => a - b);

  const secondToLastYear = years[years.length - 2];
  const lastYear = years[years.length - 1];

  const trainingData = data.filter(
    item => item.DueDate.getFullYear() <= secondToLastYear
  );

  const testData = data.filter(item => item.DueDate.getFullYear() === lastYear);

  return { trainingData, testData };
}

//Check jako hoodne
export default function issuedInvoicesPrediction(): {
  usedData: DataForInvoicePrediction;
  confidenceIntervals: IntervalData;
  statistics: Statistics;
} {
  let data: InvoicesData = prepareInvoiceData();

  const excludetData = excludeOutliers(data);

  data = excludeOutliers(data);

  const { trainingData, testData } = prepareDataToAlgorithm(data);

  const aggtrainingData = aggregateInvoicesPaymentDelayByMonth(trainingData);
  const aggtestData = aggregateInvoicesPaymentDelayByMonth(testData);

  const countOfFutureMonthsToPredict = 6;

  // SES
  const bestSESparams = pickBestAlphaByAIC(aggtrainingData);
  const smoothedDataBySES = exponentialSmoothing(
    aggtrainingData,
    bestSESparams.bestAlpha
  );

  const predictionSES = sesPrediction(
    countOfFutureMonthsToPredict,
    new Date(2025, 11, 1),
    smoothedDataBySES
  );

  // console.log(
  //   "---------------------------------------------------------------"
  // );
  // console.log("Původní data:", data);
  // console.log("Délka původních dat:", data.length);

  // console.log("Data po odstranění odlehlých hodnot:", excludetData);
  // console.log("Délka dat po odstranění odlehlých hodnot:", excludetData.length);
  // console.log(
  //   "trainig data a delka " + trainingData + " " + trainingData.length
  // );
  // console.log(
  //   "smoothedDataBySES ve funkci smoothedValues a delka " +
  //     smoothedDataBySES.smoothedValues +
  //     " " +
  //     smoothedDataBySES.smoothedValues.length
  // );
  // console.log(
  //   "smoothedDataBySES ve funkci rezidua a delka " +
  //     smoothedDataBySES.rezidua +
  //     " " +
  //     smoothedDataBySES.rezidua.length
  // );

  // predictionSES.forEach(item => {
  //   console.log(item);
  // });

  const confidenceIntervals = computeConfidenceIntervals(
    smoothedDataBySES.rezidua,
    predictionSES
  );

  const savedUsedData = new UsedDataInvoices(
    data,
    excludetData,
    trainingData,
    testData,
    {
      alpha: bestSESparams.bestAlpha,
      aic: bestSESparams.bestAic,
    },
    {
      params: {
        smoothedValues: smoothedDataBySES.smoothedValues,
        rezidua: smoothedDataBySES.rezidua,
      },
      values: predictionSES,
    }
  );

  const usedData: DataForInvoicePrediction = {
    data: savedUsedData.getData(),
    excludetData: savedUsedData.getEexcludetData(),
    trainingData: savedUsedData.getTrainingData(),
    testData: savedUsedData.getTestData(),
    algorithmParams: savedUsedData.getAlgorithmParams(),
    predictionsData: {
      countOfFutureMonthsToPredict,
      data: savedUsedData.getPredictionData(),
    },
  };

  return {
    usedData,
    confidenceIntervals,
    statistics: createStatitics(aggtestData, confidenceIntervals),
  };
}
