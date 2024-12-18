import { equal } from "@std/assert";
import { PriorityQueue } from "../utils/collections.ts";

type InputType = string[];

type Position = [number, number];

type StackItem = {
  pos: Position;
  sol: number;
  direction: Direction;
};

type Direction = {
  dx: number;
  dy: number;
};

const directions: Direction[] = [
  { dx: -1, dy: 0 }, // left
  { dx: 1, dy: 0 }, // right
  { dx: 0, dy: 1 }, // down
  { dx: 0, dy: -1 }, // up
];

function isValid([y, x]: Position, len: number) {
  return x >= 0 && x < len && y >= 0 && y < len;
}

function _printMap(pos: Position, corrupted: Set<string>, len: number) {
  console.log();
  for (let i = 0; i < len; i++) {
    let s = "";
    for (let j = 0; j < len; j++) {
      const key = [j, i].toString();
      if (corrupted.has(key)) {
        s += "#";
      } else if (equal(pos, [j, i])) {
        s += "@";
      } else {
        s += ".";
      }
    }
    console.log(s);
  }
}

function findPath(len: number, corrupted: Set<string>): number {
  const [start, end] = [[0, 0], [len - 1, len - 1]] as Position[];

  const visited = new Map<string, number>();
  const pq = new PriorityQueue<StackItem>();
  pq.enqueue({ pos: start, sol: 0, direction: directions[1] }, 0);

  while (!pq.isEmpty()) {
    const current = pq.dequeue() as StackItem;
    const { pos: [x, y], sol, direction: { dx, dy } } = current;

    if (!isValid([x, y], len) || corrupted.has([x, y].toString())) {
      continue;
    }

    if (equal([x, y], end)) {
      return sol;
    }

    const key = `${x},${y},${dx},${dy}`;
    if (visited.has(key) && (visited.get(key) as number) <= sol) {
      continue;
    }
    visited.set(key, sol);

    for (const dir of directions) {
      if (dir.dx === -dx && dir.dy === -dy) continue;

      pq.enqueue({
        pos: [x + dir.dx, y + dir.dy],
        sol: sol + 1,
        direction: dir,
      }, sol + 1);
    }
  }

  return -1;
}

export function parseInput(input: string): InputType {
  return input.trim().split("\n");
}

// Part 1
export function part1(input: InputType, len = 71, bytes = 1024): number {
  return findPath(len, new Set(input.slice(0, bytes)));
}

// Part 2
export function part2(input: InputType, len = 71, bytes = 1024): string {
  let start = bytes;
  let end = input.length - 1;

  while (start < end) {
    const idx = Math.floor((start + end) / 2);
    const corrupted = new Set(input.slice(0, idx));

    if (findPath(len, corrupted) === -1) {
      end = idx;
    } else {
      start = idx + 1;
    }
  }

  return input[start - 1];
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
