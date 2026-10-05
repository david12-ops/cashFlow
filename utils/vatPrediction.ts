import {
  DataForVatPrediction,
  VatData,
  IntervalData,
  MonthData,
  MonthsData,
  Statistics,
} from "../zod-schemas";
import { UsedVatData } from "./classes";
import {
  computeConfidenceIntervals,
  createStatitics,
} from "./statisticsFunctions";

function prepareVatData(
  days: number,
  period: "MONTHLY" | "QUARTERLY",
  yearsToAddBack?: number
): VatData {
  const monthDaysInOneYear: VatData = {};
  const monthDaysAcrossPastYears: VatData = {};

  const today = new Date();
  const baseValue = 100000;

  if (period === "MONTHLY") {
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + daysToAddToNextMonth(date) + i);
      const keyDate = date.getFullYear() + "-" + (date.getMonth() + 1);

      if (!monthDaysInOneYear[keyDate]) monthDaysInOneYear[keyDate] = [];

      const vat_val = computeVatValue(
        {
          baseValue,
          day: i,
          countOfdays: days,
        },
        date
      );
      monthDaysInOneYear[keyDate].push({ date_val: date, vat_val: vat_val });
    }

    return monthDaysInOneYear;
  }

  if (period === "QUARTERLY" && yearsToAddBack) {
    const lastDate = { year: 0, month: 0 };
    const additionalDays = prepareVatData(93, "MONTHLY") as VatData;
    const lastKey = getLastKey(additionalDays);

    if (!lastKey) return {};

    const [year, month] = lastKey.split("-");
    lastDate.year = parseInt(year, 10);
    lastDate.month = parseInt(month, 10);

    for (
      let year = lastDate.year - (yearsToAddBack - 1);
      year <= lastDate.year - 1;
      year++
    ) {
      for (let month = 1; month <= 12; month++) {
        const keyDate = year + "-" + month;
        for (
          let day = 1;
          day <= getDaysInMonths(new Date(year, month - 1));
          day++
        ) {
          const date = new Date(year, month - 1, day);
          date.setDate(date.getDate());

          if (!monthDaysAcrossPastYears[keyDate])
            monthDaysAcrossPastYears[keyDate] = [];

          const vat_val = computeVatValue(
            {
              baseValue,
              day,
              countOfdays: 365,
            },
            date
          );
          monthDaysAcrossPastYears[keyDate].push({
            date_val: date,
            vat_val: vat_val,
          });
        }
      }
    }

    return { ...monthDaysAcrossPastYears, ...additionalDays };
  }

  return {};
}

function computeVatValue(
  valuesFortrend: {
    baseValue: number;
    day: number;
    countOfdays: number;
  },
  date: Date
): number {
  const { baseValue, day, countOfdays } = valuesFortrend;

  const trend = baseValue * Math.pow(1 + 0.05, day / countOfdays);

  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const seasonKoeficient = 1 + 0.15 * Math.sin((2 * Math.PI * dayOfYear) / 365);

  const randomFactor = 0.9 + Math.random() * 0.2;

  return trend * seasonKoeficient * randomFactor;
}

