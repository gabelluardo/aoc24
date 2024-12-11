type InputType = number[];

function calculate(input: InputType, blink: number): number {
  const stones = new Map<number, number>(input.map((n) => [n, 1]));

  for (let i = 0; i < blink; i++) {
    const entries = Array.from(stones.entries());
    stones.clear();

    for (const [num, count] of entries) {
      const digits = num.toString();

      if (num === 0) {
        stones.set(1, (stones.get(1) || 0) + count);
      } else if (digits.length % 2 === 0) {
        const left = Number(digits.slice(0, digits.length / 2));
        const right = Number(digits.slice(digits.length / 2));

        stones.set(left, (stones.get(left) || 0) + count);
        stones.set(right, (stones.get(right) || 0) + count);
      } else {
        const newNum = num * 2024;

        stones.set(newNum, (stones.get(newNum) || 0) + count);
      }
    }
  }

  return stones.values().reduce((acc, n) => acc + n, 0);
}

export function parseInput(input: string): InputType {
  return input.trim().split(" ").map(Number);
}

// Part 1
export function part1(input: InputType, blink = 25): number {
  return calculate(input, blink);
}

// Part 2
export function part2(input: InputType): number {
  return calculate(input, 75);
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
