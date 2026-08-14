import {
  AmountsPairedToCentroid,
  WageData,
  WageDataItem,
} from "@/zod-schemas/wageData";
import { da } from "zod/locales";

function prepareWageCostData(): WageData {
  const wageData: WageData = [];

  const startYear = 2021;
  const endYear = 2025;

  const divisions = [1, 2, 3, 4];
  const currencies = ["CZK"];

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

          let salary = baseSalary * variation * salaryGrowth;

          /*
           * V prosinci a červnu občas přidáme bonus.
           */
          if ((month === 5 || month === 11) && Math.random() < 0.35)
            salary += random(5_000, 30_000);

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
            Currency: currencies[0],
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
          Currency: currencies[0],
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
          Currency: currencies[0],
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
          Currency: currencies[0],
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
            BaseAmount: round(random(5_000, 25_000)),
            Account: `331${String(division).padStart(3, "0")}`,
            Division: division,
            Currency: currencies[0],
          });
        }
      }
    }
  }

  return wageData;
}

function groupByCentroid(data: AmountsPairedToCentroid): WageData {}

function continueKmeans(
  oldCentroids: WageData,
  newCentroids: WageData
): boolean {
  return true;
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

  // wcssValues začíná u k = 2
  return elbowIndex + 2;
}

function findNearestCentrioid(
  centroids: WageData,
  baseAmount: number
): { centroid: WageDataItem; distance: number } {
  let distance = Infinity;
  let centroid: WageDataItem = {
    DimDateId: 0,
    TransactionDate: new Date(),
    BaseAmount: 0,
    Account: "",
    Division: 0,
    Currency: "",
  };

  for (let i = 0; i < centroids.length; i++) {
    if (Math.abs(centroids[i].BaseAmount - baseAmount) < distance) {
      distance = Math.abs(centroids[i].BaseAmount - baseAmount);
      centroid = centroids[i];
    }
  }

  return { centroid, distance };
}

function findOptimalK(data: WageData): number {
  const wcssValues: number[] = [];

  // const values: AmountsPairedToCentroid = [];

  const maxK = 10;

  for (let k = 2; k < maxK; k++) {
    let wcss = 0;
    const selectedCentroids = selectCentroids(k, data);

    for (let i = 0; i < data.length; i++) {
      const baseAmount = data[i].BaseAmount;

      const { centroid, distance } = findNearestCentrioid(
        selectedCentroids,
        baseAmount
      );

      // values.push({ wage: centroid, distance });

      wcss += distance ** 2;
    }

    wcssValues.push(wcss);
  }

  return findElbow(wcssValues);
}

function selectCentroids(k: number, data: WageData): WageData {
  const centroids: WageData = [];
  const selectedIndexes: number[] = [];

  if (k > data.length) {
    throw new Error("Počet centroidů nemůže být větší než počet dat.");
  }

  // tady bude cyklus k-krát
  for (let i = 0; i < k; i++) {
    // uvnitř:
    // 1. náhodný index
    let randomIndex = Math.floor(Math.random() * data.length);
    // 2. kontrola duplicity
    while (selectedIndexes.includes(randomIndex))
      randomIndex = Math.floor(Math.random() * data.length);
    // 3. přidání indexu
    selectedIndexes.push(randomIndex);
    // 4. přidání data[index] do centroids
    centroids.push(data[randomIndex]);
  }

  return centroids;
}

export default function wageCostsPrediction(): number {
  const values: AmountsPairedToCentroid = [];
  const data: WageData = prepareWageCostData();

  // const continueAlgorithm = continueKmeans();

  // while (continueAlgorithm) {
  const optimalK = findOptimalK(data);

  const selectedCentroids = selectCentroids(optimalK, data);

  data.forEach(itm => {
    const { centroid, distance } = findNearestCentrioid(
      selectedCentroids,
      itm.BaseAmount
    );

    values.push({
      wageItem: itm,
      centroid: centroid,
      distance,
    });
  });

  const groupedByCentroid = groupByCentroid(values);

  // }

  console.log("wageData ", data.slice(0, 10));
  return 0;
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
 Další nevýhodou je u metody k-meansto, že je velmi citlivá na odlehlápozorování.
 Tuto nevýhodu se budeme snažit minimalizovat tím, že z odhadu vynecháme velmi nízké
 mzdové výdaje, které budou vůči zbylým výdajům zanedbatelné.
*/

// jako hraniční hodnota je vedená 100 000 Kč, mi si ji určíme dle naší simulace/analýzy

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
 jejichž frekvence je menší než jeden měsíc.
*/

/*
 Medián tedy v tomto případě
 není příliš vhodným nástrojem.Zkusíme použít nástroj, který bere data více jako časovou
 řadu a dává větší váhu na poslední pozorování.Zkusíme již popsanou náhodnou procházku
 sdriftem.
*/
