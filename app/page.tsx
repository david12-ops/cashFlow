import { createClient } from "@/supabase/server";
import { Box, Heading, Text, List, Link, HStack } from "@chakra-ui/react";
import { cookies } from "next/headers";
import { Receipt, Banknote, Landmark, FileText, ChartLine } from "lucide-react";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: todos } = await supabase.from("todos").select();

  return (
    <Box
      margin={25}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minH="calc(60vh - 50px)"
    >
      <Box>
        <Heading as="h1" size="lg" mb={3}>
          Vítejte v aplikaci pro predikci finančních toků
        </Heading>

        <Text>
          Tato aplikace slouží k analýze historických finančních dat a predikci
          jejich budoucího vývoje. Pomocí vybraných predikčních metod lze
          pracovat s jednotlivými oblastmi finančních toků, například s DPH,
          mzdami, úvěry nebo fakturami. Pro zahájení analýzy vyberte jednu z
          dostupných oblastí.
        </Text>
      </Box>

      <Box>
        <Heading as="h2" size="lg" mb={3}>
          Oblasti peněžních toků
        </Heading>

        <List.Root listStyle="none">
          <List.Item>
            <Link href="/dph">
              <HStack gap={2}>
                <Receipt /> DPH
              </HStack>
            </Link>
          </List.Item>

          <List.Item>
            <Link href="/wages">
              <HStack gap={2}>
                <Banknote /> Mzdy
              </HStack>
            </Link>
          </List.Item>

          <List.Item>
            <Link href="/loans">
              <HStack gap={2}>
                {" "}
                <Landmark /> Úvěry
              </HStack>
            </Link>
          </List.Item>

          <List.Item>
            <Link href="/invoices">
              <HStack gap={2}>
                <FileText /> Faktury – zatím ve vývoji
              </HStack>
            </Link>
          </List.Item>

          <List.Item>
            <HStack gap={2}>
              <ChartLine /> Provozní cash flow – zatím nedostupné
            </HStack>
          </List.Item>
        </List.Root>
      </Box>
    </Box>
  );
}
