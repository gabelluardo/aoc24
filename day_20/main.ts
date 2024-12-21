import { equal } from "@std/assert";
import { PriorityQueue } from "../utils/collections.ts";
import { combinations } from "@gabelluardo/itertools";
type InputType = string[][];

type Position = [number, number];

type Direction = {
  dx: number;
  dy: number;
};

const directions: Direction[] = [
  { dx: -1, dy: 0 }, // up
  { dx: 1, dy: 0 }, // down
  { dx: 0, dy: 1 }, // right
  { dx: 0, dy: -1 }, // left
];

function isValid([x, y]: Position, map: InputType): boolean {
  return x >= 0 && y >= 0 && x < map.length && y < map[0].length;
}

function findStart(map: InputType): [Position, Position] {
  let start = [0, 0] as Position;
  let end = [0, 0] as Position;

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] === "S") {
        start = [i, j];
      } else if (map[i][j] === "E") {
        end = [i, j];
      }
    }
  }

  return [start, end];
}

export function findCheat(
  map: InputType,
  path: Position[],
): Map<number, number> {
  const times = new Map<number, number>();
  const indices = new Map(path.entries().map(([i, v]) => [v.toString(), i]));

  for (const [i, [x, y]] of path.entries()) {
    for (const { dx, dy } of directions) {
      const next = [x + 2 * dx, y + 2 * dy] as Position;

      if (!isValid(next, map)) continue;

      const nextPos = indices.get(next.toString()) as number;

      if (map[x + dx][y + dy] === "#" && nextPos > i) {
        const save = nextPos - i - 2;
        times.set(save, (times.get(save) ?? 0) + 1);
      }
    }
  }

  return times;
}

function manhattanDistance([x1, y1]: Position, [x2, y2]: Position): number {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

export function findCheat2(path: Position[], cheats = 20): Map<number, number> {
  const times = new Map<number, number>();

  for (const [[i, start], [j, end]] of combinations(path.entries(), 2)) {
    const dist = manhattanDistance(start, end);
    if (dist > cheats) continue;

    const save = (j - i) - dist;
    times.set(save, (times.get(save) ?? 0) + 1);
  }

  return times;
}

export function findPath(map: InputType): Position[] {
  type StackItem = {
    pos: Position;
    time: number;
    direction: Direction;
    path: Position[];
  };

  const [start, end] = findStart(map);

  const visited = new Map<string, number>();
  const pq = new PriorityQueue();

  const pqStart = {
    pos: start,
    time: 0,
    direction: directions[0],
    path: [start],
  };
  pq.enqueue(pqStart, 0);

  while (!pq.isEmpty()) {
    const current = pq.dequeue() as StackItem;
    const { pos: [x, y], time, direction: { dx, dy }, path } = current;

    if (!isValid([x, y], map) || map[x][y] === "#") continue;

    if (equal([x, y], end)) {
      return path;
    }

    const key = `${x},${y},${dx},${dy}`;
    if (visited.has(key) && (visited.get(key) as number) <= time) {
      continue;
    }
    visited.set(key, time);

    for (const dir of directions) {
      if (dir.dx === -dx && dir.dy === -dy) continue;

      const next = [x + dir.dx, y + dir.dy];

      pq.enqueue({
        pos: next,
        time: time + 1,
        direction: dir,
        path: [...path, next],
      }, time + 1);
    }
  }

  return [];
}

export function parseInput(input: string): InputType {
  return input.trim().split("\n").map((s) => s.split(""));
}

export function part1(input: InputType, seconds = 100): number {
  const path = findPath(input);
  const times = findCheat(input, path);

  return times.entries().filter(([k, _]) => k >= seconds).reduce(
    (acc, [_, v]) => acc + v,
    0,
  );
}

// Part 2
export function part2(input: InputType, seconds = 100): number {
  const path = findPath(input);
  const times = findCheat2(path);

  return times.entries().filter(([k, _]) => k >= seconds).reduce(
    (acc, [_, v]) => acc + v,
    0,
  );
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
