import {
  AmountsPairedToCentroid,
  Cluster,
  Currency,
  CurrencyConvertMap,
  PredictionWageResult,
  WagesData,
  EchangeRates,
} from "@/zod-schemas";

function createCurrencyRatesMap(year: number): CurrencyConvertMap {
  const exchangeRates: EchangeRates = {
    2021: {
      CZK: [
        { currency: "CZK", value: 1 },
        { currency: "EUR", value: 0.03899 },
        { currency: "USD", value: 0.04613 },
        { currency: "GBP", value: 0.03352 },
        { currency: "PLN", value: 0.1778 },
      ],
      EUR: [
        { currency: "CZK", value: 25.65 },
        { currency: "EUR", value: 1 },
        { currency: "USD", value: 1.183 },
        { currency: "GBP", value: 0.86 },
        { currency: "PLN", value: 4.56 },
      ],
      USD: [
        { currency: "CZK", value: 21.68 },
        { currency: "EUR", value: 0.845 },
        { currency: "USD", value: 1 },
        { currency: "GBP", value: 0.727 },
        { currency: "PLN", value: 3.93 },
      ],
      GBP: [
        { currency: "CZK", value: 29.83 },
        { currency: "EUR", value: 1.163 },
        { currency: "USD", value: 1.376 },
        { currency: "GBP", value: 1 },
        { currency: "PLN", value: 5.32 },
      ],
      PLN: [
        { currency: "CZK", value: 5.625 },
        { currency: "EUR", value: 0.219 },
        { currency: "USD", value: 0.254 },
        { currency: "GBP", value: 0.188 },
        { currency: "PLN", value: 1 },
      ],
    },

    2022: {
      CZK: [
        { currency: "CZK", value: 1 },
        { currency: "EUR", value: 0.04072 },
        { currency: "USD", value: 0.04281 },
        { currency: "GBP", value: 0.03502 },
        { currency: "PLN", value: 0.1827 },
      ],
      EUR: [
        { currency: "CZK", value: 24.56 },
        { currency: "EUR", value: 1 },
        { currency: "USD", value: 1.051 },
        { currency: "GBP", value: 0.86 },
        { currency: "PLN", value: 4.49 },
      ],
      USD: [
        { currency: "CZK", value: 23.36 },
        { currency: "EUR", value: 0.951 },
        { currency: "USD", value: 1 },
        { currency: "GBP", value: 0.818 },
        { currency: "PLN", value: 4.27 },
      ],
      GBP: [
        { currency: "CZK", value: 28.56 },
        { currency: "EUR", value: 1.163 },
        { currency: "USD", value: 1.223 },
        { currency: "GBP", value: 1 },
        { currency: "PLN", value: 5.18 },
      ],
      PLN: [
        { currency: "CZK", value: 5.474 },
        { currency: "EUR", value: 0.223 },
        { currency: "USD", value: 0.234 },
        { currency: "GBP", value: 0.193 },
        { currency: "PLN", value: 1 },
      ],
    },

    2023: {
      CZK: [
        { currency: "CZK", value: 1 },
        { currency: "EUR", value: 0.04166 },
        { currency: "USD", value: 0.04505 },
        { currency: "GBP", value: 0.03592 },
        { currency: "PLN", value: 0.1864 },
      ],
      EUR: [
        { currency: "CZK", value: 24.0 },
        { currency: "EUR", value: 1 },
        { currency: "USD", value: 1.081 },
        { currency: "GBP", value: 0.862 },
        { currency: "PLN", value: 4.47 },
      ],
      USD: [
        { currency: "CZK", value: 22.2 },
        { currency: "EUR", value: 0.925 },
        { currency: "USD", value: 1 },
        { currency: "GBP", value: 0.798 },
        { currency: "PLN", value: 4.13 },
      ],
      GBP: [
        { currency: "CZK", value: 27.84 },
        { currency: "EUR", value: 1.16 },
        { currency: "USD", value: 1.253 },
        { currency: "GBP", value: 1 },
        { currency: "PLN", value: 5.16 },
      ],
      PLN: [
        { currency: "CZK", value: 5.365 },
        { currency: "EUR", value: 0.224 },
        { currency: "USD", value: 0.242 },
        { currency: "GBP", value: 0.194 },
        { currency: "PLN", value: 1 },
      ],
    },

    2024: {
      CZK: [
        { currency: "CZK", value: 1 },
        { currency: "EUR", value: 0.03981 },
        { currency: "USD", value: 0.04307 },
        { currency: "GBP", value: 0.03388 },
        { currency: "PLN", value: 0.1715 },
      ],
      EUR: [
        { currency: "CZK", value: 25.12 },
        { currency: "EUR", value: 1 },
        { currency: "USD", value: 1.082 },
        { currency: "GBP", value: 0.851 },
        { currency: "PLN", value: 4.31 },
      ],
      USD: [
        { currency: "CZK", value: 23.22 },
        { currency: "EUR", value: 0.924 },
        { currency: "USD", value: 1 },
        { currency: "GBP", value: 0.786 },
        { currency: "PLN", value: 3.98 },
      ],
      GBP: [
        { currency: "CZK", value: 29.52 },
        { currency: "EUR", value: 1.175 },
        { currency: "USD", value: 1.272 },
        { currency: "GBP", value: 1 },
        { currency: "PLN", value: 5.03 },
      ],
      PLN: [
        { currency: "CZK", value: 5.831 },
        { currency: "EUR", value: 0.232 },
        { currency: "USD", value: 0.251 },
        { currency: "GBP", value: 0.199 },
        { currency: "PLN", value: 1 },
      ],
    },

    2025: {
      CZK: [
        { currency: "CZK", value: 1 },
        { currency: "EUR", value: 0.0405 },
        { currency: "USD", value: 0.04194 },
        { currency: "GBP", value: 0.035 },
        { currency: "PLN", value: 0.1733 },
      ],
      EUR: [
        { currency: "CZK", value: 24.69 },
        { currency: "EUR", value: 1 },
        { currency: "USD", value: 1.035 },
        { currency: "GBP", value: 0.864 },
        { currency: "PLN", value: 4.28 },
      ],
      USD: [
        { currency: "CZK", value: 23.84 },
        { currency: "EUR", value: 0.966 },
        { currency: "USD", value: 1 },
        { currency: "GBP", value: 0.832 },
        { currency: "PLN", value: 4.11 },
      ],
      GBP: [
        { currency: "CZK", value: 28.57 },
        { currency: "EUR", value: 1.157 },
        { currency: "USD", value: 1.202 },
        { currency: "GBP", value: 1 },
        { currency: "PLN", value: 4.95 },
      ],
      PLN: [
        { currency: "CZK", value: 5.77 },
        { currency: "EUR", value: 0.234 },
        { currency: "USD", value: 0.243 },
        { currency: "GBP", value: 0.202 },
        { currency: "PLN", value: 1 },
      ],
    },
  };

  switch (year) {
    case 2021:
      return exchangeRates[2021];
    case 2022:
      return exchangeRates[2022];
    case 2023:
      return exchangeRates[2023];
    case 2024:
      return exchangeRates[2024];
    case 2025:
      return exchangeRates[2025];
    default:
      throw Error("Data with this " + `${year}` + "does not exist");
  }
}

