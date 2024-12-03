type InputType = string;

export function parseInput(input: string): InputType {
  return input.trim();
}

function mulMatches(mul: string): number {
  const re = /\d+/g;

  return Array.from(mul.matchAll(re), (m) => Number(m[0]))
    .reduce((acc, n) => acc * n);
}

export function part1(input: InputType): number {
  const re = /mul\(\d+,\d+\)/g;

  return Array.from(input.matchAll(re), (m) => mulMatches(m[0]))
    .reduce((acc, n) => acc + n, 0);
}

export function part2(input: InputType): number {
  interface State {
    readonly take: boolean;
    readonly sum: number;
  }

  const re = /(do\(\)|don't\(\)|mul\(\d+,\d+\))/g;

  return Array.from(input.matchAll(re), (m) => m[0])
    .reduce((state: State, value: string) => ({
      take: value.includes("()") ? value === "do()" : state.take,
      sum: value.includes("mul") && state.take
        ? state.sum + mulMatches(value)
        : state.sum,
    }), { take: true, sum: 0 }).sum;
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
