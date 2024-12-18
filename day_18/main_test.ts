import { assertEquals } from "@std/assert";
import { parseInput, part1, part2 } from "./main.ts";

const input = await Deno.readTextFile("./input_test");
const testInput = parseInput(input);

Deno.test("part1", () => {
  assertEquals(part1(testInput, 7, 12), 22);
});

Deno.test("part2", () => {
  assertEquals(part2(testInput, 7, 12), "6,1");
});
