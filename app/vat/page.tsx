import VatPage from "@/components/pagesComp/vatPage";
import dphPrediction from "@/utils/vatPrediction";
// import fs from "fs";

export default async function Page() {
  const monthlyDPHPrediction = dphPrediction();

  // fs.writeFileSync(
  //   "vatData.json",
  //   JSON.stringify(monthlyDPHPrediction?.usedData.data, null, 2),
  //   "utf-8"
  // );

  // fs.writeFileSync(
  //   "prediction.json",
  //   JSON.stringify(monthlyDPHPrediction?.confidenceIntervals, null, 2),
  //   "utf-8"
  // );

  return <VatPage data={monthlyDPHPrediction} />;
}
