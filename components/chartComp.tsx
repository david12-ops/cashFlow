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
    type: "invoice" | "loan" | "wage" | "dph";
  };

  confidenceIntervals: IntervalData;
  statistics: Statistics;
};

type ChartData = {
  date: string;
  type: "dph" | "invoice" | "loan" | "wage";
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
    payload?: {
      date?: string;
      actual?: number;
      type?: "dph" | "invoice" | "loan" | "wage";
    };
  }[];
  label?: string;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div>
      <p>Date: {label}</p>

      {payload.map(item => {
        console.log("plaYLOAD " + JSON.stringify(payload));
        const type = item.payload?.type;

        const unit =
          type === "dph" || type === "wage"
            ? " Kč"
            : type === "invoice" || type === "loan"
              ? " Days"
              : "";

        return (
          <p key={String(item.dataKey)}>
            {item.name}: {item.value?.toLocaleString("cs-CZ")} {unit}
          </p>
        );
      })}
    </div>
  );
};

function getActualDataForChart(usedData: {
  data: DphData | InvoicesData | LoansData | WagesData;
  type: "invoice" | "loan" | "wage" | "dph";
}): ChartData[] | undefined {
  const { data, type } = usedData;

  switch (type) {
    case "dph": {
      const usedDphData = data as DphData;

      return Object.values(usedDphData)
        .flat()
        .sort((a, b) => a.date_val.getTime() - b.date_val.getTime())
        .map(item => ({
          date: `${item.date_val.getFullYear()}-${String(
            item.date_val.getMonth() + 1
          ).padStart(
            2,
            "0"
          )}-${String(item.date_val.getDate()).padStart(2, "0")}`,
          actual: item.dph_val,
          type: "dph",
        }));
    }
    case "invoice": {
      const usedInvoicesData = data as InvoicesData;

      return Object.values(usedInvoicesData)
        .flat()
        .sort((a, b) => a.DueDate.getTime() - b.DueDate.getTime())
        .map(item => ({
          date: `${item.DueDate.getFullYear()}-${String(
            item.DueDate.getMonth() + 1
          ).padStart(2, "0")}`,
          actual: item.PaymentDelay ? item.PaymentDelay : 0,
          type: "invoice",
        }));
    }
    case "loan": {
      const usedLoansData = data as LoansData;

      return Object.values(usedLoansData)
        .flat()
        .sort((a, b) => a.DueDate.getTime() - b.DueDate.getTime())
        .map(item => ({
          date: `${item.DueDate.getFullYear()}-${String(
            item.DueDate.getMonth() + 1
          ).padStart(2, "0")}`,
          actual: item.Delay ? item.Delay : 0,
          type: "loan",
        }));
    }
    case "wage": {
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
          type: "wage",
        }));
    }
    default: {
      console.error("Unknown data type");
      return undefined;
    }
  }
}

function PredictionChart({
  usedData,
  confidenceIntervals,
  statistics,
}: ChartProps) {
  const labels = { nameLabel: "", actualDataLabel: "stringa" };

  if (usedData.type === "dph") {
    labels.nameLabel = "Prediction DPH";
    labels.actualDataLabel = "Actual DPH";
  }

  if (usedData.type === "invoice") {
    labels.nameLabel = "Payment delay invoice prediciton";
    labels.actualDataLabel = "Delay";
  }

  if (usedData.type === "loan") {
    labels.nameLabel = "Payment delay loans prediciton";
    labels.actualDataLabel = "Delay";
  }

  if (usedData.type === "wage") {
    labels.nameLabel = "Wage prediciton";
    labels.actualDataLabel = "Base amount";
  }

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
    }

    return [
      ...actualData.map(item => ({
        ...item,
        type: usedData.type,
      })),
      ...predictionData.map(item => ({
        ...item,
        type: usedData.type,
      })),
    ];
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
              {labels.nameLabel}
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
                  `${value.toLocaleString("cs-CZ")} ${usedData.type === "dph" || usedData.type === "wage" ? "Kč" : ""}`
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
              {/* Actual data */}{" "}
              <Line
                type="linear"
                name={labels.actualDataLabel}
                dataKey={"actual"}
                stroke="var(--chakra-colors-green-solid)"
                strokeWidth={2}
                dot={false}
              />{" "}
              {/* Prediction */}{" "}
              <Line
                type="linear"
                name="Prediction"
                dataKey="prediction"
                stroke="var(--chakra-colors-blue-solid)"
                strokeWidth={2}
                dot={false}
              />{" "}
              {/* Lower bound of the interval */}{" "}
              <Line
                type="linear"
                name="Lower bound"
                dataKey="lowerBound"
                stroke="var(--chakra-colors-border)"
                strokeDasharray="5 5"
                dot={false}
              />{" "}
              {/* Upper bound of the interval */}{" "}
              <Line
                type="linear"
                name="Upper bound"
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

const ChartComp = ({
  usedData,
  confidenceIntervals,
  statistics,
}: ChartProps) => {
  return (
    <PredictionChart
      usedData={usedData}
      confidenceIntervals={confidenceIntervals}
      statistics={statistics}
    />
  );
};

export default ChartComp;
