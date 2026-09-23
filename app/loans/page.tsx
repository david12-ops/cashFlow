import LoanPage from "@/components/pagesComp/loanPage";
import providedLoansPrediction from "@/utils/providedLoansPrediction";

export default async function Page() {
  const loanDelayPrediction = providedLoansPrediction(); // zatim ok

  return <LoanPage data={loanDelayPrediction} />;
}
