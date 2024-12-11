type InputType = number[];

function calculate(input: InputType, blink: number): number {
  let stones = new Map<number, number>(input.map((n) => [n, 1]));

  for (let i = 0; i < blink; i++) {
    const newStones = new Map<number, number>();

    for (const [num, count] of stones.entries()) {
      const digits = num.toString();

      if (num === 0) {
        newStones.set(1, (newStones.get(1) || 0) + count);
      } else if (digits.length % 2 === 0) {
        const left = Number(digits.slice(0, digits.length / 2));
        const right = Number(digits.slice(digits.length / 2));

        newStones.set(left, (newStones.get(left) || 0) + count);
        newStones.set(right, (newStones.get(right) || 0) + count);
      } else {
        const newNum = num * 2024;

        newStones.set(newNum, (newStones.get(newNum) || 0) + count);
      }
    }

    stones = newStones;
  }

  return stones.values().reduce((acc, n) => acc + n);
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
