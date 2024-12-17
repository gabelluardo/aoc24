import { assertEquals } from "@std/assert";
import { parseInput, part1, part2 } from "./main.ts";

const input = await Deno.readTextFile("./input_test");
const testInput = parseInput(input);

Deno.test("part1", () => {
  assertEquals(part1(testInput), 11048);
});

Deno.test("part1 small", () => {
  const input = "###############\n\
#.......#....E#\n\
#.#.###.#.###.#\n\
#.....#.#...#.#\n\
#.###.#####.#.#\n\
#.#.#.......#.#\n\
#.#.#####.###.#\n\
#...........#.#\n\
###.#.#####.#.#\n\
#...#.....#.#.#\n\
#.#.#.###.#.#.#\n\
#.....#...#.#.#\n\
#.###.#.#.#.#.#\n\
#S..#.....#...#\n\
###############";
  const testInput = parseInput(input);

  assertEquals(part1(testInput), 7036);
});

Deno.test("part2", () => {
  assertEquals(part2(testInput), 64);
});

Deno.test("part2 small", () => {
  const input = "###############\n\
#.......#....E#\n\
#.#.###.#.###.#\n\
#.....#.#...#.#\n\
#.###.#####.#.#\n\
#.#.#.......#.#\n\
#.#.#####.###.#\n\
#...........#.#\n\
###.#.#####.#.#\n\
#...#.....#.#.#\n\
#.#.#.###.#.#.#\n\
#.....#...#.#.#\n\
#.###.#.#.#.#.#\n\
#S..#.....#...#\n\
###############";
  const testInput = parseInput(input);

  assertEquals(part2(testInput), 45);
});
