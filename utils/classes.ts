import {
  AicsData,
  AlgorithmSESParams,
  AlgorithmsParams,
  DphData,
  InvoicesData,
  IterationsKmeansData,
  LoansData,
  MonthData,
  PredictionClusterResults,
  PredictionsData,
  PredictionSESdata,
  TestData,
  WagesData,
} from "@/zod-schemas";

export class UsedDataLoans {
  private data: LoansData = [];
  private aggregatedTrainingData: number[] = [];
  private aggregatedTestData: number[] = [];
  private aics: AicsData = [];
  private algorithmsParams: AlgorithmsParams = [];
  private predictionsData: PredictionsData = [];

  constructor(
    data: LoansData,
    aggregatedTrainingData: number[],
    aggregatedTestData: number[],
    aics: AicsData,
    algorithmsParams: AlgorithmsParams,
    predictionsData: PredictionsData
  ) {
    this.data = data;
    this.aggregatedTrainingData = aggregatedTrainingData;
    this.aggregatedTestData = aggregatedTestData;
    this.aics = aics;
    this.algorithmsParams = algorithmsParams;
    this.predictionsData = predictionsData;
  }

  public getData(): LoansData {
    return this.data;
  }

  public getAaggregatedTrainingData(): number[] {
    return this.aggregatedTrainingData;
  }

  public getAggregatedTestData(): number[] {
    return this.aggregatedTestData;
  }

  public getAics(): AicsData {
    return this.aics;
  }

  public getAlgorithmsParams(): AlgorithmsParams {
    return this.algorithmsParams;
  }

  public getPredictionsData(): PredictionsData {
    return this.predictionsData;
  }
}

export class UsedDataInvoices {
  private data: InvoicesData = [];
  private excludetData: InvoicesData = [];
  private aggregatedTrainingData: number[] = [];
  private aggregatedTestData: number[] = [];
  private algorithmParams: AlgorithmSESParams = { alpha: 0, aic: 0 };
  private predictionData: PredictionSESdata = {
    params: {
      smoothedValues: [],
      rezidua: [],
    },
    values: [{ date: new Date().toString(), value: 0 }],
  };

  constructor(
    data: InvoicesData,
    excludedData: InvoicesData,
    aggregatedTrainingData: number[],
    aggregatedTestData: number[],
    algorithmParams: AlgorithmSESParams,
    predictionData: PredictionSESdata
  ) {
    this.data = data;
    this.excludetData = excludedData;
    this.aggregatedTrainingData = aggregatedTrainingData;
    this.aggregatedTestData = aggregatedTestData;
    this.algorithmParams = algorithmParams;
    this.predictionData = predictionData;
  }

  public getData(): InvoicesData {
    return this.data;
  }

  public getEexcludetData(): InvoicesData {
    return this.excludetData;
  }

  public getAaggregatedTrainingData(): number[] {
    return this.aggregatedTrainingData;
  }

  public getAggregatedTestData(): number[] {
    return this.aggregatedTestData;
  }

  public getAlgorithmParams(): AlgorithmSESParams {
    return this.algorithmParams;
  }

  public getPredictionData(): PredictionSESdata {
    return this.predictionData;
  }
}

export class UsedDataWages {
  private data: WagesData = [];
  private aggregatedTrainingData: number[] = [];
  private aggregatedTestData: number[] = [];
  private optimalK: number = 0;
  private iterationsKmeansData: IterationsKmeansData = [];
  private predictedClusterAmounts: PredictionClusterResults = [];

  constructor(
    data: WagesData,
    aggregatedTrainingData: number[],
    aggregatedTestData: number[],
    optimalK: number,
    iterationsKmeansData: IterationsKmeansData,
    predictedClusterAmounts: PredictionClusterResults
  ) {
    this.data = data;
    this.aggregatedTrainingData = aggregatedTrainingData;
    this.aggregatedTestData = aggregatedTestData;
    this.optimalK = optimalK;
    this.iterationsKmeansData = iterationsKmeansData;
    this.predictedClusterAmounts = predictedClusterAmounts;
  }

  public getData(): WagesData {
    return this.data;
  }

  public getAaggregatedTrainingData(): number[] {
    return this.aggregatedTrainingData;
  }

  public getAggregatedTestData(): number[] {
    return this.aggregatedTestData;
  }

  public getOptimalK(): number {
    return this.optimalK;
  }

  public getIterationsKmeansData(): IterationsKmeansData {
    return this.iterationsKmeansData;
  }

  public getPredictedClusterAmounts(): PredictionClusterResults {
    return this.predictedClusterAmounts;
  }
}

export class UsedDPHdata {
  private data: DphData = {};
  private trainingData: DphData = {};
  private testData: TestData = {
    key: "",
    data: {},
  };
  private aggMonthNumbersInPercent: MonthData = [];
  private activeMonth: MonthData = [];
  private predictedDph: number = 0;

  constructor(
    data: DphData,
    trainingData: DphData,
    testData: TestData,
    aggMonthNumbersInPercent: MonthData,
    activeMonth: MonthData,
    predictedDph: number
  ) {
    this.data = data;
    this.trainingData = trainingData;
    this.testData = testData;
    this.aggMonthNumbersInPercent = aggMonthNumbersInPercent;
    this.activeMonth = activeMonth;
    this.predictedDph = predictedDph;
  }

  public getData(): DphData {
    return this.data;
  }

  public getTrainingData(): DphData {
    return this.trainingData;
  }

  public getTestData(): TestData {
    return this.testData;
  }

  public getAggMonthNumbersInPercent(): MonthData {
    return this.aggMonthNumbersInPercent;
  }

  public getActiveMonth(): MonthData {
    return this.activeMonth;
  }

  public getPredictedDph(): number {
    return this.predictedDph;
  }
}
