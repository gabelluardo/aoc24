import { assertEquals } from "@std/assert";
import { parseInput, part1, part2 } from "./main.ts";

const input = await Deno.readTextFile("./input_test");
const testInput = parseInput(input);

Deno.test("part1 large", () => {
  assertEquals(part1(testInput), 10092);
});

Deno.test("part1 small", () => {
  const input = "########\n\
#..O.O.#\n\
##@.O..#\n\
#...O..#\n\
#.#.O..#\n\
#...O..#\n\
#......#\n\
########\n\
\n\
<^^>>>vv<v>>v<<";

  const testInput = parseInput(input);

  assertEquals(part1(testInput), 2028);
});

Deno.test("part2", () => {
  assertEquals(part2(testInput), 9021);
});

Deno.test("part2 small", () => {
  const input = "#######\n\
#...#.#\n\
#.....#\n\
#..OO@#\n\
#..O..#\n\
#.....#\n\
#######\n\
\n\
<vv<<^^<<^^";

  const testInput = parseInput(input);
  assertEquals(part2(testInput), (1 * 100 + 5) + (2 * 100 + 7) + (3 * 100 + 6));
});
