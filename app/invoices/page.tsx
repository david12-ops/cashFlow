import issuedInvoicesPrediction from "@/utils/issuedInvoicesPrediction";

export default async function Page() {
  const invoicePaymentDelayPrediction = issuedInvoicesPrediction(); // ne

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ textAlign: "center" }}>
            Invoices payment delay prediction
          </h1>
          {invoicePaymentDelayPrediction.confidenceIntervals.map(
            (item, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                <p>Date: {item.date}</p>
                <p>Lower Bound: {item.lowerBound}</p>
                <p>Prediction: {item.prediction}</p>
                <p>Upper Bound: {item.upperBound}</p>
              </div>
            )
          )}
          <div style={{ paddingTop: "20px" }}>
            <h1>Statistics</h1>
            {[
              {
                name: "MAE",
                value: invoicePaymentDelayPrediction.statistics.valueMAE,
              },
              {
                name: "RMSE",
                value: invoicePaymentDelayPrediction.statistics.valueRMSE,
              },
              {
                name: "MAPE",
                value: invoicePaymentDelayPrediction.statistics.valueMAPE,
              },
              {
                name: "MRE",
                value: invoicePaymentDelayPrediction.statistics.valueMRE,
              },
            ].map(item => (
              <div key={item.name}>
                <span>
                  {item.name}: {item.value ?? "-"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
