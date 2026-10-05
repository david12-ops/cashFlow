"use client";

import {
  AmountsPairedToCentroid,
  IntervalData,
  WagesData,
} from "@/zod-schemas";
import { Grid, Text, Box, Button } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type GridIntervalsDataProps = {
  confidenceIntervalsData: IntervalData;
  itemsPerPage: number;
  valueType: "day" | "currency";
};

type GridWageDataProps = {
  wageData: WagesData;
  itemsPerPage: number;
};

type GridKmeansData = {
  data: AmountsPairedToCentroid;
  itemsPerPage: number;
};

type PageData = {
  [page: number]: object[];
};

type PagesData = {
  pagesCount: number;
  pageData: PageData;
};

function dataByPage(data: object[], itemsPerPage: number): PagesData {
  const page: PagesData = {
    pagesCount: Math.ceil(data.length / itemsPerPage),
    pageData: {},
  };

  for (let i = 0; i < page.pagesCount; i++) {
    const start = i * itemsPerPage;
    const end = start + itemsPerPage;

    page.pageData[i + 1] = data.slice(start, end);
  }

  return page;
}

export const GridKmeansDataComponent = ({
  data,
  itemsPerPage,
}: GridKmeansData) => {
  const { pagesCount, pageData } = dataByPage(data, itemsPerPage) as {
    pagesCount: number;
    pageData: { [page: number]: AmountsPairedToCentroid };
  };

  const [pagination, setPaginationState] = useState<boolean>(true);
  const [page, setPageState] = useState<number>(1);

  return (
    <Box>
      <Box
        display="flex"
        flexDirection={"row"}
        justifyContent={"space-between"}
        p={5}
        flexWrap={"wrap"}
      >
        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            onClick={() => {
              if (page > 1) {
                setPageState(page - 1);
              }
            }}
            disabled={!pagination || page === 1}
          >
            <ChevronLeft size={20} />
          </Button>

          <Button
            onClick={() => {
              if (page < pagesCount) {
                setPageState(page + 1);
              }
            }}
            disabled={!pagination || page === pagesCount}
          >
            <ChevronRight size={20} />
          </Button>
        </Box>
        {pagination && <Text>Page: {page}</Text>}
        <Button onClick={() => setPaginationState(!pagination)}>
          {pagination ? "Show all" : "Show pages"}
        </Button>
      </Box>

      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={5}>
        {!pagination
          ? data.map((item, index) => (
              <Box
                key={index}
                p={4}
                bg="bg.subtle"
                borderRadius="md"
                boxShadow="sm"
              >
                <Box>
                  <Text mb={2}>DimDateId: {item.wageItem.dimDateId}</Text>
                  <Text mb={2}>
                    Transaction date:{" "}
                    {item.wageItem.transactionDate.toLocaleDateString("cs-CZ")}
                  </Text>
                  <Text mb={2}>Base amount: {item.wageItem.baseAmount} Kč</Text>
                  <Text mb={2}>Account: {item.wageItem.account}</Text>
                  <Text mb={2}>Division: {item.wageItem.division}</Text>
                  <Text mb={2}>Currency: {item.wageItem.currency}</Text>
                  <Text mb={2}>Centroid index: {item.centroidIndex}</Text>
                  <Text>Distance: {item.distance}</Text>
                </Box>
              </Box>
            ))
          : pageData[page].map((item, index) => (
              <Box
                key={index}
                p={4}
                bg="bg.subtle"
                borderRadius="md"
                boxShadow="sm"
              >
                <Box>
                  <Text mb={2}>DimDateId: {item.wageItem.dimDateId}</Text>
                  <Text mb={2}>
                    Transaction date:{" "}
                    {item.wageItem.transactionDate.toLocaleDateString("cs-CZ")}
                  </Text>
                  <Text mb={2}>Base amount: {item.wageItem.baseAmount} Kč</Text>
                  <Text mb={2}>Account: {item.wageItem.account}</Text>
                  <Text mb={2}>Division: {item.wageItem.division}</Text>
                  <Text mb={2}>Currency: {item.wageItem.currency}</Text>
                  <Text mb={2}>Centroid index: {item.centroidIndex}</Text>
                  <Text>Distance: {item.distance}</Text>
                </Box>
              </Box>
            ))}
      </Grid>
    </Box>
  );
};

