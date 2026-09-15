import {
  AmountsPairedToCentroid,
  Cluster,
  Currency,
  CurrencyConvertMap,
  PredictionWageResult,
  WagesData,
  EchangeRates,
} from "@/zod-schemas/wageDataTypes";

function createCurrencyRatesMap(year: number): CurrencyConvertMap {
  const exchangeRates: EchangeRates = {
    2021: {
      CZK: [
        { Currency: "CZK", Value: 1 },
        { Currency: "EUR", Value: 0.03899 },
        { Currency: "USD", Value: 0.04613 },
        { Currency: "GBP", Value: 0.03352 },
        { Currency: "PLN", Value: 0.1778 },
      ],
      EUR: [
        { Currency: "CZK", Value: 25.65 },
        { Currency: "EUR", Value: 1 },
        { Currency: "USD", Value: 1.183 },
        { Currency: "GBP", Value: 0.86 },
        { Currency: "PLN", Value: 4.56 },
      ],
      USD: [
        { Currency: "CZK", Value: 21.68 },
        { Currency: "EUR", Value: 0.845 },
        { Currency: "USD", Value: 1 },
        { Currency: "GBP", Value: 0.727 },
        { Currency: "PLN", Value: 3.93 },
      ],
      GBP: [
        { Currency: "CZK", Value: 29.83 },
        { Currency: "EUR", Value: 1.163 },
        { Currency: "USD", Value: 1.376 },
        { Currency: "GBP", Value: 1 },
        { Currency: "PLN", Value: 5.32 },
      ],
      PLN: [
        { Currency: "CZK", Value: 5.625 },
        { Currency: "EUR", Value: 0.219 },
        { Currency: "USD", Value: 0.254 },
        { Currency: "GBP", Value: 0.188 },
        { Currency: "PLN", Value: 1 },
      ],
    },

    2022: {
      CZK: [
        { Currency: "CZK", Value: 1 },
        { Currency: "EUR", Value: 0.04072 },
        { Currency: "USD", Value: 0.04281 },
        { Currency: "GBP", Value: 0.03502 },
        { Currency: "PLN", Value: 0.1827 },
      ],
      EUR: [
        { Currency: "CZK", Value: 24.56 },
        { Currency: "EUR", Value: 1 },
        { Currency: "USD", Value: 1.051 },
        { Currency: "GBP", Value: 0.86 },
        { Currency: "PLN", Value: 4.49 },
      ],
      USD: [
        { Currency: "CZK", Value: 23.36 },
        { Currency: "EUR", Value: 0.951 },
        { Currency: "USD", Value: 1 },
        { Currency: "GBP", Value: 0.818 },
        { Currency: "PLN", Value: 4.27 },
      ],
      GBP: [
        { Currency: "CZK", Value: 28.56 },
        { Currency: "EUR", Value: 1.163 },
        { Currency: "USD", Value: 1.223 },
        { Currency: "GBP", Value: 1 },
        { Currency: "PLN", Value: 5.18 },
      ],
      PLN: [
        { Currency: "CZK", Value: 5.474 },
        { Currency: "EUR", Value: 0.223 },
        { Currency: "USD", Value: 0.234 },
        { Currency: "GBP", Value: 0.193 },
        { Currency: "PLN", Value: 1 },
      ],
    },

    2023: {
      CZK: [
        { Currency: "CZK", Value: 1 },
        { Currency: "EUR", Value: 0.04166 },
        { Currency: "USD", Value: 0.04505 },
        { Currency: "GBP", Value: 0.03592 },
        { Currency: "PLN", Value: 0.1864 },
      ],
      EUR: [
        { Currency: "CZK", Value: 24.0 },
        { Currency: "EUR", Value: 1 },
        { Currency: "USD", Value: 1.081 },
        { Currency: "GBP", Value: 0.862 },
        { Currency: "PLN", Value: 4.47 },
      ],
      USD: [
        { Currency: "CZK", Value: 22.2 },
        { Currency: "EUR", Value: 0.925 },
        { Currency: "USD", Value: 1 },
        { Currency: "GBP", Value: 0.798 },
        { Currency: "PLN", Value: 4.13 },
      ],
      GBP: [
        { Currency: "CZK", Value: 27.84 },
        { Currency: "EUR", Value: 1.16 },
        { Currency: "USD", Value: 1.253 },
        { Currency: "GBP", Value: 1 },
        { Currency: "PLN", Value: 5.16 },
      ],
      PLN: [
        { Currency: "CZK", Value: 5.365 },
        { Currency: "EUR", Value: 0.224 },
        { Currency: "USD", Value: 0.242 },
        { Currency: "GBP", Value: 0.194 },
        { Currency: "PLN", Value: 1 },
      ],
    },

    2024: {
      CZK: [
        { Currency: "CZK", Value: 1 },
        { Currency: "EUR", Value: 0.03981 },
        { Currency: "USD", Value: 0.04307 },
        { Currency: "GBP", Value: 0.03388 },
        { Currency: "PLN", Value: 0.1715 },
      ],
      EUR: [
        { Currency: "CZK", Value: 25.12 },
        { Currency: "EUR", Value: 1 },
        { Currency: "USD", Value: 1.082 },
        { Currency: "GBP", Value: 0.851 },
        { Currency: "PLN", Value: 4.31 },
      ],
      USD: [
        { Currency: "CZK", Value: 23.22 },
        { Currency: "EUR", Value: 0.924 },
        { Currency: "USD", Value: 1 },
        { Currency: "GBP", Value: 0.786 },
        { Currency: "PLN", Value: 3.98 },
      ],
      GBP: [
        { Currency: "CZK", Value: 29.52 },
        { Currency: "EUR", Value: 1.175 },
        { Currency: "USD", Value: 1.272 },
        { Currency: "GBP", Value: 1 },
        { Currency: "PLN", Value: 5.03 },
      ],
      PLN: [
        { Currency: "CZK", Value: 5.831 },
        { Currency: "EUR", Value: 0.232 },
        { Currency: "USD", Value: 0.251 },
        { Currency: "GBP", Value: 0.199 },
        { Currency: "PLN", Value: 1 },
      ],
    },

    2025: {
      CZK: [
        { Currency: "CZK", Value: 1 },
        { Currency: "EUR", Value: 0.0405 },
        { Currency: "USD", Value: 0.04194 },
        { Currency: "GBP", Value: 0.035 },
        { Currency: "PLN", Value: 0.1733 },
      ],
      EUR: [
        { Currency: "CZK", Value: 24.69 },
        { Currency: "EUR", Value: 1 },
        { Currency: "USD", Value: 1.035 },
        { Currency: "GBP", Value: 0.864 },
        { Currency: "PLN", Value: 4.28 },
      ],
      USD: [
        { Currency: "CZK", Value: 23.84 },
        { Currency: "EUR", Value: 0.966 },
        { Currency: "USD", Value: 1 },
        { Currency: "GBP", Value: 0.832 },
        { Currency: "PLN", Value: 4.11 },
      ],
      GBP: [
        { Currency: "CZK", Value: 28.57 },
        { Currency: "EUR", Value: 1.157 },
        { Currency: "USD", Value: 1.202 },
        { Currency: "GBP", Value: 1 },
        { Currency: "PLN", Value: 4.95 },
      ],
      PLN: [
        { Currency: "CZK", Value: 5.77 },
        { Currency: "EUR", Value: 0.234 },
        { Currency: "USD", Value: 0.243 },
        { Currency: "GBP", Value: 0.202 },
        { Currency: "PLN", Value: 1 },
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
    cur => cur.Currency === toCurrency
  );

  if (exchangeItem) {
    return value * exchangeItem.Value;
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
      item.TransactionDate.getFullYear()
    );

    return {
      ...item,
      BaseAmount: convertValueByCurrency(
        item.Currency,
        currency,
        item.BaseAmount,
        ratesMap
      ),
      Currency: currency,
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
   * Přibližný počet zaměstnanců v jednotlivých divizích.
   * Díky tomu nebude každý měsíc generován úplně stejný počet
   * záznamů.
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
       * Mírný růst mezd v čase.
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
       * 15. den → mzdy
       */
      const salaryDay = new Date(year, month, 15);

      /*
       * 20. den → odvody
       */
      const deductionDay = new Date(year, month, 20);

      /*
       * -------------------------
       * MZDY – účet 331xxx
       * -------------------------
       */
      for (const division of divisions) {
        const employeeCount =
          employeesPerDivision[division as keyof typeof employeesPerDivision];

        for (let employee = 0; employee < employeeCount; employee++) {
          /*
           * Základní mzda zaměstnance.
           */
          const baseSalary = random(35_000, 70_000);

          /*
           * Náhodná odchylka ±10 %.
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
           * V prosinci a červnu občas přidáme bonus.
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
           * Analytický účet 331xxx.
           *
           * Poslední čísla simulují různé analytické účty.
           */
          const account = `331${String(division).padStart(3, "0")}`;

          wageData.push({
            DimDateId: createDimDateId(salaryDay),
            TransactionDate: new Date(salaryDay),
            BaseAmount: salary,
            Account: account,
            Division: division,
            Currency: currencies[pickedCurrencyIndex],
          });
        }

        /*
         * -------------------------
         * SOCIÁLNÍ – 336xxx
         * -------------------------
         */
        const totalSalary = wageData
          .filter(
            item =>
              item.TransactionDate.getFullYear() === year &&
              item.TransactionDate.getMonth() === month &&
              item.Division === division &&
              item.Account.startsWith("331")
          )
          .reduce((sum, item) => sum + item.BaseAmount, 0);

        const social = round(totalSalary * random(0.23, 0.25));

        wageData.push({
          DimDateId: createDimDateId(deductionDay),
          TransactionDate: new Date(deductionDay),
          BaseAmount: social,
          Account: `336${String(division).padStart(3, "0")}`,
          Division: division,
          Currency: currencies[pickedCurrencyIndex],
        });

        /*
         * -------------------------
         * ZDRAVOTNÍ – 336xxx
         * -------------------------
         */
        const health = round(totalSalary * random(0.09, 0.1));

        wageData.push({
          DimDateId: createDimDateId(deductionDay),
          TransactionDate: new Date(deductionDay),
          BaseAmount: health,
          Account: `336${String(division + 100).padStart(3, "0")}`,
          Division: division,
          Currency: currencies[pickedCurrencyIndex],
        });

        /*
         * -------------------------
         * DAŇ – 342xxx
         * -------------------------
         */
        const tax = round(totalSalary * random(0.1, 0.15));

        wageData.push({
          DimDateId: createDimDateId(deductionDay),
          TransactionDate: new Date(deductionDay),
          BaseAmount: tax,
          Account: `342${String(division).padStart(3, "0")}`,
          Division: division,
          Currency: currencies[pickedCurrencyIndex],
        });
      }

      /*
       * -------------------------
       * OBČASNÉ MIMOŘÁDNÉ ODMĚNY
       * -------------------------
       *
       * Přidáme několik dalších záznamů,
       * aby dataset nebyl příliš pravidelný.
       */

      if (Math.random() < 0.25) {
        const bonusCount = Math.floor(random(3, 10));

        for (let i = 0; i < bonusCount; i++) {
          const division =
            divisions[Math.floor(Math.random() * divisions.length)];

          const bonusDay = new Date(year, month, 25);

          wageData.push({
            DimDateId: createDimDateId(bonusDay),
            TransactionDate: bonusDay,
            BaseAmount: convertValueByCurrency(
              "CZK",
              currencies[pickedCurrencyIndex],
              round(random(5_000, 25_000)),
              ratesMap
            ),
            Account: `331${String(division).padStart(3, "0")}`,
            Division: division,
            Currency: currencies[pickedCurrencyIndex],
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
      .filter(itm => itm.CentroidIndex === i)
      .map(itm => {
        return itm.WageItem;
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
      (sum, item) => sum + item.BaseAmount,
      0
    );

    let averageAmount = 0;

    if (data.length === 0) {
      averageAmount = oldCentroids[i].WageItem.BaseAmount;
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
          itm.BaseAmount
        );

        values.push({
          WageItem: itm,
          CentroidIndex: centroidIndex,
          Distance: distance,
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
        itm.BaseAmount
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
    centroids.push(data[randomIndex].BaseAmount);
  }

  return centroids;
}

function aggregateClusterByMonth(cluster: WagesData): number[] {
  const monthlyValues = new Map<string, number[]>();

  cluster.forEach(item => {
    const key = `${item.TransactionDate.getFullYear()} - ${item.TransactionDate.getMonth()}`;

    if (!monthlyValues.has(key)) {
      monthlyValues.set(key, []);
    }

    monthlyValues.get(key)!.push(item.BaseAmount);
  });

  return Array.from(monthlyValues.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, values]) => {
      const sum = values.reduce((acc, val) => acc + val, 0);

      return sum / values.length;
    });
}

function randomWalkWithDrift(monthlyValues: number[]): number {
  if (monthlyValues.length === 0) return 0;

  if (monthlyValues.length === 1) return monthlyValues[0];

  let sumChanges = 0;

  for (let i = 1; i < monthlyValues.length; i++) {
    sumChanges = monthlyValues[i] - monthlyValues[i - 1];
  }

  const drift = sumChanges / (monthlyValues.length - 1);

  const lastValue = monthlyValues[monthlyValues.length - 1];

  return lastValue + drift;
}

function predictClustersWithDrift(clusteredData: Cluster): number[] {
  return Object.values(clusteredData).map(cluster => {
    const monthlyValues = aggregateClusterByMonth(cluster);

    return randomWalkWithDrift(monthlyValues);
  });
}

export default function wageCostsPrediction(): PredictionWageResult {
  const data: WagesData = prepareWageCostData();

  const trainingData = data.slice(0, 48);
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
        itm.BaseAmount
      );

      values.push({
        WageItem: itm,
        CentroidIndex: centroidIndex,
        Distance: distance,
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

  const predictedCentroids = predictClustersWithDrift(clusteredData);

  console.log("test data: ", testData);

  return { Centroids: predictedCentroids, Cluster: clusteredData };
}

/*
 je tu ještě možnost
 toho, že bychom vzali jednotlivé části mezd (zálohy, povinné odvody, mzdy, daň) a zkusili
 pro každou část mzdových výdajů vytvořit samostatný odhad.
*/

/*
 Pro nás ovšem bude důležitější nehierarchická shluková analýza, která hledá různé
 neprázdné podmnožiny s prázdným průnikem.
*/

/*
 Rozhodli jsme se použít metodu k-means, která se snaží minimalizovat celkové sumy
 čtverců vzdáleností uvnitř skupin. Vzdálenost je u této metody Euklidovská. 
*/

/*
 Další nevýhodou je u metody k-meansto, že je velmi citlivá na odlehlá pozorování.
 Tuto nevýhodu se budeme snažit minimalizovat tím, že z odhadu vynecháme velmi nízké
 mzdové výdaje, které budou vůči zbylým výdajům zanedbatelné. - neaplikovano
*/

// jako hraniční hodnota je vedená 100 000 Kč, mi si ji určíme dle naší simulace/analýzy - neaplikovano

/*
 Následně potřebujeme každému shluku přiřadit částku. Abychom se vyvarovali vý
 chylkám v datech, tak si pro každý shluk určíme mediánovou částku ze všech historických
 hodnot daného shluku
*/

/*
 Protože mzdy se měsíc od měsíce příliš neliší,
 použijeme pro současný měsíc celkovou částku z minulého měsíce, tedy z prosince. Ta
 činila-10 934 316 Kč.
*/

/*
 Problémem této metody je to, že neumíme rozlišit, která platba půjde na kterou měnu,
 všechny platby by tedy byly v českých korunách. Dále tu také nejsou zohledněny platby,
 jejichž frekvence je menší než jeden měsíc. - při update, nechali jsme v jedne castce (neaplikovano)
*/

/*
 Medián tedy v tomto případě
 není příliš vhodným nástrojem.Zkusíme použít nástroj, který bere data více jako časovou
 řadu a dává větší váhu na poslední pozorování.Zkusíme již popsanou náhodnou procházku
 sdriftem. 
*/
