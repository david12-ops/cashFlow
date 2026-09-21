import { createClient } from "@/supabase/server";
import { cookies } from "next/headers";
import dphPrediction from "@/utils/dphPrediction";
import wageCostsPrediction from "@/utils/wageCostsPrediction";
import providedLoansPrediction from "@/utils/providedLoansPrediction";
import issuedInvoicesPrediction from "@/utils/issuedInvoicesPrediction";
import { ChartComp } from "@/components/chartComp";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: todos } = await supabase.from("todos").select();

  const monthlyDPHPredNumber = dphPrediction();
  // const wagePrediction = wageCostsPrediction(); // OK
  //const loanDelayPrediction = providedLoansPrediction(); // zatim ok
  //const invoicePaymentDelayPrediction = issuedInvoicesPrediction();

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
          <h1 style={{ textAlign: "center" }}>Monthly (DPH)</h1>
          {/* {monthlyDPHPredNumber && (
            <ChartComp
              usedData={monthlyDPHPredNumber.usedData}
              confidenceIntervals={monthlyDPHPredNumber.confidenceIntervals}
              statistics={monthlyDPHPredNumber.statistics}
            />
          )} */}
          {monthlyDPHPredNumber &&
            monthlyDPHPredNumber.confidenceIntervals.map((item, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                <p>Date: {item.date}</p>
                <p>Lower Bound: {item.lowerBound}</p>
                <p>Prediction: {item.prediction}</p>
                <p>Upper Bound: {item.upperBound}</p>
              </div>
            ))}
          <div style={{ paddingTop: "20px" }}>
            <h1>Statistics</h1>

            {monthlyDPHPredNumber &&
              [
                {
                  name: "MAE",
                  value: monthlyDPHPredNumber.statistics.valueMAE,
                },
                {
                  name: "RMSE",
                  value: monthlyDPHPredNumber.statistics.valueRMSE,
                },
                {
                  name: "MAPE",
                  value: monthlyDPHPredNumber.statistics.valueMAPE,
                },
                {
                  name: "Průměrná relativní chyba",
                  value: monthlyDPHPredNumber.statistics.relativeErrorAvg,
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

        {/* <div>
          <h1 style={{ textAlign: "center" }}>Wage prediction</h1>

          {wagePrediction.confidenceIntervals.map((item, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <p>Date: {item.date}</p>
              <p>Lower Bound: {item.lowerBound}</p>
              <p>Prediction: {item.prediction}</p>
              <p>Upper Bound: {item.upperBound}</p>
            </div>
          ))}

          <div style={{ paddingTop: "20px" }}>
            <h1>Statistics</h1>

            {[
              {
                name: "MAE",
                value: wagePrediction.statistics.valueMAE,
              },
              {
                name: "RMSE",
                value: wagePrediction.statistics.valueRMSE,
              },
              {
                name: "MAPE",
                value: wagePrediction.statistics.valueMAPE,
              },
              {
                name: "Průměrná relativní chyba",
                value: wagePrediction.statistics.relativeErrorAvg,
              },
            ].map(item => (
              <div key={item.name}>
                <span>
                  {item.name}: {item.value ?? "-"}
                </span>
              </div>
            ))}
          </div>
        </div> */}
        {/* <div>
          <h1 style={{ textAlign: "center" }}>Loans delay prediction</h1>
          {loanDelayPrediction &&
            loanDelayPrediction.confidenceIntervals.map((item, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                <p>Date: {item.date}</p>
                <p>Lower Bound: {item.lowerBound}</p>
                <p>Prediction: {item.prediction}</p>
                <p>Upper Bound: {item.upperBound}</p>
              </div>
            ))}
          <div style={{ paddingTop: "20px" }}>
            <h1>Statistics</h1>
            {loanDelayPrediction &&
              [
                {
                  name: "MAE",
                  value: loanDelayPrediction.statistics.valueMAE,
                },
                {
                  name: "RMSE",
                  value: loanDelayPrediction.statistics.valueRMSE,
                },
                {
                  name: "MAPE",
                  value: loanDelayPrediction.statistics.valueMAPE,
                },
                {
                  name: "Průměrná relativní chyba",
                  value: loanDelayPrediction.statistics.relativeErrorAvg,
                },
              ].map(item => (
                <div key={item.name}>
                  <span>
                    {item.name}: {item.value ?? "-"}
                  </span>
                </div>
              ))}
          </div>
        </div> */}

        {/* <div>
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
                name: "Průměrná relativní chyba",
                value:
                  invoicePaymentDelayPrediction.statistics.relativeErrorAvg,
              },
            ].map(item => (
              <div key={item.name}>
                <span>
                  {item.name}: {item.value ?? "-"}
                </span>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
