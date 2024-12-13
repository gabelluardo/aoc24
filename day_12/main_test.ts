import { assertEquals } from "@std/assert";
import { parseInput, part1, part2 } from "./main.ts";

const input = await Deno.readTextFile("./input_test");
const testInput = parseInput(input);

Deno.test("part1", () => {
  assertEquals(part1(testInput), 1930);
});

Deno.test("part1 ex2", () => {
  const input = "AAAA\n\
BBCD\n\
BBCC\n\
EEEC";

  const testInput = parseInput(input);
  assertEquals(part1(testInput), 140);
});

Deno.test("part1 ex3", () => {
  const input = "OOOOO\n\
OXOXO\n\
OOOOO\n\
OXOXO\n\
OOOOO";

  const testInput = parseInput(input);
  assertEquals(part1(testInput), 772);
});

Deno.test("part2", () => {
  assertEquals(part2(testInput), 1206);
});

Deno.test("part2 ex2", () => {
  const input = "EEEEE\n\
EXXXX\n\
EEEEE\n\
EXXXX\n\
EEEEE";

  const testInput = parseInput(input);
  assertEquals(part2(testInput), 236);
});

Deno.test("part2 ex3", () => {
  const input = "AAAAAA\n\
AAABBA\n\
AAABBA\n\
ABBAAA\n\
ABBAAA\n\
AAAAAA";

  const testInput = parseInput(input);
  assertEquals(part2(testInput), 368);
});

Deno.test("part2 ex4", () => {
  const input = "AAAA\n\
BBCD\n\
BBCC\n\
EEEC";

  const testInput = parseInput(input);
  assertEquals(part2(testInput), 80);
});

Deno.test("part2 y", () => {
  const input = "\n\
XYYYYYY\n\
YXYYYYX\n\
YYYYYYX\n\
XXYYYYX\n\
XYYYYYX\n\
XXYYYXX\n\
XXYYYXX\n\
XXYXXXX\n\
XXYXXXX";

  const testInput = parseInput(input);
  assertEquals(part2(testInput), 16 * 8 + 34 * 22 + 11 * 8 + 4 + 4);
});

Deno.test("part2 e", () => {
  const input = "\n\
XEXXEXEEXX\n\
XEEEEEXEEX\n\
XXEEEEEEEE\n\
XXEEEEEEEE\n\
EEEEEEEEEE\n\
XXEEEEEEEX\n\
XXEEEEXXXX\n\
XXXXEEXXXX";

  const testInput = parseInput(input);
  assertEquals(
    part2(testInput),
    50 * 32 + 6 * 6 + 2 * 4 + 4 + 3 * 6 + 4 + 8 * 6 + 9 * 6,
  );
});

Deno.test("part2 c", () => {
  const input = "\n\
XXXCXXXXXX\n\
XXCCCXXCCX\n\
XXCCCCCCCC\n\
XCCCCCCCCC\n\
CCCCCCCXXC\n\
CCCCCCCCCX\n\
CXCCCCCXXX\n\
XXCCCXXXXX\n\
XXXCCXXXXX";

  const testInput = parseInput(input);
  assertEquals(
    part2(testInput),
    51 * 34 + 8 * 8 + 9 * 10 + 2 * 4 + 14 * 8 + 6 * 8,
  );
});

Deno.test("part2 other", () => {
  const input = "\n\
XOOOO\n\
OXOXO\n\
OOOOO\n\
OXOXO\n\
OOOOO";

  const testInput = parseInput(input);
  assertEquals(part2(testInput), 20 * 22 + 4 + 4 + 4 + 4 + 4);
});
