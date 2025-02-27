import { assertEquals } from "@std/assert";
import { parseInput, part1 } from "./main.ts";

const input = await Deno.readTextFile("./input_test");
const testInput = parseInput(input);

Deno.test("part1", () => {
  assertEquals(part1(testInput), 2024);
});

Deno.test("es part1", () => {
  const input = "x00: 1\n\
x01: 1\n\
x02: 1\n\
y00: 0\n\
y01: 1\n\
y02: 0\n\
\n\
x00 AND y00 -> z00\n\
x01 XOR y01 -> z01\n\
x02 OR y02 -> z02";

  const testInput = parseInput(input);

  assertEquals(part1(testInput), 4);
});
