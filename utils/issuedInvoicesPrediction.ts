import { InvoicesData } from "@/zod-schemas/invoicesDataTypes";

function prepareInvoiceData(): InvoicesData {
  const loanData: InvoicesData = [];

  return loanData;
}

function issuedInvoicesPrediction() {
  const data: InvoicesData = prepareInvoiceData();

  console.log("loan data " + data);
}
