import { createClient } from "@/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { ChartComp } from "@/components/chartComp";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PersonSchema = z.object({
  name: z.string().nullable(),
  birth_date: z.date(),
  age: z.number(),
});

type Person = z.infer<typeof PersonSchema>;

const persons: Person[] = [
  {
    name: "Petr",
    age: 20,
    birth_date: new Date(2025, 12, 5),
  },
  {
    name: "David",
    age: 13,
    birth_date: new Date(2024, 13, 8),
  },
  {
    name: "Jan",
    age: 17,
    birth_date: new Date(2020, 13, 8),
  },
];

//vyresit Eslint
export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: todos } = await supabase.from("todos").select();

  return (
    <div>
      {<ChartComp text="ahoj" />}
      {persons.map(person => (
        <li key={person.name}>
          name: {person.name} / age: {person.age} / birth date:
          {person.birth_date.toISOString()}
        </li>
      ))}
    </div>
  );
}