function convertValueByCurrency(
  fromCurrency: Currency,
  toCurrency: Currency,
  value: number,
  ratesMap: CurrencyConvertMap
): number {
  const exchangeItem = ratesMap[fromCurrency].find(
    cur => cur.currency === toCurrency
  );

  if (exchangeItem) {
    return value * exchangeItem.value;
  } else
    throw new Error(
      `Exchange rate from ${fromCurrency} to ${toCurrency} not found.`
    );
}

function convertBaseAmountToOneCurrency(
  data: WagesData,
  currency: Currency
): WagesData {
  return data.map(item => {
    const ratesMap: CurrencyConvertMap = createCurrencyRatesMap(
      item.transactionDate.getFullYear()
    );

    return {
      ...item,
      BaseAmount: convertValueByCurrency(
        item.currency,
        currency,
        item.baseAmount,
        ratesMap
      ),
      currency: currency,
    };
  });
}

function prepareWageCostData(): WagesData {
  // For now, normalize to CZK, but feel free to generate data in other currencies
  // You can use convertBaseAmountToOneCurrency to make predictions in a certain currency regardless of the fact that there are multiple different currencies in the data
  const wageData: WagesData = [];

  const startYear = 2021;
  const endYear = 2025;

  const divisions = [1, 2, 3, 4];
  const currencies: Currency[] = ["CZK", "EUR", "USD", "GBP", "PLN"];

  const random = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const round = (value: number): number => {
    return Math.round(value * 100) / 100;
  };

  const createDimDateId = (date: Date): number => {
    return Number(
      `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`
    );
  };

  /*
   * Approximate number of employees in each division.
   * This way, the exact same number of records won't be generated every month.
   */
  const employeesPerDivision = {
    1: 30,
    2: 20,
    3: 15,
    4: 10,
  };

  for (let year = startYear; year <= endYear; year++) {
    const ratesMap = createCurrencyRatesMap(year);

    for (let month = 0; month < 12; month++) {
      /*
       * Mild wage growth over time.
       *
       * 2021 → 1.00
       * 2022 → 1.05
       * 2023 → 1.10
       * ...
       */
      const yearIndex = year - startYear;
      const salaryGrowth = Math.pow(1.05, yearIndex);
      const pickedCurrencyIndex = Math.floor(Math.random() * currencies.length);

      /*
       * Day 15 → wages
       */
      const salaryDay = new Date(year, month, 15);

      /*
       * Day 20 → deductions
       */
      const deductionDay = new Date(year, month, 20);

      /*
       * -------------------------
       * WAGES – account 331xxx
       * -------------------------
       */
      for (const division of divisions) {
        const employeeCount =
          employeesPerDivision[division as keyof typeof employeesPerDivision];

        for (let employee = 0; employee < employeeCount; employee++) {
          /*
           * Employee's base salary.
           */
          const baseSalary = random(35_000, 70_000);

          /*
           * Random deviation ±10%.
           */
          const variation = random(0.9, 1.1);

          let salary =
            convertValueByCurrency(
              "CZK",
              currencies[pickedCurrencyIndex],
              baseSalary,
              ratesMap
            ) *
            variation *
            salaryGrowth;

          /*
           * In December and June we occasionally add a bonus.
           */
          if ((month === 5 || month === 11) && Math.random() < 0.35)
            salary += convertValueByCurrency(
              "CZK",
              currencies[pickedCurrencyIndex],
              random(5_000, 30_000),
              ratesMap
            );

          salary = round(salary);

          /*
           * Analytical account 331xxx.
           *
           * The last numbers simulate different analytical accounts.
           */
          const account = `331${String(division).padStart(3, "0")}`;

          wageData.push({
            dimDateId: createDimDateId(salaryDay),
            transactionDate: new Date(salaryDay),
            baseAmount: salary,
            account: account,
            division: division,
            currency: currencies[pickedCurrencyIndex],
          });
        }

        /*
         * -------------------------
         * SOCIAL – 336xxx
         * -------------------------
         */
        const totalSalary = wageData
          .filter(
            item =>
              item.transactionDate.getFullYear() === year &&
              item.transactionDate.getMonth() === month &&
              item.division === division &&
              item.account.startsWith("331")
          )
          .reduce((sum, item) => sum + item.baseAmount, 0);

        const social = round(totalSalary * random(0.23, 0.25));

        wageData.push({
          dimDateId: createDimDateId(deductionDay),
          transactionDate: new Date(deductionDay),
          baseAmount: social,
          account: `336${String(division).padStart(3, "0")}`,
          division: division,
          currency: currencies[pickedCurrencyIndex],
        });

        /*
         * -------------------------
         * HEALTH – 336xxx
         * -------------------------
         */
        const health = round(totalSalary * random(0.09, 0.1));

        wageData.push({
          dimDateId: createDimDateId(deductionDay),
          transactionDate: new Date(deductionDay),
          baseAmount: health,
          account: `336${String(division + 100).padStart(3, "0")}`,
          division: division,
          currency: currencies[pickedCurrencyIndex],
        });

        /*
         * -------------------------
         * TAX – 342xxx
         * -------------------------
         */
        const tax = round(totalSalary * random(0.1, 0.15));

        wageData.push({
          dimDateId: createDimDateId(deductionDay),
          transactionDate: new Date(deductionDay),
          baseAmount: tax,
          account: `342${String(division).padStart(3, "0")}`,
          division: division,
          currency: currencies[pickedCurrencyIndex],
        });
      }

      /*
       * -------------------------
       * OCCASIONAL BONUSES
       * -------------------------
       *
       * We'll add a few more entries
       * so the dataset isn't too regular.
       */
      if (Math.random() < 0.25) {
        const bonusCount = Math.floor(random(3, 10));

        for (let i = 0; i < bonusCount; i++) {
          const division =
            divisions[Math.floor(Math.random() * divisions.length)];

          const bonusDay = new Date(year, month, 25);

          wageData.push({
            dimDateId: createDimDateId(bonusDay),
            transactionDate: bonusDay,
            baseAmount: convertValueByCurrency(
              "CZK",
              currencies[pickedCurrencyIndex],
              round(random(5_000, 25_000)),
              ratesMap
            ),
            account: `331${String(division).padStart(3, "0")}`,
            division: division,
            currency: currencies[pickedCurrencyIndex],
          });
        }
      }
    }
  }

  return convertBaseAmountToOneCurrency(wageData, "CZK");
}

