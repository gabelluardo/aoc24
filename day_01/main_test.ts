import { assertEquals } from "@std/assert";
import { part1, part2 } from "./main.ts";

const testInput = [
  "test line 1",
  "test line 2",
];

Deno.test("part1", () => {
  assertEquals(part1(testInput), 11);
});

Deno.test("part2", () => {
  assertEquals(part2(testInput), 0);
});
