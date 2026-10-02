"use client";

import ChartComp from "@/components/chartComp";
import { GridIntervalsDataComponent } from "@/components/gridsComp";
import VatTableComp from "@/components/tablesComp/vatTableComp";
import { DataForVatPrediction, IntervalData, Statistics } from "@/zod-schemas";
import { Box, Heading, IconButton, Span, Text } from "@chakra-ui/react";
import { House } from "lucide-react";
import Link from "next/link";

type VatPageProps = {
  data:
    | {
        usedData: DataForVatPrediction;
        confidenceIntervals: IntervalData;
        statistics: Statistics;
      }
    | undefined;
};

const VatPage = ({ data }: VatPageProps) => {
  const monthlyVatPrediction = data;

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
              Monthly (VAT) Graph
            </Heading>

            <IconButton asChild aria-label="Domů" position="absolute" right={5}>
              <Link href="/">
                <House size={20} />
              </Link>
            </IconButton>
          </Box>

          {monthlyVatPrediction ? (
            <ChartComp
              usedData={{
                type: "vat",
                data: monthlyVatPrediction.usedData.data,
              }}
              confidenceIntervals={monthlyVatPrediction.confidenceIntervals}
              statistics={monthlyVatPrediction.statistics}
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
            {monthlyVatPrediction ? (
              <VatTableComp
                years={Object.keys(monthlyVatPrediction.usedData.data)}
                dataWithYears={monthlyVatPrediction.usedData.data}
                monthData={null}
                valueType="currency"
              />
            ) : (
              <Text>Missing data for table (used data)</Text>
            )}
          </Box>
          <Box>
            <Heading as="h2" size="lg" mb={8} textAlign="center">
              Data (training) used for evaluation of VAT prediction
            </Heading>
            {monthlyVatPrediction ? (
              <VatTableComp
                years={Object.keys(monthlyVatPrediction.usedData.trainingData)}
                dataWithYears={monthlyVatPrediction.usedData.trainingData}
                monthData={null}
                valueType="currency"
              />
            ) : (
              <Text>Missing data for table (training)</Text>
            )}
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={8} textAlign="center">
              Data (test) used for evaluation of VAT prediction
            </Heading>
            {monthlyVatPrediction &&
            monthlyVatPrediction.usedData.testData !== null ? (
              <VatTableComp
                years={[monthlyVatPrediction.usedData.testData.key]}
                dataWithYears={monthlyVatPrediction.usedData.testData.data}
                monthData={null}
                valueType="currency"
              />
            ) : (
              <Text>Missing data for table (test)</Text>
            )}
          </Box>
          <Box>
            <Heading as="h2" size="lg" mb={8} textAlign="center">
              Data (active) used for evaluation of VAT prediction
            </Heading>
            {monthlyVatPrediction &&
            monthlyVatPrediction.usedData.activeMonth ? (
              <VatTableComp
                years={null}
                dataWithYears={null}
                monthData={monthlyVatPrediction.usedData.activeMonth}
                valueType="currency"
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
          {monthlyVatPrediction && monthlyVatPrediction.usedData ? (
            <VatTableComp
              years={null}
              dataWithYears={null}
              monthData={monthlyVatPrediction.usedData.aggMonthNumbersInPercent}
              valueType="percent"
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
              {monthlyVatPrediction ? (
                <GridIntervalsDataComponent
                  confidenceIntervalsData={
                    monthlyVatPrediction.confidenceIntervals
                  }
                  itemsPerPage={6}
                  valueType="currency"
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
                {monthlyVatPrediction ? (
                  [
                    {
                      name: "MAE",
                      value: monthlyVatPrediction.statistics.valueMAE,
                    },
                    {
                      name: "RMSE",
                      value: monthlyVatPrediction.statistics.valueRMSE,
                    },
                    {
                      name: "MAPE",
                      value: monthlyVatPrediction.statistics.valueMAPE,
                    },
                    {
                      name: "MRE",
                      value: monthlyVatPrediction.statistics.valueMRE,
                    },
                  ].map(item => (
                    <Box key={item.name}>
                      <Span>
                        {item.name}:{" "}
                        {item.value != null
                          ? `${Number(item.value).toLocaleString("cs-CZ")}${
                              item.name === "MAPE" || item.name === "MRE"
                                ? " %"
                                : " Kč"
                            }`
                          : "-"}
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
};

export default VatPage;
