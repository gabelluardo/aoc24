import { assertEquals } from "@std/assert";
import { part1, part2 } from "./main.ts";

Deno.test("part1", () => {
  const testInput =
    "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";

  assertEquals(part1(testInput), 161);
});

Deno.test("part2", () => {
  const testInput =
    "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))";

  assertEquals(part2(testInput), 48);
});
