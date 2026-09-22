import { ChartComp } from "@/components/chartComp";
import { GridCompComp } from "@/components/gridComp";
import { TableComp } from "@/components/tablesComp/dphTableComp";
import dphPrediction from "@/utils/dphPrediction";
import { Box, Heading, IconButton, Span, Text } from "@chakra-ui/react";
import { House } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const monthlyDPHPrediction = dphPrediction();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      margin={25}
    >
      <Box display="flex" flexDirection="column" gap={16}>
        <Box>
          <Box
            position="relative"
            p={5}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Heading as="h1" size="lg">
              Monthly (DPH) Graph
            </Heading>

            <IconButton asChild aria-label="Domů" position="absolute" right={5}>
              <Link href="/">
                <House size={20} />
              </Link>
            </IconButton>
          </Box>

          {monthlyDPHPrediction ? (
            <ChartComp
              usedData={monthlyDPHPrediction.usedData}
              confidenceIntervals={monthlyDPHPrediction.confidenceIntervals}
              statistics={monthlyDPHPrediction.statistics}
            />
          ) : (
            <Text>Missing data for graph</Text>
          )}
        </Box>
        <Box display="flex" flexDirection="column" gap={16}>
          <Box>
            <Heading as="h1" size="lg" mb={8} textAlign="center">
              Data used for evaluation of VAT prediction
            </Heading>
            {monthlyDPHPrediction ? (
              <TableComp
                years={Object.keys(monthlyDPHPrediction.usedData.data)}
                dataWithYears={monthlyDPHPrediction.usedData.data}
                monthData={null}
              />
            ) : (
              <Text>Missing data for table (used data)</Text>
            )}
          </Box>
          <Box>
            <Heading as="h2" size="lg" mb={8} textAlign="center">
              Data (training) used for evaluation of VAT prediction
            </Heading>
            {monthlyDPHPrediction ? (
              <TableComp
                years={Object.keys(monthlyDPHPrediction.usedData.trainingData)}
                dataWithYears={monthlyDPHPrediction.usedData.trainingData}
                monthData={null}
              />
            ) : (
              <Text>Missing data for table (training)</Text>
            )}
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={8} textAlign="center">
              Data (test) used for evaluation of VAT prediction
            </Heading>
            {monthlyDPHPrediction && monthlyDPHPrediction.usedData.testData ? (
              <TableComp
                years={[monthlyDPHPrediction.usedData.testData.key]}
                dataWithYears={monthlyDPHPrediction.usedData.testData.data}
                monthData={null}
              />
            ) : (
              <Text>Missing data for table (test)</Text>
            )}
          </Box>
          <Box>
            <Heading as="h2" size="lg" mb={8} textAlign="center">
              Data (active) used for evaluation of VAT prediction
            </Heading>
            {monthlyDPHPrediction && monthlyDPHPrediction.usedData ? (
              <TableComp
                years={null}
                dataWithYears={null}
                monthData={monthlyDPHPrediction.usedData.activeMonth}
              />
            ) : (
              <Text>Missing data for table (active month)</Text>
            )}
          </Box>
        </Box>
        <Box>
          <Heading as="h1" size="lg" mb={8} textAlign="center">
            Evaluation of VAT prediction in Percent
          </Heading>
          <Text mb={4} mt={4}>
            This table presents the daily VAT values expressed as a percentage
            of the total monthly VAT value. The table also shows the average and
            median daily VAT value for the given month.
          </Text>
          {monthlyDPHPrediction && monthlyDPHPrediction.usedData ? (
            <TableComp
              years={null}
              dataWithYears={null}
              monthData={monthlyDPHPrediction.usedData.aggMonthNumbersInPercent}
            />
          ) : (
            <Text>Missing data for table (prediction in percent)</Text>
          )}
        </Box>
        <Box>
          <Heading as="h1" size="lg" mb={8} textAlign="center">
            Evaluation of VAT prediction
          </Heading>

          <Box
            display="flex"
            flexDirection={"column"}
            justifyContent={"space-between"}
          >
            <Box>
              {monthlyDPHPrediction ? (
                <GridCompComp
                  confidenceIntervals={monthlyDPHPrediction.confidenceIntervals}
                  itemsPerPage={8}
                />
              ) : (
                <Text>Missing confidence intervals data</Text>
              )}
            </Box>
            <Box alignSelf={"center"} paddingTop="20px">
              <Heading as="h2" size="lg" mb={3}>
                Statistics
              </Heading>

              <Box>
                {monthlyDPHPrediction ? (
                  [
                    {
                      name: "MAE",
                      value: monthlyDPHPrediction.statistics.valueMAE,
                    },
                    {
                      name: "RMSE",
                      value: monthlyDPHPrediction.statistics.valueRMSE,
                    },
                    {
                      name: "MAPE",
                      value: monthlyDPHPrediction.statistics.valueMAPE,
                    },
                    {
                      name: "MRE",
                      value: monthlyDPHPrediction.statistics.valueMRE,
                    },
                  ].map(item => (
                    <Box key={item.name}>
                      <Span>
                        {item.name}: {item.value ?? "-"}
                      </Span>
                    </Box>
                  ))
                ) : (
                  <Text>Missing statistics data</Text>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
