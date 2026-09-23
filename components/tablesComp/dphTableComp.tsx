"use client";

import { DphData, MonthData } from "@/zod-schemas";
import { Box, Table } from "@chakra-ui/react";
import { useState } from "react";

type DphTableProps = {
  years: string[] | null;
  dataWithYears: DphData | null;
  monthData: MonthData | null;
};

function getMedianAndAvg(values: number[]) {
  const sortedValues = [...values].sort((a, b) => a - b);

  const median =
    sortedValues.length % 2 === 0
      ? (sortedValues[sortedValues.length / 2 - 1] +
          sortedValues[sortedValues.length / 2]) /
        2
      : sortedValues[Math.floor(sortedValues.length / 2)];

  const avg =
    sortedValues.reduce((sum, val) => sum + val, 0) / sortedValues.length;

  return { median, avg };
}

export const DphTableComp = ({
  years,
  dataWithYears,
  monthData,
}: DphTableProps) => {
  const [year, setYearState] = useState<string | null>(
    years != null ? years[0] : null
  );

  const avgAndMedian =
    year != null && dataWithYears != null
      ? getMedianAndAvg(dataWithYears[year].map(item => item.dph_val))
      : monthData
        ? getMedianAndAvg(monthData.map(item => item.dph_val))
        : null;

  return (
    <Box>
      {years && (
        <Box
          display="flex"
          flexDirection={"row"}
          justifyContent={"space-between"}
          p={5}
        >
          {years.map(yearItem => (
            <Box
              key={yearItem}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              bg={year === yearItem ? "blue.500" : "bg.subtle"}
              color={year === yearItem ? "white" : "inherit"}
              onClick={() => setYearState(yearItem)}
              cursor="pointer"
            >
              {yearItem}
            </Box>
          ))}
        </Box>
      )}
      <Box>
        <Table.Root variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Year</Table.ColumnHeader>
              <Table.ColumnHeader>Month</Table.ColumnHeader>
              <Table.ColumnHeader>Day</Table.ColumnHeader>
              <Table.ColumnHeader>Value</Table.ColumnHeader>
              <Table.ColumnHeader>Avarage value of month</Table.ColumnHeader>
              <Table.ColumnHeader>Median value of month</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {year !== null && dataWithYears !== null && avgAndMedian !== null
              ? dataWithYears[year].map((item, index) => {
                  const isFirstRow = index === 0;

                  return (
                    <Table.Row key={index}>
                      <Table.Cell>{item.date_val.getFullYear()}</Table.Cell>
                      <Table.Cell>{item.date_val.getMonth() + 1}</Table.Cell>
                      <Table.Cell>{item.date_val.getDate()}</Table.Cell>
                      <Table.Cell>{item.dph_val}</Table.Cell>

                      {isFirstRow && (
                        <>
                          <Table.Cell
                            rowSpan={dataWithYears[year].length}
                            verticalAlign="top"
                          >
                            {avgAndMedian.avg}
                          </Table.Cell>

                          <Table.Cell
                            rowSpan={dataWithYears[year].length}
                            verticalAlign="top"
                          >
                            {avgAndMedian.median}
                          </Table.Cell>
                        </>
                      )}
                    </Table.Row>
                  );
                })
              : monthData &&
                avgAndMedian !== null &&
                monthData.map((item, index) => {
                  const isFirstRow = index === 0;

                  return (
                    <Table.Row key={index}>
                      <Table.Cell>{item.date_val.getFullYear()}</Table.Cell>
                      <Table.Cell>{item.date_val.getMonth() + 1}</Table.Cell>
                      <Table.Cell>{item.date_val.getDate()}</Table.Cell>
                      <Table.Cell>{item.dph_val}</Table.Cell>

                      {isFirstRow && (
                        <>
                          <Table.Cell
                            rowSpan={monthData.length}
                            verticalAlign="top"
                          >
                            {avgAndMedian.avg}
                          </Table.Cell>

                          <Table.Cell
                            rowSpan={monthData.length}
                            verticalAlign="top"
                          >
                            {avgAndMedian.median}
                          </Table.Cell>
                        </>
                      )}
                    </Table.Row>
                  );
                })}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
};
