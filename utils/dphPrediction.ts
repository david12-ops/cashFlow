import { AggregatedValues, DphData } from "../zod-schemas/dphData";

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

function normalizeClosedMonthsDPHvaluesbyDay(
  closedMonths: {
    date: Date;
    dph_kc: number;
  }[][],
  activeMonth: { date: Date; dph_kc: number }[],
  day: number,
  sumOfDPHbyMonths: number[],
  sumOfdphInActiveMonth: number
): {
  closedMonth: { date: Date | null; dph_kc: number | null }[];
  pairedWithActive: { date: Date; dph_kc: number }[];
} {
  const normalizedData: {
    closedMonth: { date: Date | null; dph_kc: number | null }[];
    pairedWithActive: { date: Date; dph_kc: number }[];
  } = { closedMonth: [], pairedWithActive: [] };

  const normalizedClosedMonths: { date: Date | null; dph_kc: number | null }[] =
    [];
  const normalizedActiveMonth: { date: Date; dph_kc: number }[] = [];

  const activeDay = activeMonth[day];

  closedMonths.forEach((months, index) => {
    const sum = sumOfDPHbyMonths[index];

    const normalizedAmount =
      months[day] && sum > 0 ? (months[day].dph_kc / sum) * 100 : null;

    normalizedClosedMonths.push({
      date: months[day]?.date ?? null,
      dph_kc: normalizedAmount,
    });


  });

  if (activeDay && sumOfdphInActiveMonth > 0) {
    normalizedActiveMonth.push({
      date: activeDay.date,
      dph_kc: (activeDay.dph_kc / sumOfdphInActiveMonth) * 100,
    });
  }

  normalizedData.closedMonth = normalizedClosedMonths;
  normalizedData.pairedWithActive = normalizedActiveMonth;

  return normalizedData;
}

function aggregateNormalizedInPercent(
  data: {
    date: Date | null;
    dph_kc: number | null;
  }[]
): { date: Date | null; dph_kc: number | null }[] {
  const aggregatedData: { date: Date | null; dph_kc: number | null }[] = [];

  for (let i = 0; i < data.length; i += 3) {
    const firstDayOfMonth = data[i];
    const secondDayOfMonth = data[i + 1];
    const thirdDayOfMonth = data[i + 2];

    if (firstDayOfMonth && secondDayOfMonth && thirdDayOfMonth)
      if (
        firstDayOfMonth?.date &&
        secondDayOfMonth?.date &&
        thirdDayOfMonth?.date &&
        firstDayOfMonth.dph_kc !== null &&
        secondDayOfMonth.dph_kc !== null &&
        thirdDayOfMonth.dph_kc !== null
      ) {
        aggregatedData.push({
          date: new Date(
            firstDayOfMonth?.date.getFullYear(),
            firstDayOfMonth?.date.getMonth(),
            firstDayOfMonth?.date.getDate()
          ),
          dph_kc:
            (firstDayOfMonth.dph_kc +
              secondDayOfMonth.dph_kc +
              thirdDayOfMonth.dph_kc) /
            3,
        });
      } else {
        console.log("v reseni");
      }
  }

  return aggregatedData;
}

// function aggregateInPercentActiveMonth(
//   closedMonthsPairedWithActive: {
//     date: Date | null;
//     dph_kc: number | null;
//   }[],
//   activeMonth: { date: Date; dph_kc: number }[],
//   sumOfDPHbyMonth: number
// ): { date: Date | null; dph_kc: number | null }[] {}

