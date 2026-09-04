import { InvoicesData } from "@/zod-schemas/invoicesDataTypes";

function prepareInvoiceData(): InvoicesData {
  const invoiceData: InvoicesData = [];

  const startYear = 2021;
  const endYear = 2025;

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 0; month < 12; month++) {
      const invoiceCount = Math.floor(Math.random() * 31) + 20;

      for (let i = 0; i < invoiceCount; i++) {
        const paymentType = Math.random();

        let amountPaid: number;
        let delay: number | null;

        const dueDate = new Date(
          year,
          month,
          Math.floor(Math.random() * 28) + 1
        );

        // 1 000–500 000
        const amountCze =
          Math.floor(Math.random() * (500000 - 1000 + 1)) + 1000;

        if (paymentType < 0.7) {
          // 70 % zaplaceno vcas
          amountPaid = amountCze;
          delay = 0;
        } else if (paymentType < 0.9) {
          // 20 % zaplaceno se zpozdenim
          amountPaid = amountCze;
          delay = Math.floor(Math.random() * 60) + 1;
        } else if (paymentType < 0.95) {
          // 5 % zaplaceno častečně
          amountPaid = Math.floor(amountCze * (0.3 + Math.random() * 0.5));
          delay = Math.floor(Math.random() * 60) + 1;
        } else {
          // 5 % zatim nezaplaceno
          amountPaid = 0;
          delay = null;
        }

        invoiceData.push({
          DueDate: dueDate,
          AmountCze: amountCze,
          AmountPaidCze: amountPaid,
          PaymentDelay: delay,
        });
      }
    }
  }

  return invoiceData;
}

function exponentialSmoothing(aggregatedData: number[], alpha: number) {
  const smooothValues: number[] = [];
  let currentVal;

  for (let i = 0; i < aggregatedData.length; i++) {
    if (i === 0) {
      currentVal = aggregatedData[0];
      smooothValues[i] = currentVal;
    } else {
      currentVal = aggregatedData[i];
      const previousSmoothVal = smooothValues[i - 1];

      const newSmoothValue =
        alpha * currentVal + (1 - alpha) * previousSmoothVal;
      smooothValues[i] = newSmoothValue;
    }
  }

  return smooothValues;
}

function aggregateInvoicesByMonth(data: InvoicesData): number[] {
  const monthlyValues = new Map<string, number[]>();

  data.forEach(item => {
    if (item.PaymentDelay == null) {
      return;
    }
    // datum skutečné platby
    // DueDate + PaymentDelay
    const date = new Date(item.DueDate);

    if (item.PaymentDelay != null)
      date.setDate(date.getDate() + item.PaymentDelay);

    const key = `${date.getFullYear()} - ${date.getMonth()}`;

    if (!monthlyValues.has(key)) {
      monthlyValues.set(key, []);
    }

    monthlyValues.get(key)!.push(item.AmountPaidCze);
  });

  return Array.from(monthlyValues.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, values]) => {
      return values.reduce((acc, val) => acc + val, 0);
    });
}

// SES
function pickBestAlpha(aggregatedData: number[]): number {
  let bestAlpha = 0;
  let bestErrorValue = Number.MAX_VALUE;

  for (let i = 0.1; i < 1; i += 0.1) {
    let totalError = 0;
    const smoothValues = exponentialSmoothing(aggregatedData, i);

    for (let x = 0; x < aggregatedData.length; x++) {
      const errorValue = Math.abs(aggregatedData[x] - smoothValues[x]);
      totalError += errorValue;
    }

    const avaregeError = totalError / aggregatedData.length;

    if (avaregeError < bestErrorValue) {
      bestAlpha = i;
      bestErrorValue = avaregeError;
    }
  }

  return bestAlpha;
}

//Holtovo exponenciální vyhlazování

//Holt-Winters - falesna data mohou delat brikule

function issuedInvoicesPrediction() {
  const data: InvoicesData = prepareInvoiceData();

  const aggregatedData = aggregateInvoicesByMonth(data);
  const bestAlpha = pickBestAlpha(aggregatedData);

  const smoothedData = exponentialSmoothing(aggregatedData, bestAlpha);

  console.log("invoice data " + data);
  console.log("smoothed data " + smoothedData);
  console.log("prediction " + smoothedData[smoothedData.length - 1]);
}
