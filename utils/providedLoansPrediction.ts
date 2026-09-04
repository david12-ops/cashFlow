import { LoansData } from "../zod-schemas/loanDataTypes";

function prepareLoanData(): LoansData {
  const loanData: LoansData = [];

  const startYear = 2021;
  const endYear = 2025;

  const loans = [
    { CreditNumber: 1200451, Amount: 3000, StartMonth: 1 },
    { CreditNumber: 1200452, Amount: 5500, StartMonth: 3 },
    { CreditNumber: 1200453, Amount: 4200, StartMonth: 6 },
    { CreditNumber: 1200454, Amount: 7500, StartMonth: 9 },
    { CreditNumber: 1200455, Amount: 12000, StartMonth: 2 },
  ];

  for (const loan of loans) {
    const startDate = new Date(startYear, loan.StartMonth - 1, 15);

    for (let year = startYear; year <= endYear; year++) {
      for (let month = 0; month < 12; month++) {
        const dueDate = new Date(year, month, 15);
        let paymentNumber = 1;

        if (dueDate < startDate) {
          continue;
        }

        const paymentType = Math.random();

        let amountPaid: number;
        let delay: number | null;

        if (paymentType < 0.7) {
          // 70 % zaplaceno vcas
          amountPaid = loan.Amount;
          delay = 0;
        } else if (paymentType < 0.9) {
          // 20 % zaplaceno se zpozdenim
          amountPaid = loan.Amount;
          delay = Math.floor(Math.random() * 30) + 1;
        } else if (paymentType < 0.95) {
          // 5 % zaplaceno častečně
          amountPaid = Math.floor(loan.Amount * (0.3 + Math.random() * 0.5));
          delay = Math.floor(Math.random() * 30) + 1;
        } else {
          // 5 % zatim nezaplaceno
          amountPaid = 0;
          delay = null;
        }

        loanData.push({
          CreditNumber: loan.CreditNumber,
          PaymentNumber: paymentNumber,
          DueDate: dueDate,
          Delay: delay,
          Amount: loan.Amount,
          AmountPaid: amountPaid,
        });

        paymentNumber++;
      }
    }
  }
  return loanData;
}

function providedLoansPrediction() {
  const data: LoansData = prepareLoanData();

  console.log("loan data " + data);
}
