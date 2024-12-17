import { equal } from "@std/assert/equal";
import { PriorityQueue } from "../utils/collections.ts";

type InputType = Grid;

type Grid = string[][];

type Position = [number, number];

type Direction = {
  dx: number;
  dy: number;
};

type StackItem = {
  pos: Position;
  points: number;
  direction: Direction;
};

type Path = {
  path: Position[];
  points: number;
};

const directions: Direction[] = [
  { dx: -1, dy: 0 }, // up
  { dx: 1, dy: 0 }, // down
  { dx: 0, dy: 1 }, // right
  { dx: 0, dy: -1 }, // left
];

function findStart(map: Grid): [Position, Position] {
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

function findMinPath(map: Grid): number {
  const [start, end] = findStart(map);
  const visited = new Map<string, number>();

  const pq = new PriorityQueue<StackItem>();
  pq.enqueue({ pos: start, points: 0, direction: directions[2] }, 0);

  while (!pq.isEmpty()) {
    const current = pq.dequeue() as StackItem;
    const { pos: [x, y], points, direction: { dx, dy } } = current;

    if (equal([x, y], end)) return points;

    if (map[x][y] === "#") continue;

    const key = `${x},${y},${dx},${dy}`;
    if (visited.has(key) && (visited.get(key) as number) <= points) {
      continue;
    }

    visited.set(key, points);

    for (const dir of directions) {
      if (dir.dx === -dx && dir.dy === -dy) continue;

      const p = points + (equal(dir, { dx, dy }) ? 1 : 1001);

      pq.enqueue({
        pos: [x + dir.dx, y + dir.dy],
        points: p,
        direction: dir,
      }, p);
    }
  }

  return -1;
}

function findAllBestSpots(map: Grid): number {
  const target = findMinPath(map);
  const [start, end] = findStart(map);

  const paths: Path[] = [];
  const visited = new Map<string, number>();

  const pq = new PriorityQueue<StackItem & Path>();
  pq.enqueue(
    { pos: start, points: 0, direction: directions[2], path: [start] },
    0,
  );

  while (!pq.isEmpty()) {
    const current = pq.dequeue() as StackItem & Path;
    const { pos, points, direction: { dx, dy }, path } = current;

    const [x, y] = pos;

    if (equal(pos, end)) {
      paths.push({ path: path.slice(), points });
      continue;
    }

    if (map[x][y] === "#" || points >= target) {
      continue;
    }

    const key = `${x},${y},${dx},${dy}`;
    if (visited.has(key) && (visited.get(key) as number) < points) {
      continue;
    }

    visited.set(key, points);

    for (const dir of directions) {
      if (dir.dx === -dx && dir.dy === -dy) continue;

      const newPoints = points + (equal(dir, { dx, dy }) ? 1 : 1001);
      const newPos = [x + dir.dx, y + dir.dy] as Position;

      pq.enqueue({
        pos: newPos,
        path: [...path, newPos],
        points: newPoints,
        direction: dir,
      }, newPoints);
    }
  }

  return Array.from(paths, (p) => p.path).reduce(
    (acc, p) => acc.union(new Set(p.map(String))),
    new Set(),
  ).size;
}

export function parseInput(input: string): InputType {
  return input.trim().split("\n").map((s) => s.split(""));
}

// Part 1
export function part1(input: InputType): number {
  return findMinPath(input);
}

// Part 2
export function part2(input: InputType): number {
  return findAllBestSpots(input);
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
