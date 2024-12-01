const input = await Deno.readTextFile("./input");
const lines = input.trim().split("\n").map((c) => c.split("   "));

// Part 1
export function part1(input: string[][]): number {
  const left = input.map((row) => Number(row.at(0))).toSorted();
  const right = input.map((row) => Number(row.at(1))).toSorted();

  return left.map((e, i) => Math.abs(e - right[i])).reduce(
    (acc, curr) => acc + curr,
  );
}

// Part 2
export function part2(input: string[][]): number {
  const left = input.map((row) => Number(row.at(0))).toSorted();
  const right = input.map((row) => Number(row.at(1))).toSorted();

  return left.map((l) => l * right.filter((r) => r === l).length).reduce((
    acc,
    curr,
  ) => acc + curr);
}

if (import.meta.main) {
  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
