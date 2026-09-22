"use client";

import { IntervalData } from "@/zod-schemas";
import { Grid, Text, Box, Button } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type GridProps = {
  confidenceIntervals: IntervalData;
  itemsPerPage: number;
};

type PagesData = {
  pagesCount: number;
  data: { [page: number]: IntervalData };
};

function dataByPage(data: IntervalData, itemsPerPage: number): PagesData {
  const pageData: PagesData = {
    pagesCount: Math.ceil(data.length / itemsPerPage),
    data: {},
  };

  for (let i = 0; i < pageData.pagesCount; i++) {
    const start = i * itemsPerPage;
    const end = start + itemsPerPage;

    pageData.data[i + 1] = data.slice(start, end);
  }

  return pageData;
}

export const GridCompComp = ({
  confidenceIntervals,
  itemsPerPage,
}: GridProps) => {
  const { pagesCount, data } = dataByPage(confidenceIntervals, itemsPerPage);

  const [pagination, setPaginationState] = useState<boolean>();
  const [page, setPageState] = useState<number>(1);

  return (
    <Box>
      <Box
        display="flex"
        flexDirection={"row"}
        justifyContent={"space-between"}
        p={5}
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

      <Grid templateColumns="repeat(4, 1fr)" gap={5}>
        {!pagination
          ? confidenceIntervals.map((item, index) => (
              <Box
                key={index}
                p={4}
                bg="bg.subtle"
                borderRadius="md"
                boxShadow="sm"
              >
                <Text mb={2}>Date: {item.date}</Text>
                <Text mb={2}>Lower Bound: {item.lowerBound}</Text>
                <Text mb={2}>Prediction: {item.prediction}</Text>
                <Text>Upper Bound: {item.upperBound}</Text>
              </Box>
            ))
          : data[page].map((item, index) => (
              <Box
                key={index}
                p={4}
                bg="bg.subtle"
                borderRadius="md"
                boxShadow="sm"
              >
                <Text mb={2}>Date: {item.date}</Text>
                <Text mb={2}>Lower Bound: {item.lowerBound}</Text>
                <Text mb={2}>Prediction: {item.prediction}</Text>
                <Text>Upper Bound: {item.upperBound}</Text>
              </Box>
            ))}
      </Grid>
    </Box>
  );
};
