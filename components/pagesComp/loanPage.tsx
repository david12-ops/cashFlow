"use client";

import { GridIntervalsDataComponent } from "@/components/gridComp";
import { DataForLoanPrediction, IntervalData, Statistics } from "@/zod-schemas";
import { Box, Heading, Text, Span } from "@chakra-ui/react";

type LoanPageProps = {
  data:
    | {
        usedData: DataForLoanPrediction;
        confidenceIntervals: IntervalData;
        statistics: Statistics;
      }
    | undefined;
};

export default function LoanPage({ data }: LoanPageProps) {
  const loanDelayPrediction = data; // zatim ok

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
            Evaluation of loans prediction
          </Heading>

          <Box
            display="flex"
            flexDirection={"column"}
            justifyContent={"space-between"}
          >
            <Box>
              {loanDelayPrediction ? (
                <GridIntervalsDataComponent
                  confidenceIntervalsData={
                    loanDelayPrediction.confidenceIntervals
                  }
                  itemsPerPage={6}
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
                {loanDelayPrediction ? (
                  [
                    {
                      name: "MAE",
                      value: loanDelayPrediction.statistics.valueMAE,
                    },
                    {
                      name: "RMSE",
                      value: loanDelayPrediction.statistics.valueRMSE,
                    },
                    {
                      name: "MAPE",
                      value: loanDelayPrediction.statistics.valueMAPE,
                    },
                    {
                      name: "MRE",
                      value: loanDelayPrediction.statistics.valueMRE,
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
      </div>
    </div>
  );
}
