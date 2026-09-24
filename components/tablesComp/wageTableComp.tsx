import { WagesData } from "@/zod-schemas";

import { Box, Button, Table, Text } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type WageTableProps = {
  years: number[];
  data: WagesData;
  itemsPerPage: number;
  type: "all" | "training" | "test";
};

type PagesData = {
  pagesCount: number;
  pageData: { [page: number]: WagesData };
};

function dataByPage(data: WagesData, itemsPerPage: number): PagesData {
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

const WageTableComp = ({ years, data, itemsPerPage, type }: WageTableProps) => {
  let yearsData: number[] = [];

  if (type === "all") {
    yearsData = years;
  }

  if (type === "training") {
    yearsData = years.slice(0, -1);
  }

  if (type === "test") {
    yearsData = years.slice(-1);
  }

  const tableRef = useRef<HTMLDivElement>(null);
  const [year, setYearState] = useState<number>(yearsData[0]);
  const [pagination, setPaginationState] = useState<boolean>();
  const [page, setPageState] = useState<number>(1);

  useEffect(() => {
    tableRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [pagination]);

  const dataOfTheYear = data.filter(
    item => item.transactionDate.getFullYear() === year
  );

  const avgAndMedian = getMedianAndAvg(
    dataOfTheYear.map(item => item.baseAmount)
  );
  const { pagesCount, pageData } = dataByPage(dataOfTheYear, itemsPerPage);

  return (
    <Box>
      {yearsData.length > 0 && (
        <Box
          display="flex"
          flexDirection={"row"}
          justifyContent={"space-between"}
          p={5}
          flexWrap={"wrap"}
        >
          {yearsData.map(yearItem => (
            <Button
              key={yearItem}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              bg={year === yearItem ? "blue.500" : "gray.200"}
              color={year === yearItem ? "white" : "gray.700"}
              onClick={() => setYearState(yearItem)}
              cursor="pointer"
            >
              {yearItem}
            </Button>
          ))}
        </Box>
      )}
      <Box display="flex" flexDirection="column" gap={16} ref={tableRef}>
        <Table.Root variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>DimDateId</Table.ColumnHeader>
              <Table.ColumnHeader>Transaction date</Table.ColumnHeader>
              <Table.ColumnHeader>Base amount</Table.ColumnHeader>
              <Table.ColumnHeader>Account</Table.ColumnHeader>
              <Table.ColumnHeader>Division</Table.ColumnHeader>
              <Table.ColumnHeader>Currency</Table.ColumnHeader>
              <Table.ColumnHeader>Avarage value of month</Table.ColumnHeader>
              <Table.ColumnHeader>Median value of month</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {!pagination
              ? dataOfTheYear.map((item, index) => {
                  const isFirstRow = index === 0;

                  return (
                    <Table.Row key={index}>
                      <Table.Cell>{item.dimDateId}</Table.Cell>
                      <Table.Cell>
                        {item.transactionDate.toLocaleDateString("cs-CZ")}
                      </Table.Cell>
                      <Table.Cell>{item.baseAmount}</Table.Cell>
                      <Table.Cell>{item.account}</Table.Cell>
                      <Table.Cell>{item.division}</Table.Cell>
                      <Table.Cell>{item.currency}</Table.Cell>

                      {isFirstRow && (
                        <>
                          <Table.Cell
                            rowSpan={dataOfTheYear.length}
                            verticalAlign="top"
                          >
                            {avgAndMedian.avg}
                          </Table.Cell>

                          <Table.Cell
                            rowSpan={dataOfTheYear.length}
                            verticalAlign="top"
                          >
                            {avgAndMedian.median}
                          </Table.Cell>
                        </>
                      )}
                    </Table.Row>
                  );
                })
              : pageData[page].map((item, index) => {
                  const isFirstRow = index === 0;

                  return (
                    <Table.Row key={index}>
                      <Table.Cell>{item.dimDateId}</Table.Cell>
                      <Table.Cell>
                        {item.transactionDate.toLocaleDateString("cs-CZ")}
                      </Table.Cell>
                      <Table.Cell>{item.baseAmount}</Table.Cell>
                      <Table.Cell>{item.account}</Table.Cell>
                      <Table.Cell>{item.division}</Table.Cell>
                      <Table.Cell>{item.currency}</Table.Cell>

                      {isFirstRow && (
                        <>
                          <Table.Cell
                            rowSpan={dataOfTheYear.length}
                            verticalAlign="top"
                          >
                            {avgAndMedian.avg}
                          </Table.Cell>

                          <Table.Cell
                            rowSpan={dataOfTheYear.length}
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
        <Box
          display="flex"
          flexDirection={"row"}
          justifyContent={"space-between"}
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
      </Box>
    </Box>
  );
};

export default WageTableComp;
