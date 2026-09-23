import DphPage from "@/components/pagesComp/dphPage";
import dphPrediction from "@/utils/dphPrediction";

export default async function Page() {
  const monthlyDPHPrediction = dphPrediction();

  return <DphPage data={monthlyDPHPrediction} />;
}
