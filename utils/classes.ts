import {
  AicsData,
  AlgorithmSESData,
  AlgorithmsParams,
  VatData,
  InvoicesData,
  IterationsKmeansData,
  LoansData,
  MonthData,
  PredictionClusterResults,
  PredictionsData,
  TestData,
  WagesData,
} from "@/zod-schemas";

export class UsedDataLoans {
  private data: LoansData = [];
  private trainingData: LoansData = [];
  private testData: LoansData = [];
  private aics: AicsData = [];
  private algorithmsParams: AlgorithmsParams = [];
  private otherPredictionsData: PredictionsData = {
    sesModel: null,
    holtModel: null,
    holtWinterModel: null,
  };

  constructor(
    data: LoansData,
    trainingData: LoansData,
    testData: LoansData,
    aics: AicsData,
    algorithmsParams: AlgorithmsParams
  ) {
    this.data = data;
    this.trainingData = trainingData;
    this.testData = testData;
    this.aics = aics;
    this.algorithmsParams = algorithmsParams;
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

  public getOtherPredictionsData(): PredictionsData {
    return this.otherPredictionsData;
  }

  public setOtherPredictionsData(predictionsData: PredictionsData) {
    this.otherPredictionsData = predictionsData;
  }
}

export class UsedDataInvoices {
  private data: InvoicesData = [];
  private excludetData: InvoicesData = [];
  private trainingData: InvoicesData = [];
  private testData: InvoicesData = [];
  private algorithmParams: AlgorithmSESData = { alpha: 0, aic: 0 };

  constructor(
    data: InvoicesData,
    excludedData: InvoicesData,
    trainingData: InvoicesData,
    testData: InvoicesData,
    algorithmParams: AlgorithmSESData
  ) {
    this.data = data;
    this.excludetData = excludedData;
    this.trainingData = trainingData;
    this.testData = testData;
    this.algorithmParams = algorithmParams;
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

  public getAlgorithmParams(): AlgorithmSESData {
    return this.algorithmParams;
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

export class UsedVatData {
  private data: VatData = {};
  private trainingData: VatData = {};
  private testData: TestData = {
    key: "",
    data: {},
  };
  private aggMonthNumbersInPercent: MonthData = [];
  private activeMonth: MonthData = [];
  private predictedVat: number = 0;

  constructor(
    data: VatData,
    trainingData: VatData,
    testData: TestData,
    aggMonthNumbersInPercent: MonthData,
    activeMonth: MonthData,
    predictedVat: number
  ) {
    this.data = data;
    this.trainingData = trainingData;
    this.testData = testData;
    this.aggMonthNumbersInPercent = aggMonthNumbersInPercent;
    this.activeMonth = activeMonth;
    this.predictedVat = predictedVat;
  }

  public getData(): VatData {
    return this.data;
  }

  public getTrainingData(): VatData {
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

  public getPredictedVat(): number {
    return this.predictedVat;
  }
}
