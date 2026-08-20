import { LoansData } from "../zod-schemas/loanDataTypes";

function prepareLoanData(): LoansData {
  const loanData: LoansData = [];

  return loanData;
}

function providedLoansPrediction() {
  const data: LoansData = prepareLoanData();

  console.log("loan data " + data);
}
