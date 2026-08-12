import { DphData } from "../zod-schemas/dphData";

function prepareDPHData(
  days: number,
  period: "MONTHLY" | "QUARTERLY",
  yearsToAddBack?: number
): DphData | [] {
  const monthDaysInOneYear: DphData = {};
  const monthDaysAcrossPastYears: DphData = {};

  const today = new Date();

  if (period === "MONTHLY") {
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + daysToAddToNextMonth(date) + i);
      const keyDate = date.getFullYear() + "-" + (date.getMonth() + 1);

      if (!monthDaysInOneYear[keyDate]) monthDaysInOneYear[keyDate] = [];

      const dph_kc = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
      monthDaysInOneYear[keyDate].push({ date, dph_kc });
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

          const dph_kc = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
          monthDaysAcrossPastYears[keyDate].push({ date, dph_kc });
        }
      }
    }

    return { ...monthDaysAcrossPastYears, ...additionalDays };
  }

  return [];
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
      getDaysInMonths(new Date(data[monthKey][0].date)) != 0 &&
      data[monthKey].length ===
        getDaysInMonths(new Date(data[monthKey][0].date))
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
  monthlyType?: "CLOSED" | "ACTIVE", // u quarterly vymyslet neco lepšího
  quarterlyType?: "PAST_YEARS" | "CURRENT_YEAR"
):
  | { date: Date; dph_kc: number }[][]
  | { date: Date; dph_kc: number }[]
  | undefined {
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
            new Date(monthData[Math.round(monthData.length / 2)].date)
          )
        );
    })[0];

    const closedMonthWithDays = Object.values(data).filter(monthData => {
      if (monthData.length > 0)
        return (
          monthData.length ===
          getDaysInMonths(
            new Date(monthData[Math.round(monthData.length / 2)].date)
          )
        );
    });

    return monthlyType === "ACTIVE" ? activeMonthWithDays : closedMonthWithDays;
  }

  return undefined;
}

function normalizedInPercent(
  averageDaysData: {
    date: Date;
    dph_kc: number;
  }[],
  sumOfAveragedph: number,
  activeDaysCount: number,
  activeMonthDaysCount: number
): {
  date: Date;
  dph_kc: number;
}[] {
  const dataInPercent = averageDaysData.map(day => {
    return {
      ...day,
      dph_kc: ((day.dph_kc ?? 0) / sumOfAveragedph) * 100,
    };
  });

  console.log("pocet dni v mesici " + activeMonthDaysCount);
  console.log("pocet uplynulych dnu aktivniho mesice " + activeDaysCount);

  const redistributed = redistributeExtraDays(
    dataInPercent,
    activeDaysCount,
    activeMonthDaysCount
  );

  return redistributed;
}

function aggregateClosedMonthsDPHvaluesbyDay(
  closedMonths: {
    date: Date;
    dph_kc: number;
  }[][]
): { date: Date; dph_kc: number }[] {
  const aggregatedData: { date: Date; dph_kc: number }[] = [];

  const maxDays = Math.max(...closedMonths.map(month => month.length));

  for (let day = 0; day < maxDays; day++) {
    const days = closedMonths
      .map(month => month[day])
      .filter(value => value?.dph_kc != null && value.date != null);

    if (days.length === 0) continue;

    const sumOfDays = days.reduce((sum, day) => sum + (day.dph_kc ?? 0), 0);

    const averageDay = sumOfDays / days.length;

    //?
    aggregatedData.push({
      date: new Date(
        days[days.length - 1].date.getFullYear(),
        days[days.length - 1].date.getMonth() + 1,
        days[days.length - 1].date.getDate()
      ),
      dph_kc: averageDay,
    });
  }

  return aggregatedData;
}

function redistributeExtraDays(
  month: { date: Date; dph_kc: number }[],
  activeDaysCount: number,
  activeMonthDaysCount: number
): { date: Date; dph_kc: number }[] {
  // historicke dny, ktere v aktualnim nemaji misto
  const extraHistoricalDays = month.slice(activeMonthDaysCount);

  // procenta na distribuci
  const percentageToRedistribute = extraHistoricalDays.reduce(
    (sum, day) => sum + day.dph_kc,
    0
  );

  const remainingActiveDays = activeMonthDaysCount - activeDaysCount;

  if (remainingActiveDays <= 0) {
    return month.slice(0, activeMonthDaysCount);
  }

  const percentagePerRemainingDay =
    percentageToRedistribute / remainingActiveDays;

  // Dny, které uz probehly - nesahat!!
  const pastDays = month.slice(0, activeDaysCount);

  const futureDays = month
    .slice(activeDaysCount, activeMonthDaysCount)
    .map(day => {
      return {
        ...day,
        dph_kc: day.dph_kc + percentagePerRemainingDay,
      };
    });

  return [...pastDays, ...futureDays];
}

