import { createClient } from "@/supabase/server";
import { cookies } from "next/headers";
import dphPrediction from "@/utils/dphPrediction";
import wageCostsPrediction from "@/utils/wageCostsPrediction";
import providedLoansPrediction from "@/utils/providedLoansPrediction";
import issuedInvoicesPrediction from "@/utils/issuedInvoicesPrediction";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: todos } = await supabase.from("todos").select();

  const monthlyDPHPredNumber = dphPrediction();
  const wagePrediction = wageCostsPrediction();
  const loanDelayPrediction = providedLoansPrediction();
  const invoicePaymentDelayPrediction = issuedInvoicesPrediction();

  return (
    <div
      style={{
        height: "100vh",
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
          <h1 style={{ textAlign: "center" }}>Monthly (DPH)</h1>
          {/* {<ChartComp text="ahoj" />} */}
          <p style={{ textAlign: "center", fontSize: "30px" }}>
            {monthlyDPHPredNumber}
          </p>
        </div>

        <div>
          <h1 style={{ textAlign: "center" }}>Wage prediction</h1>
          {wagePrediction.Centroids.map((centroid, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <h3>Centroid: {centroid.toFixed(2)}</h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {wagePrediction.Cluster[index].map((dataPoint, dataIndex) => (
                  <div key={dataIndex}>
                    <p>DimDateId - {dataPoint.DimDateId}</p>
                    <p>
                      TransactionDate -{" "}
                      {dataPoint.TransactionDate.toDateString()}
                    </p>
                    <p>BaseAmount - {dataPoint.BaseAmount}</p>
                    <p>Account - {dataPoint.Account}</p>
                    <p>Division - {dataPoint.Division}</p>
                    <p>Currency - {dataPoint.Currency}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h1 style={{ textAlign: "center" }}>Loans delay prediction</h1>
        {loanDelayPrediction.map((item, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <p>Date: {item.date}</p>
            <p>Lower Bound: {item.lowerBound}</p>
            <p>Prediction: {item.prediction}</p>
            <p>Upper Bound: {item.upperBound}</p>
          </div>
        ))}
      </div>

      <div>
        <h1 style={{ textAlign: "center" }}>
          Invoices payment delay prediction
        </h1>
        {invoicePaymentDelayPrediction.map((item, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <p>Date: {item.date}</p>
            <p>Lower Bound: {item.lowerBound}</p>
            <p>Prediction: {item.prediction}</p>
            <p>Upper Bound: {item.upperBound}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
