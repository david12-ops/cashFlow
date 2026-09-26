"use client";

import { GridIntervalsDataComponent } from "@/components/gridsComp";
import { Box, Heading, Text, Span, IconButton } from "@chakra-ui/react";
import { House } from "lucide-react";
import Link from "next/link";

import {
  DataForInvoicePrediction,
  IntervalData,
  Statistics,
} from "@/zod-schemas";
import ChartComp from "../chartComp";
import InvoiceTableComp from "../tablesComp/InvoiceTableComp";

type InvoicePageProps = {
  data: {
    usedData: DataForInvoicePrediction;
    confidenceIntervals: IntervalData;
    statistics: Statistics;
  };
};

export default function InvoicePage({ data }: InvoicePageProps) {
  const invoicePaymentDelayPrediction = data; // nenei ok

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
              Monthly delay (Invoice) Graph
            </Heading>

            <IconButton asChild aria-label="Domů" position="absolute" right={5}>
              <Link href="/">
                <House size={20} />
              </Link>
            </IconButton>
          </Box>

          <ChartComp
            usedData={{
              type: "invoice",
              data: invoicePaymentDelayPrediction.usedData.data,
            }}
            confidenceIntervals={
              invoicePaymentDelayPrediction.confidenceIntervals
            }
            statistics={invoicePaymentDelayPrediction.statistics}
          />
        </Box>
        <Box display="flex" flexDirection="column" gap={10}>
          <Box>
            <Heading as="h1" size="lg" mb={8} textAlign="center">
              Data used for evaluation of invoice delay prediction
            </Heading>

            <InvoiceTableComp
              years={[
                ...new Set(
                  invoicePaymentDelayPrediction.usedData.data.map(item =>
                    item.DueDate.getFullYear()
                  )
                ),
              ].sort((a, b) => a - b)}
              data={invoicePaymentDelayPrediction.usedData.data}
              type="all"
              itemsPerPage={30}
            />
          </Box>
          <Box>
            <Heading as="h1" size="lg" mb={8} textAlign="center">
              Excluded data of invoice delay prediction
            </Heading>

            <InvoiceTableComp
              years={[
                ...new Set(
                  invoicePaymentDelayPrediction.usedData.excludetData.map(
                    item => item.DueDate.getFullYear()
                  )
                ),
              ].sort((a, b) => a - b)}
              data={invoicePaymentDelayPrediction.usedData.excludetData}
              type="all"
              itemsPerPage={30}
            />
          </Box>
          <Box>
            <Heading as="h2" size="lg" mb={8} textAlign="center">
              Data (training) used for evaluation of loan delay prediction
            </Heading>

            <InvoiceTableComp
              years={[
                ...new Set(
                  invoicePaymentDelayPrediction.usedData.trainingData.map(
                    item => item.DueDate.getFullYear()
                  )
                ),
              ].sort((a, b) => a - b)}
              data={invoicePaymentDelayPrediction.usedData.trainingData}
              type="training"
              itemsPerPage={30}
            />
          </Box>
          <Box>
            <Heading as="h2" size="lg" mb={8} textAlign="center">
              Data (test) used for evaluation of loan delay prediction
            </Heading>

            <InvoiceTableComp
              years={[
                ...new Set(
                  invoicePaymentDelayPrediction.usedData.testData.map(item =>
                    item.DueDate.getFullYear()
                  )
                ),
              ].sort((a, b) => a - b)}
              data={invoicePaymentDelayPrediction.usedData.testData}
              type="test"
              itemsPerPage={30}
            />
          </Box>
        </Box>
        <Box>missing</Box>
        <Box>
          <Heading as="h1" size="lg" mb={8} textAlign="center">
            Evaluation of invoices prediction
          </Heading>

          <Box
            display="flex"
            flexDirection={"column"}
            justifyContent={"space-between"}
          >
            <Box>
              {invoicePaymentDelayPrediction ? (
                <GridIntervalsDataComponent
                  confidenceIntervalsData={
                    invoicePaymentDelayPrediction.confidenceIntervals
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
                {invoicePaymentDelayPrediction ? (
                  [
                    {
                      name: "MAE",
                      value: invoicePaymentDelayPrediction.statistics.valueMAE,
                    },
                    {
                      name: "RMSE",
                      value: invoicePaymentDelayPrediction.statistics.valueRMSE,
                    },
                    {
                      name: "MAPE",
                      value: invoicePaymentDelayPrediction.statistics.valueMAPE,
                    },
                    {
                      name: "MRE",
                      value: invoicePaymentDelayPrediction.statistics.valueMRE,
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
