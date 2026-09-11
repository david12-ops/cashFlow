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

        //seson koeficient
        const seasonality = Math.sin((2 * Math.PI * month) / 12);

        // 1 000–500 000
        const amountCze =
          Math.floor(Math.random() * (500000 - 1000 + 1)) + 1000;

        const amountCzeWithSeasonality = amountCze * (1 + 0.3 * seasonality);

        if (paymentType < 0.7) {
          // 70 % zaplaceno vcas
          amountPaid = amountCzeWithSeasonality;
          delay = 0;
        } else if (paymentType < 0.9) {
          // 20 % zaplaceno se zpozdenim
          amountPaid = amountCzeWithSeasonality;
          delay = Math.floor(Math.random() * 60) + 1;
        } else if (paymentType < 0.95) {
          // 5 % zaplaceno častečně
          amountPaid = Math.floor(
            amountCzeWithSeasonality * (0.3 + Math.random() * 0.5)
          );
          delay = Math.floor(Math.random() * 60) + 1;
        } else {
          // 5 % zatim nezaplaceno
          amountPaid = 0;
          delay = null;
        }

        invoiceData.push({
          DueDate: dueDate,
          AmountCze: amountCzeWithSeasonality,
          AmountPaidCze: amountPaid,
          PaymentDelay: delay,
        });
      }
    }
  }

  return invoiceData;
}

export default function issuedInvoicesPrediction() {
  const data: InvoicesData = prepareInvoiceData();

  console.log("Data for prediction of invoices: ", data);
}
