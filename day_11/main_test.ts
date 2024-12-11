import { assertEquals } from "@std/assert";
import { parseInput, part1 } from "./main.ts";

const input = await Deno.readTextFile("./input_test");
const testInput = parseInput(input);

Deno.test("part1", () => {
  assertEquals(part1(testInput, 6), 22);
  assertEquals(part1(testInput), 55312);
});