function clusterData(data: AmountsPairedToCentroid, k: number): Cluster {
  const cluster: Cluster = [];

  for (let i = 0; i < k; i++) {
    cluster[i] = [];

    const item = data
      .filter(itm => itm.centroidIndex === i)
      .map(itm => {
        return itm.wageItem;
      });

    cluster[i].push(...item);
  }

  return cluster;
}

function aggregateClusteredDataToNewCentroids(
  cluster: Cluster,
  oldCentroids: AmountsPairedToCentroid
): number[] {
  const newCentroidsAvgBaseAmounts: number[] = [];

  const keys = Object.keys(cluster);

  for (let i = 0; i < keys.length; i++) {
    const data = cluster[i];

    const sumOfBaseAmount = data.reduce(
      (sum, item) => sum + item.baseAmount,
      0
    );

    let averageAmount = 0;

    if (data.length === 0) {
      averageAmount = oldCentroids[i].wageItem.baseAmount;
    } else {
      averageAmount = sumOfBaseAmount / data.length;
    }

    newCentroidsAvgBaseAmounts[i] = averageAmount;
  }

  return newCentroidsAvgBaseAmounts;
}

function continueKmeans(
  oldCentroids: number[],
  newCentroids: number[]
): boolean {
  const tolerance = 0.1;

  for (let i = 0; i < newCentroids.length; i++) {
    if (Math.abs(newCentroids[i] - oldCentroids[i]) > tolerance) return true;
  }

  return false;
}