function aggregateMonthlyDPHvaluesbyDay(data: DphData): AggregatedValues | [] {
  const closedMoths = getMonths(data, "MONTHLY", "CLOSED") as {
    date: Date;
    dph_kc: number;
  }[][];

  const activeMonth = getMonths(data, "MONTHLY", "ACTIVE") as {
    date: Date;
    dph_kc: number;
  }[];

  const normalizedMonths = {
    closedMonth: [] as { date: Date | null; dph_kc: number | null }[],
    pairedWithActive: [] as { date: Date; dph_kc: number }[],
  };

  if (
    !closedMoths ||
    closedMoths.length === 0 ||
    !activeMonth ||
    activeMonth.length === 0
  )
    return [];

  const sumOfdphInMonths = closedMoths.map(monthData => {
    return monthData.reduce((sum, val) => (sum += val.dph_kc), 0);
  });

  const sumOfdphInActiveMonth = activeMonth.reduce(
    (sum, val) => (sum += val.dph_kc),
    0
  );

  console.log("sumOfdphInMonths", sumOfdphInMonths);
  console.log("sumOfdphInActiveMonth", sumOfdphInActiveMonth);

  for (let i = 0; i < 31; i++) {
    const normalized = normalizeClosedMonthsDPHvaluesbyDay(
      closedMoths,
      activeMonth,
      i,
      sumOfdphInMonths,
      sumOfdphInActiveMonth
    );

    normalizedMonths.closedMonth.push(...normalized.closedMonth);
    normalizedMonths.pairedWithActive.push(...normalized.pairedWithActive);
  }

  // console.log(
  //   "activeMonth",
  //   activeMonth,
  //   "activeMonth.length",
  //   activeMonth.length
  // );

  console.log(
    "activeMonth",
    normalizedMonths.pairedWithActive,
    "normalizedMonths.pairedWithActive.length",
    normalizedMonths.pairedWithActive.length
  );

  console.log(
    "normalizedClosedMonths",
    normalizedMonths.closedMonth,
    normalizedMonths.closedMonth.length
  );

  // normalizedClosedMonths.forEach(item => {
  //   console.log(
  //     "item",
  //     "month",
  //     item.date?.getMonth(),
  //     "day",
  //     item.date?.getDate(),
  //     "value",
  //     item.dph_kc
  //   );
  // });

  console.log("data", data, "data.length", Object.keys(data).length);

  // const aggregatedNormalizedsInPercent =
  //   aggregateNormalizedInPercent(normalizedCMonths);

  // console.log(
  //   "aggregatedNormalizedsInPercent",
  //   aggregatedNormalizedsInPercent,
  //   "aggregatedNormalizedsInPercent.length",
  //   aggregatedNormalizedsInPercent ? 1 : 0
  // );

  // const aggregatedInPercentActiveMonth = aggregateInPercentActiveMonth(
  //   aggregatedNormalizedClosedMonthsInPercent.slice(0, activeMonth.length),
  //   activeMonth,
  //   activeMonth.reduce((sum, val) => (sum += val.dph_kc), 0)
  // );

  // console.log(
  //   "aggregatedInPercentActiveMonth",
  //   aggregatedInPercentActiveMonth,
  //   "aggregatedInPercentActiveMonth.length",
  //   aggregatedInPercentActiveMonth ? 1 : 0
  // );

  // const totalPercent = [
  //   ...aggregatedNormalizedClosedMonthsInPercent,
  //   ...aggregatedInPercentActiveMonth,
  // ];

  return {
    inPercant: totalPercent.slice(
      0,
      getDaysInMonths(activeMonth[Math.round(activeMonth.length / 2)].date)
    ),
    inAverageValue: 0,
  };
}

function monthlyDPHPrediction(): number {
  const data = prepareDPHData(93, "MONTHLY") as DphData;

  if (Object.values(data).some(days => days.length === 0)) return 0;

  const { inPercant, inAverageValue } = aggregateMonthlyDPHvaluesbyDay(
    data
  ) as AggregatedValues;

  if (inPercant.length === 0 || inAverageValue.length === 0) return 0;

  const sumAvarageDphInMonth = inAverageValue.reduce(
    (sum, val) => (sum += val.dph_kc),
    0
  );
  const sumPercentInMonth = inPercant.reduce(
    (sum, val) => (sum += val.dph_kc),
    0
  );

  console.log("sumAvarageDphInMonth", sumAvarageDphInMonth);
  console.log("sumPercentInMonth", sumPercentInMonth);

  const predictedDph = (sumAvarageDphInMonth / 100) * sumPercentInMonth;

  console.log("predicted", predictedDph);

  return Math.round(predictedDph * 100) / 100;
}

export default function dphPrediction(period: "MONTHLY" | "QUARTERLY"): number {
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

  if (period === "MONTHLY") return monthlyDPHPrediction();

  // if (period === "QUARTERLY") return quarterlyDPHPrediction();

  return 0;
}
