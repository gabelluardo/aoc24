export function parseInput(input: string): string[] {
  return [""];
}

// Part 1
export function part1(input: string[]): number {
  return 0;
}

// Part 2
export function part2(input: string[]): number {
  return 0;
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
