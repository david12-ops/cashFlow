import { InvoicesData } from "@/zod-schemas";

import { Box, Button, Table, Text } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

type InvoiceTableProps = {
  years: number[];
  data: InvoicesData;
  itemsPerPage: number;
  type: "all" | "training" | "test";
};

type PagesData = {
  pagesCount: number;
  pageData: { [page: number]: InvoicesData };
};

function dataByPage(data: InvoicesData, itemsPerPage: number): PagesData {
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
  const sortedValues = [...values.filter(itm => itm !== 0)].sort(
    (a, b) => a - b
  );

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

const InvoiceTableComp = ({
  years,
  data,
  itemsPerPage,
  type,
}: InvoiceTableProps) => {
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
  const [pagination, setPaginationState] = useState<boolean>(true);
  const [page, setPageState] = useState<number>(1);

  const dataOfTheYear = data.filter(
    item => item.dueDate.getFullYear() === year
  );

  const handleButtonClick = () => {
    setPaginationState(!pagination);
    tableRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const avgAndMedian = getMedianAndAvg(
    dataOfTheYear.map(item => (item.paymentDelay ? item.paymentDelay : 0))
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
              <Table.ColumnHeader>Due date</Table.ColumnHeader>
              <Table.ColumnHeader>Amount</Table.ColumnHeader>
              <Table.ColumnHeader>AmountPaid</Table.ColumnHeader>
              <Table.ColumnHeader>Payment delay</Table.ColumnHeader>

              <Table.ColumnHeader>
                Avarage payment delay of month
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                Median payment delay of month
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {!pagination
              ? dataOfTheYear.map((item, index) => {
                  const isFirstRow = index === 0;

                  return (
                    <Table.Row key={index}>
                      <Table.Cell>
                        {item.dueDate.toLocaleDateString("cs-CZ")}
                      </Table.Cell>
                      <Table.Cell>{item.amountCze} Kč</Table.Cell>
                      <Table.Cell>{item.amountPaidCze} Kč</Table.Cell>
                      <Table.Cell>
                        {item.paymentDelay
                          ? `${item.paymentDelay} day/s`
                          : "Without delay"}
                      </Table.Cell>

                      {isFirstRow && (
                        <>
                          <Table.Cell
                            rowSpan={dataOfTheYear.length}
                            verticalAlign="top"
                          >
                            {avgAndMedian.avg} day/s
                          </Table.Cell>

                          <Table.Cell
                            rowSpan={dataOfTheYear.length}
                            verticalAlign="top"
                          >
                            {avgAndMedian.median} day/s
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
                      <Table.Cell>
                        {item.dueDate.toLocaleDateString("cs-CZ")}
                      </Table.Cell>
                      <Table.Cell>{item.amountCze} Kč</Table.Cell>
                      <Table.Cell>{item.amountPaidCze} Kč</Table.Cell>
                      <Table.Cell>
                        {item.paymentDelay
                          ? `${item.paymentDelay} day/s`
                          : "Without delay"}
                      </Table.Cell>

                      {isFirstRow && (
                        <>
                          <Table.Cell
                            rowSpan={dataOfTheYear.length}
                            verticalAlign="top"
                          >
                            {avgAndMedian.avg} day/s
                          </Table.Cell>

                          <Table.Cell
                            rowSpan={dataOfTheYear.length}
                            verticalAlign="top"
                          >
                            {avgAndMedian.median} day/s
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
          <Button onClick={handleButtonClick}>
            {pagination ? "Show all" : "Show pages"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default InvoiceTableComp;
