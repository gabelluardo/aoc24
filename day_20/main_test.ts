import { assertEquals } from "@std/assert";
import { findCheat, findCheat2, findPath, parseInput } from "./main.ts";

const input = await Deno.readTextFile("./input_test");
const testInput = parseInput(input);

Deno.test("part1", () => {
  const path = findPath(testInput);
  const times = findCheat(testInput, path);

  const expected = new Map([
    [2, 14],
    [4, 14],
    [6, 2],
    [8, 4],
    [10, 2],
    [12, 3],
    [20, 1],
    [36, 1],
    [38, 1],
    [40, 1],
    [64, 1],
  ]);

  assertEquals(times, expected);
});

Deno.test("part2", () => {
  const path = findPath(testInput);
  const times = findCheat2(path);
  const result = new Map(times.entries().filter(([k, _]) => k >= 50));

  const expected = new Map([
    [50, 32],
    [52, 31],
    [54, 29],
    [56, 39],
    [58, 25],
    [60, 23],
    [62, 20],
    [64, 19],
    [66, 12],
    [68, 14],
    [70, 12],
    [72, 22],
    [74, 4],
    [76, 3],
  ]);

  assertEquals(result, expected);
});
