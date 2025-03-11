import { product } from "@gabelluardo/itertools";

type Lock = number[];
type Key = number[];

interface InputType {
  locks: Lock[];
  keys: Key[];
  height: number;
}

export function parseInput(input: string): InputType {
  const locks: Lock[] = [];
  const keys: Key[] = [];

  for (const item of input.trim().split("\n\n")) {
    const lines = item.split("\n");
    const isLock = lines[0][0] === "#";

    const heights = [];
    for (let j = 0; j < lines[0].length; j++) {
      let maxHeight = 0;

      for (let i = 0; i < lines.length; i++) {
        if (j < lines[i].length && lines[i][j] === "#") {
          if (isLock) {
            maxHeight = Math.max(maxHeight, i + 1);
          } else {
            maxHeight = Math.max(maxHeight, lines.length - i);
          }
        }
      }

      heights.push(maxHeight - 1);
    }

    if (isLock) {
      locks.push(heights);
    } else {
      keys.push(heights);
    }
  }

  return { locks, keys, height: 6 };
}

// Part 1
export function part1(input: InputType): number {
  const { locks, keys, height } = input;

  return Array.from(
    product([locks, keys]).filter(([lock, key]) =>
      lock.map((n, i) => n + key[i]).every((n) => n < height)
    ),
  ).length;
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
}
