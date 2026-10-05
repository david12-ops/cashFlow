import {
  AlgorithmsParams,
  IntervalData,
  LoansData,
  PredictionsData,
  Statistics,
} from "@/zod-schemas";
import { Text, Box, Button, Heading } from "@chakra-ui/react";
import { useState } from "react";
import ChartComp from "./chartComp";

type GraphsPredictionCompProps = {
  usedDataForGraph: LoansData;
  testDataForGraph: LoansData;
  predictionsData: PredictionsData;
  algorithmsParams: AlgorithmsParams;
};

type PredictionsDataMap = {
  [model: string]: {
    countOfFutureMonthsToPredict: number;
    confidenceIntervals: IntervalData;
    statistics: Statistics;
  };
};

function createOtherPredictionsDataMap(
  predictionsData: PredictionsData
): PredictionsDataMap {
  const data: PredictionsDataMap = {};

  Object.entries(predictionsData).forEach(([key, value]) => {
    if (value !== null) {
      data[key as keyof PredictionsDataMap] = value;
    }
  });

  return data;
}

const PredictionLoanMethodsComponents = ({
  usedDataForGraph,
  testDataForGraph,
  predictionsData,
  algorithmsParams,
}: GraphsPredictionCompProps) => {
  const mapedData = createOtherPredictionsDataMap(predictionsData);

  const predictionDataModels = Object.keys(mapedData);

  const [predictionDataModel, setPredictionDataModelState] = useState<string>(
    predictionDataModels[0]
  );

  const algorithmParamsModels = ["ses", "holt-winter", "holt"];

  const [algorithmParamsModel, setAlgorithmParamsModelState] = useState<string>(
    algorithmParamsModels[0]
  );

  const selectedPredictionData = mapedData[predictionDataModel];
  const selectedAlgorithmParams = algorithmsParams.find(
    item => item.model === algorithmParamsModel
  );

  return (
    <Box>
      <Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          p={5}
          flexWrap="wrap"
        >
          {algorithmParamsModels.map(modelItem => (
            <Button
              key={modelItem}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              bg={algorithmParamsModel === modelItem ? "blue.500" : "gray.200"}
              color={algorithmParamsModel === modelItem ? "white" : "gray.700"}
              onClick={() => setAlgorithmParamsModelState(modelItem)}
              cursor="pointer"
            >
              {modelItem}
            </Button>
          ))}
        </Box>
        {selectedAlgorithmParams && (
          <Box>
            <Heading as="h3" size="lg" mb={8} textAlign="center">
              <Text>
                Prediciton best parameters model: {algorithmParamsModel}
              </Text>
            </Heading>

            <Box>
              {selectedAlgorithmParams.model === "ses" && (
                <Box>
                  <Text textAlign={"center"} fontWeight="bold">
                    Alpha
                  </Text>
                  <Text textAlign={"center"}>
                    {selectedAlgorithmParams.alpha}
                  </Text>
                </Box>
              )}

              {selectedAlgorithmParams.model === "holt" && (
                <Box>
                  <Text textAlign={"center"} fontWeight="bold">
                    Alpha
                  </Text>
                  <Text textAlign={"center"}>
                    {selectedAlgorithmParams.params.alpha}
                  </Text>
                  <Text textAlign={"center"} fontWeight="bold">
                    Beta
                  </Text>
                  <Text textAlign={"center"}>
                    {selectedAlgorithmParams.params.beta}
                  </Text>
                </Box>
              )}

              {selectedAlgorithmParams.model === "holt-winter" && (
                <Box>
                  <Text textAlign={"center"} fontWeight="bold">
                    Alpha
                  </Text>
                  <Text textAlign={"center"}>
                    {selectedAlgorithmParams.params.alpha}
                  </Text>
                  <Text textAlign={"center"} fontWeight="bold">
                    Beta
                  </Text>
                  <Text textAlign={"center"}>
                    {selectedAlgorithmParams.params.beta}
                  </Text>
                  <Text textAlign={"center"} fontWeight="bold">
                    Gama
                  </Text>
                  <Text textAlign={"center"}>
                    {selectedAlgorithmParams.params.gama}
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
      <Box>
        {predictionDataModels && (
          <Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              p={5}
              flexWrap="wrap"
            >
              {predictionDataModels.map(modelItem => (
                <Button
                  key={modelItem}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  bg={
                    predictionDataModel === modelItem ? "blue.500" : "gray.200"
                  }
                  color={
                    predictionDataModel === modelItem ? "white" : "gray.700"
                  }
                  onClick={() => setPredictionDataModelState(modelItem)}
                  cursor="pointer"
                >
                  {modelItem}
                </Button>
              ))}
            </Box>
            {selectedPredictionData && (
              <Box display="flex" flexDirection="column" gap={8}>
                <Box>
                  <Heading as="h3" size="lg" mb={8} textAlign="center">
                    <Text>Prediciton model: {predictionDataModel}</Text>
                  </Heading>
                  <Text mb={8} textAlign="center">
                    Count of future month to predict:{" "}
                    {selectedPredictionData.countOfFutureMonthsToPredict}
                  </Text>
                </Box>
                <Box>
                  <Heading as="h4" size="lg" mb={8} textAlign="center">
                    <Text>Line graph</Text>
                  </Heading>
                  <ChartComp
                    usedData={{
                      type: "loan",
                      data: usedDataForGraph,
                    }}
                    confidenceIntervals={
                      selectedPredictionData.confidenceIntervals
                    }
                    statistics={selectedPredictionData.statistics}
                  />
                </Box>
                <Box>
                  <Heading as="h4" size="lg" mb={8} textAlign="center">
                    <Text>Bar graph</Text>
                  </Heading>
                  <ChartComp
                    testData={{ data: testDataForGraph, type: "loan" }}
                    confidenceIntervals={
                      selectedPredictionData.confidenceIntervals
                    }
                  />
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PredictionLoanMethodsComponents;