function daysToAddToNextMonth(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayNextMonth = new Date(year, month + 1, 1);
  const diffTime = firstDayNextMonth.getTime() - date.getTime();

  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDaysInMonths(date: Date): number {
  if (!date) return 0;

  const year = date.getFullYear();
  const daysInMonth = isLeapYear(year)
    ? [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return daysInMonth[date.getMonth()];
}

function getLastKey(data: VatData): string | undefined {
  let countOfKeys = data ? Object.keys(data).length : 0;
  let lastClosedMonthKey;
  let closed = false;

  while (!closed && countOfKeys > 0) {
    const monthKey = Object.keys(data).sort((aKey, bKey) => {
      let scoreA = 0;
      let scoreB = 0;

      const [aYear, aMonth] = aKey.split("-");
      const [bYear, bMonth] = bKey.split("-");

      if (parseInt(aYear, 10) > parseInt(bYear)) scoreA = +1;
      else if (parseInt(aYear, 10) < parseInt(bYear)) scoreB = +1;

      if (
        parseInt(aMonth, 10) > parseInt(bMonth, 10) &&
        parseInt(aYear, 10) === parseInt(bYear)
      )
        scoreA = +1;
      else if (
        parseInt(aMonth, 10) < parseInt(bMonth, 10) &&
        parseInt(aYear, 10) === parseInt(bYear)
      )
        scoreB = +1;

      return scoreA - scoreB;
    })[countOfKeys - 1];

    if (
      data[monthKey] &&
      getDaysInMonths(new Date(data[monthKey][0].date_val)) != 0 &&
      data[monthKey].length ===
        getDaysInMonths(new Date(data[monthKey][0].date_val))
    ) {
      lastClosedMonthKey = monthKey;
      closed = true;
    } else countOfKeys--;
  }

  return lastClosedMonthKey;
}

function getMonths(
  data: VatData,
  period: "MONTHLY" | "QUARTERLY",
  monthlyType?: "CLOSED" | "ACTIVE",
  quarterlyType?: "PAST_YEARS" | "CURRENT_YEAR" // Need to come up with something better quarterly
): MonthsData | MonthData | undefined {
  const lastClosedMonthKey = getLastKey(data);
  if (!lastClosedMonthKey) return [];

  const [year] = lastClosedMonthKey.split("-");

  if (period === "QUARTERLY" && quarterlyType) {
    const pastYearMonthsKeys = Object.keys(data).filter(monthKey => {
      const [keyYear] = monthKey.split("-");
      return parseInt(keyYear, 10) !== parseInt(year, 10);
    });

    const pastYearMonths = pastYearMonthsKeys.flatMap(key =>
      Object.values(data[key])
    );

    const currentYearsMonthKeys = Object.keys(data).filter(monthKey => {
      const [keyYear] = monthKey.split("-");
      return parseInt(keyYear, 10) === parseInt(year, 10);
    });

    const currentYearMonths = currentYearsMonthKeys.flatMap(key =>
      Object.values(data[key])
    );

    return quarterlyType === "PAST_YEARS" ? pastYearMonths : currentYearMonths;
  }

  if (period === "MONTHLY" && monthlyType) {
    const activeMonthWithDays = Object.values(data).filter(monthData => {
      if (monthData.length > 0)
        return (
          monthData.length <
          getDaysInMonths(
            new Date(monthData[Math.floor(monthData.length / 2)].date_val)
          )
        );
    })[0];

    const closedMonthWithDays = Object.values(data).filter(monthData => {
      if (monthData.length > 0)
        return (
          monthData.length ===
          getDaysInMonths(
            new Date(monthData[Math.floor(monthData.length / 2)].date_val)
          )
        );
    });

    return monthlyType === "ACTIVE" ? activeMonthWithDays : closedMonthWithDays;
  }

  return undefined;
}

function normalizedInPercent(
  averageDaysData: MonthData,
  sumOfAveragedph: number,
  activeDaysCount: number,
  activeMonthDaysCount: number
): MonthData {
  const dataInPercent = averageDaysData.map(day => {
    return {
      ...day,
      vat_val: ((day.vat_val ?? 0) / sumOfAveragedph) * 100,
    };
  });

  const redistributed = redistributeExtraDays(
    dataInPercent,
    activeDaysCount,
    activeMonthDaysCount
  );

  return redistributed;
}

function aggregateClosedMonthsVatValuesbyDay(
  closedMonths: MonthsData
): MonthData {
  const aggregatedData: MonthData = [];

  // tohle je spatne, zatim funguje
  const maxDays = Math.max(...closedMonths.map(month => month.length));
  const lastClosedMonth = closedMonths
    .flatMap(month => month)
    .sort((a, b) => b.date_val.getTime() - a.date_val.getTime())[0];

  for (let day = 0; day < maxDays; day++) {
    const days = closedMonths
      .map(month => month[day])
      .filter(value => value?.vat_val != null && value.date_val != null);

    if (days.length === 0) continue;

    const sumOfDays = days.reduce((sum, day) => sum + (day.vat_val ?? 0), 0);

    const averageVatDay = sumOfDays / days.length;

    //     aggregatedData.push({
    //       date_val: new Date(
    //         lastClosedMonth.date_val.getFullYear(),
    //         lastClosedMonth.date_val.getMonth() + 1,
    //         day + 1
    //       ),
    //       vat_val: averageVatDay,
    //     });
    //   }

    aggregatedData.push({
      date_val: new Date(
        lastClosedMonth.date_val.getFullYear(),
        lastClosedMonth.date_val.getMonth(),
        day + 1
      ),
      vat_val: averageVatDay,
    });
  }

  return aggregatedData;
}

function redistributeExtraDays(
  month: MonthData,
  activeDaysCount: number,
  activeMonthDaysCount: number
): MonthData {
  // Historical days that have no place in the current one
  const extraHistoricalDays = month.slice(activeMonthDaysCount);

  // Percentages on distribution
  const percentageToRedistribute = extraHistoricalDays.reduce(
    (sum, day) => sum + day.vat_val,
    0
  );

  const remainingActiveDays = activeMonthDaysCount - activeDaysCount;

  if (remainingActiveDays <= 0) {
    return month.slice(0, activeMonthDaysCount);
  }

  const percentagePerRemainingDay =
    percentageToRedistribute / remainingActiveDays;

  // Days that have already passed
  const pastDays = month.slice(0, activeDaysCount);

  const futureDays = month
    .slice(activeDaysCount, activeMonthDaysCount)
    .map(day => {
      return {
        ...day,
        vat_val: day.vat_val + percentagePerRemainingDay,
      };
    });

  return [...pastDays, ...futureDays];
}

function aggregateMonthlyVatvaluesbyDay(data: VatData): {
  aggMonthNumbersInPercent: MonthData;
  activeMonth: MonthData;
  sumOfActiveMonth: number;
} {
  const closedMoths = getMonths(data, "MONTHLY", "CLOSED") as MonthsData;

  const activeMonth = getMonths(data, "MONTHLY", "ACTIVE") as MonthData;

  if (
    !closedMoths ||
    closedMoths.length === 0 ||
    !activeMonth ||
    activeMonth.length === 0
  )
    return {
      aggMonthNumbersInPercent: [],
      activeMonth: [],
      sumOfActiveMonth: 0,
    };

  const sumOfVatInActiveMonth = activeMonth.reduce(
    (sum, val) => (sum += val.vat_val),
    0
  );

  const aggregatedClosedMonth =
    aggregateClosedMonthsVatValuesbyDay(closedMoths);

  const normalizedsInPercent = normalizedInPercent(
    aggregatedClosedMonth,
    aggregatedClosedMonth.reduce((sum, day) => sum + (day.vat_val ?? 0), 0),
    activeMonth.length,
    getDaysInMonths(activeMonth[0].date_val)
  );

  return {
    aggMonthNumbersInPercent: normalizedsInPercent,
    activeMonth: activeMonth,
    sumOfActiveMonth: sumOfVatInActiveMonth,
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function prepareTestingData(
  lastMonthData: MonthData,
  lastKey: string
): { key: string; data: VatData } | null {
  const activeMonth = lastMonthData;

  if (!activeMonth || activeMonth.length === 0) {
    console.warn(
      "No active month found in data, prediction cannot be performed correctly."
    );
    return null;
  }

  const activeDateInActiveMonth = activeMonth![0].date_val;
  const keyDate = lastKey;

  const daysOfActiveMonth = getDaysInMonths(activeDateInActiveMonth);

  const newData = prepareVatData(daysOfActiveMonth, "MONTHLY");

  const generatedValues = Object.values(newData)[0];

  const newMonth: VatData = {};

  newMonth[keyDate] = [...activeMonth];

  // const newDates: Date[] = [...activeMonth.map(item => item.date_val)];

  // for (let i = newDates.length; i < daysOfAciveMonth; i++) {
  //   newDates[i] = new Date(
  //     activeDateInActiveMonth.getFullYear(),
  //     activeDateInActiveMonth.getMonth(),
  //     i + 1
  //   );
  // }

  // Object.values(newData)[0].forEach((itm, index) => {
  //   newMonth[keyDate].push({
  //     ...itm,
  //     date_val: newDates[index],
  //   });
  // });

  // Od 2. dne použijeme vygenerované hodnoty
  for (let i = activeMonth.length; i < daysOfActiveMonth; i++) {
    newMonth[keyDate].push({
      ...generatedValues[i - activeMonth.length],
      date_val: new Date(
        activeDateInActiveMonth.getFullYear(),
        activeDateInActiveMonth.getMonth(),
        i + 1
      ),
    });
  }

  return { key: keyDate, data: newMonth };
}

function monthlyVatPrediction():
  | {
      usedData: DataForVatPrediction;
      confidenceIntervals: IntervalData;
      statistics: Statistics;
    }
  | undefined {
  // This part of the code during optimization
  //   const data = prepareVatData(124, "MONTHLY");

  //   if (Object.values(data).some(days => days.length === 0)) {
  //     console.warn(
  //       "Some months contain no data. Prediction cannot be performed."
  //     );
  //     return undefined;
  //   }

  //   //     const firstPartValues: VatData = Object.fromEntries(
  //   //   Object.entries(data).filter(([key]) => key !== testData.key)
  //   // );

  //   const keysOfData = Object.keys(data);

  //   const firstPartValues: VatData = {};

  //   Object.entries(data).forEach(([key, value]) => {
  //     if (key !== keysOfData[keysOfData.length - 1]) {
  //       firstPartValues[key] = [];

  //       firstPartValues[key] = value;
  //     }
  //   });

  //   // Last month will be the test data
  //   const lastKey = keysOfData[keysOfData.length - 1];
  //   const testData = data[lastKey];

  //   console.log("Test Data:", testData);

  //   // Its for testing data, we need to prepare the last active month, and then change the days
  //   const preparedTestData = prepareTestingData(testData, lastKey);

  //   if (
  //     preparedTestData &&
  //     preparedTestData.data !== null &&
  //     preparedTestData.key
  //   ) {
  //     const trainingData = firstPartValues;

  //     const { aggMonthNumbersInPercent, activeMonth, sumOfActiveMonth } =
  //       aggregateMonthlyVatvaluesbyDay(data);

  //     const historySumPercentage = aggMonthNumbersInPercent
  //       .slice(0, activeMonth.length)
  //       .reduce((sum, val) => (sum += val.vat_val ?? 0), 0);

  //     if (historySumPercentage <= 0 || sumOfActiveMonth <= 0) {
  //       console.warn(
  //         "Historical sum or active month sum is zero or negative. Prediction cannot be performed."
  //       );
  //       return undefined;
  //     }

  //     const predictedVat = (sumOfActiveMonth / historySumPercentage) * 100;

  //     const predictedData = aggMonthNumbersInPercent.map(item => {
  //       return {
  //         date: `${item.date_val.getFullYear()}-${String(item.date_val.getMonth() + 1).padStart(2, "0")}-${String(item.date_val.getDate()).padStart(2, "0")}`,
  //         value: (predictedVat / 100) * item.vat_val,
  //       };
  //     });

  //     // console.log("predictedData", predictedData);

  //     const rezidua = preparedTestData.data[preparedTestData.key].map(
  //       (item, index) => item.vat_val - predictedData[index].value
  //     );

  // For hard verification, work only with closed months.
  // The method is very sensitive to date changes that the preparedTestData function triggers.
  // In bars graph can be seen green and blue bar. The green bar is actual data, the blue bar is predicted data.
  // There will be difference on count of predicted days and actual days. So prediction will have length by the max days in the closed months.
  // But test data (next month) will have length by the actual days in the next month. So there will be difference in length of predicted and actual data.
  // So the in the bar graph can be more blue bars but some blue bars will not have green bar because the day in not in test data.
  const data = prepareVatData(186, "MONTHLY");

  if (Object.values(data).some(days => days.length === 0)) {
    console.warn(
      "Some months contain no data. Prediction cannot be performed."
    );
    return undefined;
  }

  //     const firstPartValues: VatData = Object.fromEntries(
  //   Object.entries(data).filter(([key]) => key !== testData.key)
  // );

  const keysOfData = Object.keys(data);

  const firstPartValues: VatData = {};

  Object.entries(data).forEach(([key, value]) => {
    if (key !== keysOfData[keysOfData.length - 2]) {
      firstPartValues[key] = [];

      firstPartValues[key] = value;
    }
  });

  // Last month will be the test data
  const lastKey = keysOfData[keysOfData.length - 2];
  const testData: VatData = {};
  testData[lastKey] = data[lastKey];

  if (testData && testData[lastKey] !== null) {
    const trainingData = firstPartValues;

    const { aggMonthNumbersInPercent, activeMonth, sumOfActiveMonth } =
      aggregateMonthlyVatvaluesbyDay(data);

    const historySumPercentage = aggMonthNumbersInPercent
      .slice(0, activeMonth.length)
      .reduce((sum, val) => (sum += val.vat_val ?? 0), 0);

    if (historySumPercentage <= 0 || sumOfActiveMonth <= 0) {
      console.warn(
        "Historical sum or active month sum is zero or negative. Prediction cannot be performed."
      );
      return undefined;
    }

    const predictedVat = (sumOfActiveMonth / historySumPercentage) * 100;

    const predictedData = aggMonthNumbersInPercent.map(item => {
      return {
        date: `${item.date_val.getFullYear()}-${String(item.date_val.getMonth() + 1).padStart(2, "0")}-${String(item.date_val.getDate()).padStart(2, "0")}`,
        value: (predictedVat / 100) * item.vat_val,
      };
    });

    const rezidua = testData[lastKey].map(
      (item, index) => item.vat_val - predictedData[index].value
    );

    const confidenceIntervals = computeConfidenceIntervals(
      rezidua,
      predictedData
    );

    const savedUsedData = new UsedVatData(
      data,
      trainingData,
      { key: lastKey, data: testData },
      aggMonthNumbersInPercent,
      activeMonth,
      predictedVat
    );

    const usedData: DataForVatPrediction = {
      data: savedUsedData.getData(),
      trainingData: savedUsedData.getTrainingData(),
      testData: savedUsedData.getTestData(),
      aggMonthNumbersInPercent: savedUsedData.getAggMonthNumbersInPercent(),
      activeMonth: savedUsedData.getActiveMonth(),
    };

    return {
      usedData,
      confidenceIntervals,
      statistics: createStatitics(
        testData[lastKey].map(item => {
          return item.vat_val;
        }),
        confidenceIntervals
      ),
    };
  } else {
    console.warn(
      "No active month found in data, prediction cannot be performed correctly."
    );
    return undefined;
  }
}

export default function vatPrediction():
  | {
      usedData: DataForVatPrediction;
      confidenceIntervals: IntervalData;
      statistics: Statistics;
    }
  | undefined {
  const monthlyPrediction = monthlyVatPrediction();

  if (monthlyPrediction === undefined) {
    console.warn(
      "Historical sum or active month sum is zero or negative. Prediction cannot be performed."
    );
    return undefined;
  }

  return monthlyPrediction;
}
