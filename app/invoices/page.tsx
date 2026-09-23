import InvoicePage from "@/components/pagesComp/invoicePage";
import issuedInvoicesPrediction from "@/utils/issuedInvoicesPrediction";

export default async function Page() {
  const invoicePaymentDelayPrediction = issuedInvoicesPrediction(); // ne

  return <InvoicePage data={invoicePaymentDelayPrediction} />;
}