function aggregateMonthlyDPHvaluesbyDay(data: DphData): {
  aggNumbersInPercent: {
    date: Date;
    dph_kc: number;
  }[];
  activeMonth: { date: Date; dph_kc: number }[];
  sumOfActiveMonth: number;
} {
  const closedMoths = getMonths(data, "MONTHLY", "CLOSED") as {
    date: Date;
    dph_kc: number;
  }[][];

  const activeMonth = getMonths(data, "MONTHLY", "ACTIVE") as {
    date: Date;
    dph_kc: number;
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

  const sumOfdphInMonths = closedMoths.map(monthData => {
    return monthData.reduce((sum, val) => (sum += val.dph_kc), 0);
  });

  const sumOfdphInActiveMonth = activeMonth.reduce(
    (sum, val) => (sum += val.dph_kc),
    0
  );

  console.log("sumOfdphInMonths", sumOfdphInMonths);
  // console.log("sumOfdphInActiveMonth", sumOfdphInActiveMonth);

  const aggregatedClosedMonth =
    aggregateClosedMonthsDPHvaluesbyDay(closedMoths);

  console.log("data", data, "data.length", Object.keys(data).length);
  console.log("aggregatedMonth", aggregatedClosedMonth);

  const normalizedsInPercent = normalizedInPercent(
    aggregatedClosedMonth,
    aggregatedClosedMonth.reduce((sum, day) => sum + (day.dph_kc ?? 0), 0),
    activeMonth.length,
    getDaysInMonths(activeMonth[0].date)
  );

  console.log("normalizedsInPercent", normalizedsInPercent);

  return {
    aggNumbersInPercent: normalizedsInPercent,
    activeMonth: activeMonth,
    sumOfActiveMonth: sumOfdphInActiveMonth,
  };
}

function monthlyDPHPrediction(): number {
  const data = prepareDPHData(93, "MONTHLY") as DphData;

  if (Object.values(data).some(days => days.length === 0)) return 0;

  const { aggNumbersInPercent, activeMonth, sumOfActiveMonth } =
    aggregateMonthlyDPHvaluesbyDay(data) as {
      aggNumbersInPercent: {
        date: Date;
        dph_kc: number;
      }[];
      activeMonth: { date: Date; dph_kc: number }[];
      sumOfActiveMonth: number;
    };

  const historyPercentage = aggNumbersInPercent
    .slice(0, activeMonth.length)
    .reduce((sum, val) => (sum += val.dph_kc ?? 0), 0);

  const predictedDph = (sumOfActiveMonth / historyPercentage) * 100;

  console.log(
    "sum of percent",
    aggNumbersInPercent.reduce((sum, day) => sum + day.dph_kc, 0)
  );
  console.log("predicted", predictedDph);

  if (historyPercentage <= 0 || sumOfActiveMonth <= 0) {
    return 0;
  }

  return predictedDph;
}

export default function dphPrediction(): number {
  // nekdy muze stat davat a nekdy brat ?
  // měsičními je na konzultaci
  // čtvrtletními plátci DPH není, lze použít měsíční predikci (ta není 100%) se sečtením tří měsíců

  /*
    Pokud chce firma řešit predikci cash flow pomocí modelu, má s velmi velkou prav
    děpodobností vyšší obrat než jeden milion korun. Proto DPH zahrneme do modelu jako
    jednu z důležitých oblastí cash flow. Pokud by se náhodou stalo, že by společnost, která
    bude tento model v praxi používat, nebyla plátcem DPH, je možné tuto oblast z modelu
    vyřadit bez větších problémů
  */

  // Například se může stát,že budeme mít 1. den v měsíci, který bude o víkendu a nepřijde ani neodejde v ten den žádná faktura či jiný doklad ovlivňující DPH
  // Bude se to brat vzdy jen do pulky mesice (11. den max) (zatím beru celý měsíc)
  // TODO - co se dny v mesici, ktere chybi, pak nelze delat prumery dnu mezi ostatními mesici (napč leden, unor, brezen) (vyřešeno uz v aggregateDPHvaluesbyDay, je to ale správně?)
  // Bereme pro prdikci castku celkoveho dph minuleho mesice k vypoctu toho soucasneho
  // Tigger na prepocet nove dodanych v soucasnym i minulym mesici
  // zkontroluj cisla - vypada to dobře

  return monthlyDPHPrediction();
}
