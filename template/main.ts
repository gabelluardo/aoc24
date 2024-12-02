type InputType = any;

export function parseInput(input: string): InputType {
  return [""];
}

// Part 1
export function part1(input: InputType): number {
  return 0;
}

// Part 2
export function part2(input: InputType): number {
  return 0;
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
