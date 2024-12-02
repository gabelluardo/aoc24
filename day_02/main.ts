import { equal } from "@std/assert/equal";

type InputType = number[][];

export function parseInput(input: string): InputType {
  return input.trim().split("\n").map((c) =>
    c.split(" ").map((c) => Number(c))
  );
}

function isMonotone(v: number[]): boolean {
  const sorted = v.toSorted((a, b) => a - b);
  return equal(v, sorted) || equal(v, sorted.toReversed());
}

function checkAdjacent(v: number[], min = 1, max = 3): boolean {
  for (let i = 1; i < v.length; i++) {
    const diff = Math.abs(v[i] - v[i - 1]);
    if (diff < min || diff > max) {
      return false;
    }
  }
  return true;
}

function isSalvable(v: number[]): boolean {
  return v.some((_, i) => {
    const spliced = v.toSpliced(i, 1);
    return isMonotone(spliced) && checkAdjacent(spliced);
  });
}

// Part 1
export function part1(input: InputType): number {
  return input.filter((r) => isMonotone(r) && checkAdjacent(r)).length;
}

// Part 2
export function part2(input: InputType): number {
  return input.filter((r) =>
    (isMonotone(r) && checkAdjacent(r)) || isSalvable(r)
  ).length;
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