export const GridWagesDataComponent = ({
  wageData,
  itemsPerPage,
}: GridWageDataProps) => {
  const { pagesCount, pageData } = dataByPage(wageData, itemsPerPage) as {
    pagesCount: number;
    pageData: { [page: number]: WagesData };
  };

  const [pagination, setPaginationState] = useState<boolean>(true);
  const [page, setPageState] = useState<number>(1);

  return (
    <Box>
      <Box
        display="flex"
        flexDirection={"row"}
        justifyContent={"space-between"}
        p={5}
        flexWrap={"wrap"}
      >
        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            onClick={() => {
              if (page > 1) {
                setPageState(page - 1);
              }
            }}
            disabled={!pagination || page === 1}
          >
            <ChevronLeft size={20} />
          </Button>

          <Button
            onClick={() => {
              if (page < pagesCount) {
                setPageState(page + 1);
              }
            }}
            disabled={!pagination || page === pagesCount}
          >
            <ChevronRight size={20} />
          </Button>
        </Box>
        {pagination && <Text>Page: {page}</Text>}
        <Button onClick={() => setPaginationState(!pagination)}>
          {pagination ? "Show all" : "Show pages"}
        </Button>
      </Box>

      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={5}>
        {!pagination
          ? wageData.map((item, index) => (
              <Box
                key={index}
                p={4}
                bg="bg.subtle"
                borderRadius="md"
                boxShadow="sm"
              >
                <Text mb={2}>DimDateId: {item.dimDateId}</Text>
                <Text mb={2}>
                  Transaction date:{" "}
                  {item.transactionDate.toLocaleDateString("cs-CZ")}
                </Text>
                <Text mb={2}>Base amount: {item.baseAmount} Kč</Text>
                <Text mb={2}>Account: {item.account}</Text>
                <Text mb={2}>Division: {item.division}</Text>
                <Text>Currency: {item.currency}</Text>
              </Box>
            ))
          : pageData[page].map((item, index) => (
              <Box
                key={index}
                p={4}
                bg="bg.subtle"
                borderRadius="md"
                boxShadow="sm"
              >
                <Text mb={2}>DimDateId: {item.dimDateId}</Text>
                <Text mb={2}>
                  Transaction date:{" "}
                  {item.transactionDate.toLocaleDateString("cs-CZ")}
                </Text>
                <Text mb={2}>Base amount: {item.baseAmount} Kč</Text>
                <Text mb={2}>Account: {item.account}</Text>
                <Text mb={2}>Division: {item.division}</Text>
                <Text>Currency: {item.currency}</Text>
              </Box>
            ))}
      </Grid>
    </Box>
  );
};

export const GridIntervalsDataComponent = ({
  confidenceIntervalsData,
  itemsPerPage,
  valueType,
}: GridIntervalsDataProps) => {
  const { pagesCount, pageData } = dataByPage(
    confidenceIntervalsData,
    itemsPerPage
  ) as {
    pagesCount: number;
    pageData: { [page: number]: IntervalData };
  };

  const [pagination, setPaginationState] = useState<boolean>(true);
  const [page, setPageState] = useState<number>(1);

  return (
    <Box>
      <Box
        display="flex"
        flexDirection={"row"}
        justifyContent={"space-between"}
        p={5}
        flexWrap={"wrap"}
      >
        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            onClick={() => {
              if (page > 1) {
                setPageState(page - 1);
              }
            }}
            disabled={!pagination || page === 1}
          >
            <ChevronLeft size={20} />
          </Button>

          <Button
            onClick={() => {
              if (page < pagesCount) {
                setPageState(page + 1);
              }
            }}
            disabled={!pagination || page === pagesCount}
          >
            <ChevronRight size={20} />
          </Button>
        </Box>
        {pagination && <Text>Page: {page}</Text>}
        <Button onClick={() => setPaginationState(!pagination)}>
          {pagination ? "Show all" : "Show pages"}
        </Button>
      </Box>

      <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={5}>
        {!pagination
          ? confidenceIntervalsData.map((item, index) => (
              <Box
                key={index}
                p={4}
                bg="bg.subtle"
                borderRadius="md"
                boxShadow="sm"
              >
                <Text mb={2}>Date: {item.date}</Text>
                <Text mb={2}>
                  Lower Bound: {item.lowerBound}{" "}
                  {valueType === "currency" ? "Kč" : "day/s"}
                </Text>
                <Text mb={2}>
                  Prediction: {item.prediction}{" "}
                  {valueType === "currency" ? "Kč" : "day/s"}
                </Text>
                <Text>
                  Upper Bound: {item.upperBound}{" "}
                  {valueType === "currency" ? "Kč" : "day/s"}
                </Text>
              </Box>
            ))
          : pageData[page].map((item, index) => (
              <Box
                key={index}
                p={4}
                bg="bg.subtle"
                borderRadius="md"
                boxShadow="sm"
              >
                <Text mb={2}>Date: {item.date}</Text>
                <Text mb={2}>
                  Lower Bound: {item.lowerBound}{" "}
                  {valueType === "currency" ? "Kč" : "day/s"}
                </Text>
                <Text mb={2}>
                  Prediction: {item.prediction}{" "}
                  {valueType === "currency" ? "Kč" : "day/s"}
                </Text>
                <Text>
                  Upper Bound: {item.upperBound}{" "}
                  {valueType === "currency" ? "Kč" : "day/s"}
                </Text>
              </Box>
            ))}
      </Grid>
    </Box>
  );
};
