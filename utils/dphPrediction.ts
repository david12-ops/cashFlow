import { DphData, MonthData, MonthsData } from "../zod-schemas";

function prepareDPHData(
  days: number,
  period: "MONTHLY" | "QUARTERLY",
  yearsToAddBack?: number
): DphData | [] {
  const monthDaysInOneYear: DphData = {};
  const monthDaysAcrossPastYears: DphData = {};

  const today = new Date();
  const baseValue = 100000;

  if (period === "MONTHLY") {
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + daysToAddToNextMonth(date) + i);
      const keyDate = date.getFullYear() + "-" + (date.getMonth() + 1);

      if (!monthDaysInOneYear[keyDate]) monthDaysInOneYear[keyDate] = [];

      const dph_val = computeDPHvalue(
        {
          baseValue,
          day: i,
          countOfdays: days,
        },
        date
      );
      monthDaysInOneYear[keyDate].push({ Date_val: date, Dph_val: dph_val });
    }

    return monthDaysInOneYear;
  }

  if (period === "QUARTERLY" && yearsToAddBack) {
    const lastDate = { year: 0, month: 0 };
    const additionalDays = prepareDPHData(93, "MONTHLY") as DphData;
    const lastKey = getLastKey(additionalDays);

    if (!lastKey) return [];
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

          const dph_val = computeDPHvalue(
            {
              baseValue,
              day,
              countOfdays: 365,
            },
            date
          );
          monthDaysAcrossPastYears[keyDate].push({
            Date_val: date,
            Dph_val: dph_val,
          });
        }
      }
    }

    return { ...monthDaysAcrossPastYears, ...additionalDays };
  }

  return [];
}

function computeDPHvalue(
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

function getLastKey(data: DphData): string | undefined {
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
      getDaysInMonths(new Date(data[monthKey][0].Date_val)) != 0 &&
      data[monthKey].length ===
        getDaysInMonths(new Date(data[monthKey][0].Date_val))
    ) {
      lastClosedMonthKey = monthKey;
      closed = true;
    } else countOfKeys--;
  }

  return lastClosedMonthKey;
}

function getMonths(
  data: DphData,
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
            new Date(monthData[Math.round(monthData.length / 2)].Date_val)
          )
        );
    })[0];

    const closedMonthWithDays = Object.values(data).filter(monthData => {
      if (monthData.length > 0)
        return (
          monthData.length ===
          getDaysInMonths(
            new Date(monthData[Math.round(monthData.length / 2)].Date_val)
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
      Dph_val: ((day.Dph_val ?? 0) / sumOfAveragedph) * 100,
    };
  });

  // console.log("number of days in the month " + activeMonthDaysCount);
  // console.log("number of elapsed days of the active month " + activeDaysCount);

  const redistributed = redistributeExtraDays(
    dataInPercent,
    activeDaysCount,
    activeMonthDaysCount
  );

  return redistributed;
}

function aggregateClosedMonthsDPHvaluesbyDay(
  closedMonths: MonthsData
): MonthData {
  const aggregatedData: MonthData = [];

  const maxDays = Math.max(...closedMonths.map(month => month.length));

  for (let day = 0; day < maxDays; day++) {
    const days = closedMonths
      .map(month => month[day])
      .filter(value => value?.Dph_val != null && value.Date_val != null);

    if (days.length === 0) continue;

    const sumOfDays = days.reduce((sum, day) => sum + (day.Dph_val ?? 0), 0);

    const averageDphDay = sumOfDays / days.length;

    aggregatedData.push({
      Date_val: new Date(
        days[days.length - 1].Date_val.getFullYear(),
        days[days.length - 1].Date_val.getMonth() + 1,
        days[days.length - 1].Date_val.getDate()
      ),
      Dph_val: averageDphDay,
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
    (sum, day) => sum + day.Dph_val,
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
        Dph_val: day.Dph_val + percentagePerRemainingDay,
      };
    });

  return [...pastDays, ...futureDays];
}

