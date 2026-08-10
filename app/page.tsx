import { createClient } from "@/supabase/server";
import { cookies } from "next/headers";
import dphPrediction from "@/utils/dphPrediction";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const monthlyDPHPredNumber = dphPrediction("MONTHLY");
  const quarterlyDPHPredNumber = dphPrediction("QUARTERLY");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: todos } = await supabase.from("todos").select();

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
        <h1 style={{ textAlign: "center" }}>Monthly</h1>
        {/* {<ChartComp text="ahoj" />} */}
        <p style={{ textAlign: "center", fontSize: "30px" }}>
          {monthlyDPHPredNumber}
        </p>

        <h1 style={{ textAlign: "center" }}>Quarterly</h1>
        <p style={{ textAlign: "center", fontSize: "30px" }}>
          {quarterlyDPHPredNumber}
        </p>
      </div>
    </div>
  );
}
