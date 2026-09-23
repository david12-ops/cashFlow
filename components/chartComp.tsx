"use client";

import { useMemo } from "react";
import { Card, CardBody, Flex, Text, Stack, Separator } from "@chakra-ui/react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DphData,
  IntervalData,
  InvoicesData,
  LoansData,
  Statistics,
  WagesData,
} from "@/zod-schemas";

type ChartProps = {
  usedData: {
    data: DphData | InvoicesData | LoansData | WagesData;
    type: "invoices" | "loans" | "wages" | "dph";
  };

  confidenceIntervals: IntervalData;
  statistics: Statistics;
};

type ChartData = {
  date: string;
  actual?: number;
  prediction?: number;
  lowerBound?: number;
  upperBound?: number;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: {
    name?: string;
    value?: number | string;
    dataKey?: string | number;
  }[];
  label?: string;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div>
      <p>Datum: {label}</p>

      {payload.map(item => (
        <p key={String(item.dataKey)}>
          {item.name}: {item.value?.toLocaleString("cs-CZ")} Kč
        </p>
      ))}
    </div>
  );
};

function getActualDataForChart(usedData: {
  data: DphData | InvoicesData | LoansData | WagesData;
  type: "invoices" | "loans" | "wages" | "dph";
}): ChartData[] | undefined {
  const { data, type } = usedData;

  switch (type) {
    case "dph": {
      const usedDphData = data as DphData;

      return Object.values(usedDphData)
        .flat()
        .sort((a, b) => a.date_val.getTime() - b.date_val.getTime())
        .map(item => ({
          date: item.date_val.toLocaleDateString("cs-CZ"),
          actual: item.dph_val,
        }));
    }
    case "invoices": {
      const usedInvoicesData = data as InvoicesData;

      return Object.values(usedInvoicesData)
        .flat()
        .sort((a, b) => a.DueDate.getTime() - b.DueDate.getTime())
        .map(item => ({
          date: item.DueDate.toLocaleDateString("cs-CZ"),
          actual: item.AmountCze,
        }));
    }
    case "loans": {
      const usedLoansData = data as LoansData;

      return Object.values(usedLoansData)
        .flat()
        .sort((a, b) => a.DueDate.getTime() - b.DueDate.getTime())
        .map(item => ({
          date: item.DueDate.toLocaleDateString("cs-CZ"),
          actual: item.Amount,
        }));
    }
    case "wages": {
      const usedWagesData = data as WagesData;
      const monthlyValues = new Map<string, number>();

      usedWagesData.forEach(item => {
        const key = `${item.transactionDate.getFullYear()}-${String(
          item.transactionDate.getMonth() + 1
        ).padStart(2, "0")}`;

        monthlyValues.set(key, (monthlyValues.get(key) ?? 0) + item.baseAmount);
      });

      return Array.from(monthlyValues.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, actual]) => ({
          date,
          actual,
        }));
    }
    default: {
      console.error("Unknown data type");
      return undefined;
    }
  }
}