function findElbow(data: number[]): number {
  const first = data[0];
  const last = data[data.length - 1];

  let maxDistance = 0;
  let elbowIndex = 0;

  for (let i = 0; i < data.length; i++) {
    const expected = first + ((last - first) * i) / (data.length - 1);

    const distance = Math.abs(data[i] - expected);

    if (distance > maxDistance) {
      maxDistance = distance;
      elbowIndex = i;
    }
  }

  return elbowIndex + 2;
}

function findNearestCentrioid(
  centroids: number[],
  baseAmount: number
): { centroidIndex: number; distance: number } {
  let distance = Infinity;
  let centroidIndex = 0;

  for (let i = 0; i < centroids.length; i++) {
    if (Math.abs(centroids[i] - baseAmount) < distance) {
      distance = Math.abs(centroids[i] - baseAmount);
      centroidIndex = i;
    }
  }

  return { centroidIndex, distance };
}

function findOptimalK(data: WagesData): number {
  const wcssValues: number[] = [];

  const maxK = 10;

  // For while cycle
  let oldCentroids: number[] = [];
  let newCentroids: number[] = [];

  for (let k = 2; k < maxK; k++) {
    let continueAlg = true;

    let selectedCentroids = selectCentroids(k, data);

    oldCentroids = selectedCentroids;

    while (continueAlg) {
      const values: AmountsPairedToCentroid = [];

      data.forEach(itm => {
        const { centroidIndex, distance } = findNearestCentrioid(
          selectedCentroids,
          itm.baseAmount
        );

        values.push({
          wageItem: itm,
          centroidIndex: centroidIndex,
          distance: distance,
        });
      });

      const clusteredData = clusterData(values, k);

      const newCentroidsAvgAmount = aggregateClusteredDataToNewCentroids(
        clusteredData,
        values
      );

      newCentroids = newCentroidsAvgAmount;
      selectedCentroids = newCentroidsAvgAmount;

      continueAlg = continueKmeans(oldCentroids, newCentroids);

      oldCentroids = newCentroids;
    }

    let wcss = 0;
    data.forEach(itm => {
      const { distance } = findNearestCentrioid(
        selectedCentroids,
        itm.baseAmount
      );

      wcss += distance ** 2;
    });
    wcssValues.push(wcss);
  }

  return findElbow(wcssValues);
}

function selectCentroids(k: number, data: WagesData): number[] {
  const centroids: number[] = [];
  const selectedIndexes: number[] = [];

  if (k > data.length) {
    throw new Error("Počet centroidů nemůže být větší než počet dat.");
  }

  // Here will be a loop k times
  for (let i = 0; i < k; i++) {
    // Inside:
    // 1. random index
    let randomIndex = Math.floor(Math.random() * data.length);

    // 2. check for duplicates
    while (selectedIndexes.includes(randomIndex))
      randomIndex = Math.floor(Math.random() * data.length);

    // 3. adding an index
    selectedIndexes.push(randomIndex);

    // 4. adding data[index] to centroids
    centroids.push(data[randomIndex].baseAmount);
  }

  return centroids;
}

