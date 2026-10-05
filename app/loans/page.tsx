import LoanPage from "@/components/pagesComp/loanPage";
import providedLoansPrediction from "@/utils/providedLoansPrediction";
// import fs from "fs";

export default async function Page() {
  const loanDelayPrediction = providedLoansPrediction(); // zatim ok

  // fs.writeFileSync(
  //   "loanData.json",
  //   JSON.stringify(loanDelayPrediction?.usedData.data, null, 2),
  //   "utf-8"
  // );

  // fs.writeFileSync(
  //   "prediction.json",
  //   JSON.stringify(loanDelayPrediction?.confidenceIntervals, null, 2),
  //   "utf-8"
  // );

  return <LoanPage data={loanDelayPrediction} />;
}
