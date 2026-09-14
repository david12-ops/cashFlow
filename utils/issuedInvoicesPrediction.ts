import {
  DataForSSEbestAplha,
  IntervalData,
  InvoicesData,
  PredictionData,
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

// Confidence intervals
function computeConfidenceIntervals(
  rezidua: number[],
  prediction: { date: string; value: number }[]
): IntervalData {
  const data: IntervalData = [];

  const sumOfRezidua = rezidua.reduce((acc, val) => acc + val, 0);
  const meanOfRezidua = sumOfRezidua / rezidua.length;
  const z = 1.96; // For a 95% confidence interval

  let sumSquaredDeviations = 0;
  for (let i = 0; i < rezidua.length; i++) {
    sumSquaredDeviations += Math.pow(rezidua[i] - meanOfRezidua, 2);
  }

  for (let i = 0; i < prediction.length; i++) {
    const sigma = Math.sqrt(sumSquaredDeviations / rezidua.length);
    const h = i + 1; // Order of the month

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

export default function issuedInvoicesPrediction(): IntervalData {
  const data: InvoicesData = prepareInvoiceData();

  const excludetData = excludeOutliers(data);

  console.log("excludet data " + excludetData);

  const aggregatedData = aggregateInvoicesPaymentDelayByMonth(excludetData);

  console.log("aggregated data " + aggregatedData);

  const trainingData = aggregatedData.slice(0, 48);
  const testData = aggregatedData.slice(48, 60);

  // SES
  const bestSESparams = pickBestAlphaByAIC(trainingData);
  const smoothedDataBySES = exponentialSmoothing(
    trainingData,
    bestSESparams.bestAlpha
  );

  const predictionSES = sesPrediction(
    6,
    new Date(2025, 11, 1).toString(),
    smoothedDataBySES
  );

  const confidenceInterval = computeConfidenceIntervals(
    smoothedDataBySES.rezidua,
    predictionSES
  );
  console.log("Confidence interval " + `${confidenceInterval}`);
  console.log("test data " + testData);

  console.log("Data for prediction of invoices: ", data);
  return confidenceInterval;
}
