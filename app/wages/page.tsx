import { GridCompComp } from "@/components/gridComp";
import wageCostsPrediction from "@/utils/wageCostsPrediction";
import { Box, Heading, Span } from "@chakra-ui/react";

export default async function Page() {
  const wagePrediction = wageCostsPrediction(); // zatim OK

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
        <Box>
          <Heading as="h1" size="lg" mb={8} textAlign="center">
            Evaluation of wages prediction
          </Heading>

          <Box
            display="flex"
            flexDirection={"column"}
            justifyContent={"space-between"}
          >
            <Box>
              {
                <GridCompComp
                  confidenceIntervals={wagePrediction.confidenceIntervals}
                  itemsPerPage={8}
                />
              }
            </Box>
            <Box alignSelf={"center"} paddingTop="20px">
              <Heading as="h2" size="lg" mb={3}>
                Statistics
              </Heading>

              <Box>
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
                    name: "MRE",
                    value: wagePrediction.statistics.valueMRE,
                  },
                ].map(item => (
                  <Box key={item.name}>
                    <Span>
                      {item.name}: {item.value ?? "-"}
                    </Span>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
}
