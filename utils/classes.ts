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
  private trainingData: LoansData = [];
  private testData: LoansData = [];
  private aics: AicsData = [];
  private algorithmsParams: AlgorithmsParams = [];
  private predictionsData: PredictionsData = [];

  constructor(
    data: LoansData,
    trainingData: LoansData,
    testData: LoansData,
    aics: AicsData,
    algorithmsParams: AlgorithmsParams,
    predictionsData: PredictionsData
  ) {
    this.data = data;
    this.trainingData = trainingData;
    this.testData = testData;
    this.aics = aics;
    this.algorithmsParams = algorithmsParams;
    this.predictionsData = predictionsData;
  }

  public getData(): LoansData {
    return this.data;
  }

  public getTrainingData(): LoansData {
    return this.trainingData;
  }

  public getTestData(): LoansData {
    return this.testData;
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
  private trainingData: InvoicesData = [];
  private testData: InvoicesData = [];
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
    trainingData: InvoicesData,
    testData: InvoicesData,
    algorithmParams: AlgorithmSESParams,
    predictionData: PredictionSESdata
  ) {
    this.data = data;
    this.excludetData = excludedData;
    this.trainingData = trainingData;
    this.testData = testData;
    this.algorithmParams = algorithmParams;
    this.predictionData = predictionData;
  }

  public getData(): InvoicesData {
    return this.data;
  }

  public getEexcludetData(): InvoicesData {
    return this.excludetData;
  }

  public getTrainingData(): InvoicesData {
    return this.trainingData;
  }

  public getTestData(): InvoicesData {
    return this.testData;
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
  private trainingData: WagesData = [];
  private testData: WagesData = [];
  private optimalK: number = 0;
  private iterationsKmeansData: IterationsKmeansData = [];
  private predictedClusterAmounts: PredictionClusterResults = [];

  constructor(
    data: WagesData,
    trainingData: WagesData,
    testData: WagesData,
    optimalK: number,
    iterationsKmeansData: IterationsKmeansData,
    predictedClusterAmounts: PredictionClusterResults
  ) {
    this.data = data;
    this.trainingData = trainingData;
    this.testData = testData;
    this.optimalK = optimalK;
    this.iterationsKmeansData = iterationsKmeansData;
    this.predictedClusterAmounts = predictedClusterAmounts;
  }

  public getData(): WagesData {
    return this.data;
  }

  public getTrainingData(): WagesData {
    return this.trainingData;
  }

  public getTestData(): WagesData {
    return this.testData;
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