function aggregateMonthlyDPHvaluesbyDay(data: DphData): {
  aggNumbersInPercent: MonthData;
  activeMonth: MonthData;
  sumOfActiveMonth: number;
} {
  const closedMoths = getMonths(data, "MONTHLY", "CLOSED") as {
    Date_val: Date;
    Dph_val: number;
  }[][];

  const activeMonth = getMonths(data, "MONTHLY", "ACTIVE") as {
    Date_val: Date;
    Dph_val: number;
  }[];

  if (
    !closedMoths ||
    closedMoths.length === 0 ||
    !activeMonth ||
    activeMonth.length === 0
  )
    return {
      aggNumbersInPercent: [],
      activeMonth: [],
      sumOfActiveMonth: 0,
    };

  const sumOfdphInActiveMonth = activeMonth.reduce(
    (sum, val) => (sum += val.Dph_val),
    0
  );

  const aggregatedClosedMonth =
    aggregateClosedMonthsDPHvaluesbyDay(closedMoths);

  console.log("data", data, "data.length", Object.keys(data).length);
  console.log("aggregatedMonth", aggregatedClosedMonth);

  const normalizedsInPercent = normalizedInPercent(
    aggregatedClosedMonth,
    aggregatedClosedMonth.reduce((sum, day) => sum + (day.Dph_val ?? 0), 0),
    activeMonth.length,
    getDaysInMonths(activeMonth[0].Date_val)
  );

  console.log("normalizedsInPercent", normalizedsInPercent);

  return {
    aggNumbersInPercent: normalizedsInPercent,
    activeMonth: activeMonth,
    sumOfActiveMonth: sumOfdphInActiveMonth,
  };
}

function prepareTestingData(data: DphData): {
  data: Record<
    string,
    {
      Date_val: Date;
      Dph_val: number;
    }[]
  >;
  key: string;
} {
  const activeMonth = getMonths(data, "MONTHLY", "ACTIVE") as MonthData;

  if (!activeMonth || activeMonth.length === 0) {
    console.warn(
      "No active month found in data, prediction cannot be performed correctly."
    );
    return { data: {}, key: "" };
  }

  const activeDateInActiveMonth = activeMonth![0].Date_val;
  const keyDate =
    activeDateInActiveMonth.getFullYear() +
    "-" +
    activeDateInActiveMonth.getMonth();

  const daysOfAciveMonth = getDaysInMonths(activeDateInActiveMonth);

  const newData = prepareDPHData(daysOfAciveMonth, "MONTHLY");

  const [key, values] = Object.entries(newData)[0];

  console.log(key);
  console.log(values);

  const newMonth: Record<
    string,
    {
      Date_val: Date;
      Dph_val: number;
    }[]
  > = {};

  newMonth[keyDate] = [];

  values.forEach(itm => {
    newMonth[keyDate].push({
      ...itm,
      Date_val: new Date(
        itm.Date_val.getFullYear(),
        itm.Date_val.getMonth() + 1,
        itm.Date_val.getDate()
      ),
    });
  });

  return { data: newMonth, key: keyDate };
}

function monthlyDPHPrediction(): number {
  let data = prepareDPHData(124, "MONTHLY") as DphData;

  if (Object.values(data).some(days => days.length === 0)) return 0;

  // Its for testing data, we need to prepare the last active month, and then change the days
  const testingData = prepareTestingData(data);

  data = {
    ...Object.fromEntries(Object.entries(data).slice(0, -1)),
    ...testingData.data,
  };

  data = Object.fromEntries(Object.entries(data).slice(0, 124));

  const { aggNumbersInPercent, activeMonth, sumOfActiveMonth } =
    aggregateMonthlyDPHvaluesbyDay(data);

  const historyPercentage = aggNumbersInPercent
    .slice(0, activeMonth.length)
    .reduce((sum, val) => (sum += val.Dph_val ?? 0), 0);

  const predictedDph = (sumOfActiveMonth / historyPercentage) * 100;

  console.log(
    "sum of percent",
    aggNumbersInPercent.reduce((sum, day) => sum + day.Dph_val, 0)
  );

  console.log("testingData", testingData);
  console.log(
    "sum from testingData",
    testingData.data[testingData.key].reduce((sum, day) => sum + day.Dph_val, 0)
  );
  console.log("predicted", predictedDph);

  if (historyPercentage <= 0 || sumOfActiveMonth <= 0) {
    return 0;
  }

  return predictedDph;
}

export default function dphPrediction(): number {
  return monthlyDPHPrediction();
}
