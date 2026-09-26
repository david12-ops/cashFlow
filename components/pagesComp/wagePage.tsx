"use client";

import { GridIntervalsDataComponent } from "@/components/gridsComp";
import { DataForWagePrediction, IntervalData, Statistics } from "@/zod-schemas";
import { Box, Heading, IconButton, Span, Text } from "@chakra-ui/react";
import { House } from "lucide-react";
import Link from "next/link";
import ChartComp from "../chartComp";
import WageTableComp from "../tablesComp/wageTableComp";
import IterationsWageComponent from "../iterationsWageComp";

type WagePageProps = {
  data: {
    usedData: DataForWagePrediction;
    confidenceIntervals: IntervalData;
    statistics: Statistics;
  };
};
export default function WagePage({ data }: WagePageProps) {
  const wagePrediction = data; // zatim OK

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
              Monthly (Wages) Graph
            </Heading>

            <IconButton asChild aria-label="Domů" position="absolute" right={5}>
              <Link href="/">
                <House size={20} />
              </Link>
            </IconButton>
          </Box>

          {wagePrediction && (
            <ChartComp
              usedData={{
                type: "wage",
                data: wagePrediction.usedData.data,
              }}
              confidenceIntervals={wagePrediction.confidenceIntervals}
              statistics={wagePrediction.statistics}
            />
          )}
        </Box>
        <Box display="flex" flexDirection="column" gap={10}>
          <Box>
            <Heading as="h1" size="lg" mb={8} textAlign="center">
              Data used for evaluation of wage prediction
            </Heading>
            <WageTableComp
              years={[
                ...new Set(
                  wagePrediction.usedData.data.map(item =>
                    item.transactionDate.getFullYear()
                  )
                ),
              ].sort((a, b) => a - b)}
              data={wagePrediction.usedData.data}
              type="all"
              itemsPerPage={30}
            />
          </Box>
          <Box>
            <Heading as="h2" size="lg" mb={8} textAlign="center">
              Data (training) used for evaluation of wage prediction
            </Heading>

            <WageTableComp
              years={[
                ...new Set(
                  wagePrediction.usedData.trainingData.map(item =>
                    item.transactionDate.getFullYear()
                  )
                ),
              ].sort((a, b) => a - b)}
              data={wagePrediction.usedData.trainingData}
              type="training"
              itemsPerPage={30}
            />
          </Box>
          <Box>
            <Heading as="h2" size="lg" mb={8} textAlign="center">
              Data (test) used for evaluation of wage prediction
            </Heading>
            <WageTableComp
              years={[
                ...new Set(
                  wagePrediction.usedData.testData.map(item =>
                    item.transactionDate.getFullYear()
                  )
                ),
              ].sort((a, b) => a - b)}
              data={wagePrediction.usedData.testData}
              type="test"
              itemsPerPage={30}
            />
          </Box>
          <Box>
            <Heading as="h2" size="lg" mb={8} textAlign="center">
              Optimal count of group for K-means
            </Heading>
            <Text textAlign="center">
              Count of groups: {wagePrediction.usedData.optimalK}
            </Text>
          </Box>
        </Box>
        <Box>
          <IterationsWageComponent
            data={wagePrediction.usedData.iterationsKmeansData}
          />
        </Box>
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
                <GridIntervalsDataComponent
                  confidenceIntervalsData={wagePrediction.confidenceIntervals}
                  itemsPerPage={6}
                  valueType="currency"
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
      </Box>
    </Box>
  );
}
