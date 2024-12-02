type InputType = number[][];

export function parseInput(input: string): InputType {
  return input.trim().split("\n").map((c) =>
    c.split("   ").map((e) => Number(e))
  );
}

// Part 1
export function part1(input: InputType): number {
  const left = input.map((row) => row[0]).toSorted((a, b) => a - b);
  const right = input.map((row) => row[1]).toSorted((a, b) => a - b);

  return left.map((e, i) => Math.abs(e - right[i])).reduce(
    (acc, curr) => acc + curr,
  );
}

// Part 2
export function part2(input: InputType): number {
  const left = input.map((row) => row[0]).toSorted((a, b) => a - b);
  const right = input.map((row) => row[1]).toSorted((a, b) => a - b);

  return left.map((l) => l * right.filter((r) => r === l).length).reduce((
    acc,
    curr,
  ) => acc + curr);
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
