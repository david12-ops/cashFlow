"use client";

import { GridIntervalsDataComponent } from "@/components/gridsComp";
import { DataForLoanPrediction, IntervalData, Statistics } from "@/zod-schemas";
import { Box, Heading, Text, Span, IconButton } from "@chakra-ui/react";
import { House } from "lucide-react";
import Link from "next/link";
import ChartComp from "../chartComp";
import LoanTableComp from "../tablesComp/loanTableCom";
import PredictionLoanMethodsComponents from "../graphsLoanComp";

type LoanPageProps = {
  data:
    | {
        usedData: DataForLoanPrediction;
        confidenceIntervals: IntervalData;
        statistics: Statistics;
      }
    | undefined;
};

const LoanPage = ({ data }: LoanPageProps) => {
  const loanDelayPrediction = data; // zatim ok

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
              Monthly delay (Loans) prediction Graph
            </Heading>

            <IconButton asChild aria-label="Domů" position="absolute" right={5}>
              <Link href="/">
                <House size={20} />
              </Link>
            </IconButton>
          </Box>

          {loanDelayPrediction ? (
            <ChartComp
              usedData={{
                type: "loan",
                data: loanDelayPrediction.usedData.data,
              }}
              confidenceIntervals={loanDelayPrediction.confidenceIntervals}
              statistics={loanDelayPrediction.statistics}
            />
          ) : (
            <Text>Missing data for graph</Text>
          )}
        </Box>
        <Box>
          <Heading as="h2" size="lg" mb={8} textAlign="center">
            Graps for comparition to prediction graph
          </Heading>
          <Box>
            {loanDelayPrediction ? (
              <PredictionLoanMethodsComponents
                usedDataForGraph={loanDelayPrediction.usedData.data}
                predictionsData={loanDelayPrediction.usedData.predictionsData}
                algorithmsParams={loanDelayPrediction.usedData.algorithmsParams}
              />
            ) : (
              <Text>Missing data for graphs</Text>
            )}
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" gap={10}>
          <Box>
            <Heading as="h1" size="lg" mb={8} textAlign="center">
              Data used for evaluation of loan delay prediction
            </Heading>
            {loanDelayPrediction ? (
              <LoanTableComp
                years={[
                  ...new Set(
                    loanDelayPrediction.usedData.data.map(item =>
                      item.dueDate.getFullYear()
                    )
                  ),
                ].sort((a, b) => a - b)}
                data={loanDelayPrediction.usedData.data}
                type="all"
                itemsPerPage={30}
              />
            ) : (
              <Text>Missing data for table (used data)</Text>
            )}
          </Box>
          <Box>
            <Heading as="h2" size="lg" mb={8} textAlign="center">
              Data (training) used for evaluation of loan delay prediction
            </Heading>
            {loanDelayPrediction ? (
              <LoanTableComp
                years={[
                  ...new Set(
                    loanDelayPrediction.usedData.trainingData.map(item =>
                      item.dueDate.getFullYear()
                    )
                  ),
                ].sort((a, b) => a - b)}
                data={loanDelayPrediction.usedData.trainingData}
                type="training"
                itemsPerPage={30}
              />
            ) : (
              <Text>Missing data for table (training data)</Text>
            )}
          </Box>
          <Box>
            <Heading as="h2" size="lg" mb={8} textAlign="center">
              Data (test) used for evaluation of loan delay prediction
            </Heading>
            {loanDelayPrediction ? (
              <LoanTableComp
                years={[
                  ...new Set(
                    loanDelayPrediction.usedData.testData.map(item =>
                      item.dueDate.getFullYear()
                    )
                  ),
                ].sort((a, b) => a - b)}
                data={loanDelayPrediction.usedData.testData}
                type="test"
                itemsPerPage={30}
              />
            ) : (
              <Text>Missing data for table (test data)</Text>
            )}
          </Box>
        </Box>
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
                  valueType="day"
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
                        {item.name}:{" "}
                        {item.value != null
                          ? `${Number(item.value).toLocaleString("cs-CZ")}${
                              item.name === "MAPE" || item.name === "MRE"
                                ? " %"
                                : " day/s"
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

export default LoanPage;