function aggregateClusterByMonth(cluster: WagesData): number[] {
  const monthlyValues = new Map<string, number[]>();

  cluster.forEach(item => {
    const key = `${item.transactionDate.getFullYear()} - ${item.transactionDate.getMonth()}`;

    if (!monthlyValues.has(key)) {
      monthlyValues.set(key, []);
    }

    monthlyValues.get(key)!.push(item.baseAmount);
  });

  return Array.from(monthlyValues.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, values]) => {
      return values.reduce((acc, val) => acc + val, 0);
    });
}

function randomWalkWithDrift(monthlyValues: number[]): number {
  if (monthlyValues.length === 0) return 0;

  if (monthlyValues.length === 1) return monthlyValues[0];

  let sumChanges = 0;

  for (let i = 1; i < monthlyValues.length; i++) {
    sumChanges += monthlyValues[i] - monthlyValues[i - 1];
  }

  const drift = sumChanges / (monthlyValues.length - 1);

  const lastValue = monthlyValues[monthlyValues.length - 1];

  return lastValue + drift;
}

function predictClustersWithDrift(
  clusteredData: Cluster
): PredictionWageResult[] {
  const values: PredictionWageResult[] = [];

  Object.values(clusteredData).forEach(cluster => {
    const monthlyValues = aggregateClusterByMonth(cluster);

    values.push({
      predictedValue: randomWalkWithDrift(monthlyValues),
      predictionValues: cluster,
    });
  });

  return values;
}

function filterDataByPercentil(data: WagesData): WagesData {
  const amounts = data.map(item => item.baseAmount);

  const sortedAmounts = [...amounts].sort((a, b) => a - b);

  const percentilIndex = (sortedAmounts.length - 1) * 0.05 + 1;

  const getNeighboursNumbers = (
    amounts: number[]
  ): { first: number; second: number } => {
    let neighboursNumbers = { first: 0, second: 0 };

    neighboursNumbers = {
      first: amounts[Math.floor(percentilIndex) - 1],
      second: amounts[Math.ceil(percentilIndex) - 1],
    };

    return neighboursNumbers;
  };
  const neighboursNumbers = getNeighboursNumbers(sortedAmounts);

  const percentil =
    percentilIndex - Math.floor(percentilIndex) === 0
      ? sortedAmounts[percentilIndex - 1]
      : neighboursNumbers.first +
        (percentilIndex - Math.floor(percentilIndex)) *
          (neighboursNumbers.second - neighboursNumbers.first);

  return data.filter(item => item.baseAmount > percentil);
}

// At the moment when there will be another feature, for example payment delay
// function standardizeData() {}

export default function wageCostsPrediction(): number {
  const data: WagesData = prepareWageCostData();

  const trainingData = filterDataByPercentil(data.slice(0, 48));
  const testData = data.slice(48, 60);

  // Centroids have only baseAmount

  // For while cycle
  let oldCentroids: number[] = [];
  let newCentroids: number[] = [];
  let clusteredData: Cluster = [];
  let continueAlg = true;

  const optimalK = findOptimalK(trainingData);

  let selectedCentroids = selectCentroids(optimalK, trainingData);

  oldCentroids = selectedCentroids;

  while (continueAlg) {
    const values: AmountsPairedToCentroid = [];

    trainingData.forEach(itm => {
      const { centroidIndex, distance } = findNearestCentrioid(
        selectedCentroids,
        itm.baseAmount
      );

      values.push({
        wageItem: itm,
        centroidIndex: centroidIndex,
        distance: distance,
      });
    });

    clusteredData = clusterData(values, optimalK);

    const newCentroidsAvgAmount = aggregateClusteredDataToNewCentroids(
      clusteredData,
      values
    );

    newCentroids = newCentroidsAvgAmount;
    selectedCentroids = newCentroidsAvgAmount;

    continueAlg = continueKmeans(oldCentroids, newCentroids);

    oldCentroids = newCentroids;
  }

  const predictedClusterAmounts = predictClustersWithDrift(clusteredData);
  const predictionValue = predictedClusterAmounts.reduce(
    (prev, curr) => prev + curr.predictedValue,
    0
  );

  console.log("test data: ", testData);
  console.log("prediction data " + predictedClusterAmounts);
  console.log("prediction wage " + predictionValue);

  return predictionValue;
}
