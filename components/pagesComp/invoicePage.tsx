"use client";

import { GridIntervalsDataComponent } from "@/components/gridComp";
import { Box, Heading, Text, Span } from "@chakra-ui/react";

import {
  DataForInvoicePrediction,
  IntervalData,
  Statistics,
} from "@/zod-schemas";

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
              Invoice Graph
            </Heading>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" gap={10}></Box>

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
