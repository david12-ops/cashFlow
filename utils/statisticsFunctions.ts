import { IntervalData, Statistics } from "@/zod-schemas";

export function createStatitics(
  testData: number[],
  predictedData: IntervalData
): Statistics {
  let sumForMae = 0;
  let sumForMape = 0;
  let sumForRMSE = 0;
  // sum for average of the signed relative error
  let sumForRelativeError = 0;

  const validObservationCount = testData.filter(value => value !== 0).length;

  const count = Math.min(testData.length, predictedData.length);

  for (let i = 0; i < count; i++) {
    sumForMae += Math.abs(testData[i] - predictedData[i].prediction);
    sumForRMSE += Math.pow(testData[i] - predictedData[i].prediction, 2);

    if (testData[i] !== 0) {
      sumForMape += Math.abs(
        (testData[i] - predictedData[i].prediction) / testData[i]
      );
      sumForRelativeError +=
        (testData[i] - predictedData[i].prediction) / testData[i];
    }
  }

  const mae = (1 / testData.length) * sumForMae;
  const rmse = Math.sqrt((1 / testData.length) * sumForRMSE);
  const mape =
    validObservationCount > 0
      ? (100 / validObservationCount) * sumForMape
      : null;
  // average of the signed relative error
  const mre =
    validObservationCount > 0
      ? (1 / validObservationCount) * sumForRelativeError * 100
      : null;

  return {
    valueMAE: mae,
    valueMAPE: mape,
    valueRMSE: rmse,
    valueMRE: mre,
  };
}

// Confidence intervals
export function computeConfidenceIntervals(
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
