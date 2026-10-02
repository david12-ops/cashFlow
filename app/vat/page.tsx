import VatPage from "@/components/pagesComp/vatPage";
import dphPrediction from "@/utils/vatPrediction";

export default async function Page() {
  const monthlyDPHPrediction = dphPrediction();

  return <VatPage data={monthlyDPHPrediction} />;
}