export default function PredictionChart({
  usedData,
  confidenceIntervals,
  statistics,
}: ChartProps) {
  const chartData = useMemo<ChartData[] | undefined>(() => {
    /* * usedData.data: * * { * "2024": [...], * "2025": [...], * "2026": [...] * } * * Proto jednotlivé roky spojíme do jednoho pole. */
    const actualData = getActualDataForChart(usedData);

    /* * Confidence intervals už mají formát: * * { * date, * prediction, * lowerBound, * upperBound * } */
    const predictionData = confidenceIntervals.map(item => ({
      date: item.date,
      prediction: item.prediction,
      lowerBound: item.lowerBound,
      upperBound: item.upperBound,
    }));

    if (!actualData) {
      return undefined;
    } else return [...actualData, ...predictionData];
  }, [usedData, confidenceIntervals]);

  return (
    <Card.Root
      width="100%"
      height="500px"
      display="flex"
      flexDirection="column"
    >
      {" "}
      <CardBody
        px={0}
        py={0}
        flex="1"
        minHeight={0}
        minWidth={0}
        display="flex"
        flexDirection="column"
      >
        {" "}
        <Stack px={5} py={4} flex="0 0 auto" width="100%">
          {" "}
          <Flex justifyContent="space-between" alignItems="center" width="100%">
            {" "}
            <Text textStyle="xl" color="fg.normalContrast">
              {" "}
              Predikce DPH{" "}
            </Text>{" "}
            <Flex gap={5}>
              {" "}
              <Text fontSize="sm">
                {" "}
                MAE: {statistics.valueMAE.toFixed(2)}{" "}
              </Text>{" "}
              <Text fontSize="sm">
                {" "}
                RMSE: {statistics.valueRMSE.toFixed(2)}{" "}
              </Text>{" "}
              <Text fontSize="sm">
                {" "}
                MAPE:{" "}
                {statistics.valueMAPE !== null
                  ? `${statistics.valueMAPE.toFixed(2)} %`
                  : "-"}{" "}
              </Text>{" "}
              <Text fontSize="sm">
                {" "}
                MRE:{" "}
                {statistics.valueMRE !== null
                  ? `${statistics.valueMRE.toFixed(2)} %`
                  : "-"}{" "}
              </Text>{" "}
            </Flex>{" "}
          </Flex>{" "}
        </Stack>{" "}
        <Separator />{" "}
        <Stack
          px={5}
          py={6}
          flex="1"
          minHeight={0}
          minWidth={0}
          position="relative"
          width="100%"
        >
          {" "}
          <ResponsiveContainer width="100%" height="100%">
            {" "}
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 16, left: 16, bottom: 5 }}
            >
              {" "}
              <CartesianGrid stroke="var(--chakra-colors-border)" />{" "}
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickMargin={16}
                minTickGap={30}
                interval="preserveStartEnd"
              />{" "}
              <YAxis
                width={110}
                tickFormatter={value =>
                  `${value.toLocaleString("cs-CZ")} ${
                    usedData.type === "wages" || usedData.type === "dph"
                      ? "Kč"
                      : ""
                  }`
                }
                tick={{ fill: "var(--chakra-colors-fg-medium-contrast)" }}
                axisLine={false}
                tickLine={false}
                tickMargin={16}
                style={{ fontSize: "12px" }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "var(--chakra-colors-border)" }}
              />{" "}
              {/* skutečná data */}{" "}
              <Line
                type="linear"
                name="Skutečná DPH"
                dataKey="actual"
                stroke="var(--chakra-colors-green-solid)"
                strokeWidth={2}
                dot={false}
              />{" "}
              {/* predikce */}{" "}
              <Line
                type="linear"
                name="Predikce"
                dataKey="prediction"
                stroke="var(--chakra-colors-blue-solid)"
                strokeWidth={2}
                dot={false}
              />{" "}
              {/* dolní hranice intervalu */}{" "}
              <Line
                type="linear"
                name="Dolní mez"
                dataKey="lowerBound"
                stroke="var(--chakra-colors-border)"
                strokeDasharray="5 5"
                dot={false}
              />{" "}
              {/* horní hranice intervalu */}{" "}
              <Line
                type="linear"
                name="Horní mez"
                dataKey="upperBound"
                stroke="var(--chakra-colors-border)"
                strokeDasharray="5 5"
                dot={false}
              />{" "}
            </LineChart>{" "}
          </ResponsiveContainer>{" "}
        </Stack>{" "}
      </CardBody>{" "}
    </Card.Root>
  );
}

export const ChartComp = ({
  usedData,
  confidenceIntervals,
  statistics,
}: ChartProps) => {
  return usedData && (usedData.data !== null || usedData.data !== undefined) ? (
    <PredictionChart
      usedData={usedData}
      confidenceIntervals={confidenceIntervals}
      statistics={statistics}
    />
  ) : (
    <Text>Missing data for graph</Text>
  );
};
