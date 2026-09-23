import WagePage from "@/components/pagesComp/wagePage";
import wageCostsPrediction from "@/utils/wageCostsPrediction";

export default async function Page() {
  const wagePrediction = wageCostsPrediction(); // zatim OK

  return <WagePage data={wagePrediction} />;
}
