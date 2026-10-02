import { createClient } from "@/supabase/server";
import { Box, Heading, Text, Link } from "@chakra-ui/react";
import { cookies } from "next/headers";
import { Receipt, Banknote, Landmark, FileText, ChartLine } from "lucide-react";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: todos } = await supabase.from("todos").select();

  return (
    <Box maxW="1200px" mx="auto" px={6} py={12}>
      <Box>
        <Heading as="h1" size="xl" mb={4}>
          Cash Flow Prediction
        </Heading>

        <Text color="gray.600" maxW="800px" fontSize="lg">
          Analyze historical financial data and predict its future trends.
          Choose a financial area to start the analysis.
        </Text>
      </Box>

      <Heading as="h2" size="lg" mb={6} mt={6}>
        Financial areas
      </Heading>

      <Box
        display="grid"
        gridTemplateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={5}
      >
        <Link href="/vat" _hover={{ textDecoration: "none" }}>
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            height="100%"
            transition="all 0.2s"
            _hover={{
              transform: "translateY(-3px)",
              shadow: "md",
              borderColor: "blue.400",
            }}
          >
            <Receipt size={32} />

            <Heading as="h3" size="md" mt={5} mb={2}>
              VAT
            </Heading>

            <Text color="gray.600">Analyze and predict VAT cash flows.</Text>
          </Box>
        </Link>

        <Link href="/wages" _hover={{ textDecoration: "none" }}>
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            height="100%"
            transition="all 0.2s"
            _hover={{
              transform: "translateY(-3px)",
              shadow: "md",
              borderColor: "blue.400",
            }}
          >
            <Banknote size={32} />

            <Heading as="h3" size="md" mt={5} mb={2}>
              Wages
            </Heading>

            <Text color="gray.600">Analyze and predict wage payments.</Text>
          </Box>
        </Link>

        <Link href="/loans" _hover={{ textDecoration: "none" }}>
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            height="100%"
            transition="all 0.2s"
            _hover={{
              transform: "translateY(-3px)",
              shadow: "md",
              borderColor: "blue.400",
            }}
          >
            <Landmark size={32} />

            <Heading as="h3" size="md" mt={5} mb={2}>
              Loans
            </Heading>

            <Text color="gray.600">Analyze loan payment delays.</Text>
          </Box>
        </Link>

        <Link href="/invoices" _hover={{ textDecoration: "none" }}>
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            height="100%"
            transition="all 0.2s"
            _hover={{
              transform: "translateY(-3px)",
              shadow: "md",
              borderColor: "blue.400",
            }}
          >
            <FileText size={32} />

            <Heading as="h3" size="md" mt={5} mb={2}>
              Invoices
            </Heading>

            <Text color="gray.600">Analyze invoice payment delays.</Text>

            <Text mt={3} fontSize="sm" color="orange.500">
              In development
            </Text>
          </Box>
        </Link>

        <Box
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          height="100%"
          opacity={0.6}
        >
          <ChartLine size={32} />

          <Heading as="h3" size="md" mt={5} mb={2}>
            Operating cash flow
          </Heading>

          <Text color="gray.600">
            Prediction of overall operating cash flow.
          </Text>

          <Text mt={3} fontSize="sm" color="gray.500">
            Currently unavailable
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
