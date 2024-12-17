import { assertEquals } from "@std/assert";
import { parseInput, part1, part2 } from "./main.ts";

const input = await Deno.readTextFile("./input_test");
const testInput = parseInput(input);

Deno.test("part1", () => {
  assertEquals(part1(testInput), "4,6,3,5,6,3,5,2,1,0");
});

Deno.test("part1 ex1", () => {
  const registers = { a: 0, b: 0, c: 9 };
  const program = "2,6".split(",").map(Number);

  part1({ registers, program });

  assertEquals(registers.b, 1);
});

Deno.test("part1 ex2", () => {
  const registers = { a: 10, b: 0, c: 0 };
  const program = "5,0,5,1,5,4".split(",").map(Number);

  assertEquals(part1({ registers, program }), "0,1,2");
});

Deno.test("part1 ex3", () => {
  const registers = { a: 2024, b: 0, c: 0 };
  const program = "0,1,5,4,3,0".split(",").map(Number);

  assertEquals(part1({ registers, program }), "4,2,5,6,7,7,7,7,3,1,0");
  assertEquals(registers.a, 0);
});

Deno.test("part1 ex4", () => {
  const registers = { a: 0, b: 29, c: 0 };
  const program = "1,7".split(",").map(Number);

  part1({ registers, program });

  assertEquals(registers.b, 26);
});

Deno.test("part1 ex5", () => {
  const registers = { a: 0, b: 2024, c: 43690 };
  const program = "4,0".split(",").map(Number);

  part1({ registers, program });

  assertEquals(registers.b, 44354);
});

Deno.test("part2", () => {
  const registers = { a: 2024, b: 0, c: 0 };
  const program = "0,3,5,4,3,0".split(",").map(Number);

  assertEquals(part2({ registers, program }), 117440);
});
