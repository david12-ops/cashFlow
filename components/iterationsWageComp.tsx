"use client";

import { IterationsKmeansData } from "@/zod-schemas";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
import { GridWagesDataComponent } from "./gridsComp";

type IterationsWageComponentProps = {
  data: IterationsKmeansData;
};

const IterationsWageComponent = ({ data }: IterationsWageComponentProps) => {
  const [iteration, setIterationState] = useState<number>(1);

  const iterations = Array.from({ length: data.length }, (_, i) => i);

  const keys = Object.keys(data[iteration].clusteredData).map(Number);

  const [key, setKeyState] = useState<number>(keys[0]);

  return (
    <Box>
      <Heading as="h2" size="lg" mb={8} textAlign="center">
        Data and iterations of K-means
      </Heading>
      <Box display="flex" flexDirection="column" gap={8}>
        <Box>
          {iterations.length > 0 && (
            <Box display="flex" flexDirection={"row"} gap={5} flexWrap={"wrap"}>
              {iterations.map(iterationItem => (
                <Button
                  key={iterationItem}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  bg={iteration === iterationItem ? "blue.500" : "gray.200"}
                  color={iteration === iterationItem ? "white" : "gray.700"}
                  onClick={() => setIterationState(iterationItem)}
                  cursor="pointer"
                >
                  {iterationItem}
                </Button>
              ))}
            </Box>
          )}
        </Box>
        <Box display="flex" flexDirection={"column"} gap={8}>
          <Heading as="h2" size="lg" textAlign="center">
            Centroids
          </Heading>
          <Box>
            <Heading as="h3" size="lg" textAlign="center" mb={4}>
              Old centroids
            </Heading>
            <Box>
              {data[iteration].oldCentroids.map((value, index) => (
                <Text key={index} textAlign="center">
                  {index + 1} centroid: {value}
                </Text>
              ))}
            </Box>
          </Box>
          <Box>
            <Heading as="h3" size="lg" textAlign="center" mb={4}>
              New centroids
            </Heading>
            <Box>
              {data[iteration].newCentroids.map((value, index) => (
                <Text key={index} textAlign="center">
                  {index + 1} centroid: {value}
                </Text>
              ))}
            </Box>
          </Box>
        </Box>
        <Box>
          {keys && (
            <Box
              display="flex"
              flexDirection={"row"}
              justifyContent={"space-between"}
              p={5}
              flexWrap={"wrap"}
            >
              {keys.map(keyItem => (
                <Button
                  key={keyItem}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  bg={key === keyItem ? "blue.500" : "gray.200"}
                  color={key === keyItem ? "white" : "gray.700"}
                  onClick={() => setKeyState(keyItem)}
                  cursor="pointer"
                >
                  {keyItem}
                </Button>
              ))}
            </Box>
          )}
        </Box>
        <Box>
          <GridWagesDataComponent
            wageData={data[iteration].clusteredData[key]}
            itemsPerPage={6}
          />
        </Box>
        <Box>
          {data[iteration].values.map((item, index) => (
            <Box key={index}>sss</Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default IterationsWageComponent;
