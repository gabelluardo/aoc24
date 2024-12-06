import { equal } from "@std/assert/equal";

type InputType = string[][];

type Position = {
  row: number;
  col: number;
};

type Direction = {
  dx: number;
  dy: number;
};

const directions = new Map<string, Direction>([
  ["^", { dx: -1, dy: 0 }], // up
  [">", { dx: 0, dy: 1 }], // right
  ["v", { dx: 1, dy: 0 }], // down
  ["<", { dx: 0, dy: -1 }], // left
]);

const orientation = [...directions.keys()] as const;

function findStart(input: InputType): Position {
  for (const [i, row] of input.entries()) {
    for (const [j, c] of row.entries()) {
      if (c === "<" || c === "v" || c === "^" || c === ">") {
        return { row: i, col: j };
      }
    }
  }

  return { row: 0, col: 0 };
}

function isValid(pos: Position, input: InputType): boolean {
  return pos.row >= 0 && pos.row < input.length && pos.col >= 0 &&
    pos.col < input[0].length;
}

function changeDirection(curr: string): string {
  return orientation[(orientation.indexOf(curr) + 1) % orientation.length];
}

function nextPosition(pos: Position, dir: string): Position {
  const direction = directions.get(dir);
  if (!direction) {
    throw new Error(`Invalid direction: ${dir}`);
  }

  return {
    row: pos.row + direction.dx,
    col: pos.col + direction.dy,
  };
}

function findVisiteBeforeExit(input: InputType): Position[] {
  const visited = new Set<string>();

  let pos = findStart(input);
  let dir = input[pos.row][pos.col];

  while (true) {
    visited.add(JSON.stringify(pos));

    const nextPos = nextPosition(pos, dir);
    if (!isValid(nextPos, input)) {
      break;
    }

    if (input[nextPos.row][nextPos.col] === "#") {
      dir = changeDirection(dir);
      continue;
    }

    pos = nextPos;
  }

  return Array.from(visited, (v) => JSON.parse(v));
}

function findLoop(
  obstacle: Position,
  start: Position,
  input: InputType,
): boolean {
  if (equal(obstacle, start)) {
    return false;
  }

  const visited = new Set<string>();

  let pos = start;
  let dir = input[pos.row][pos.col];

  while (true) {
    const posKey = JSON.stringify({ pos, dir });
    if (visited.has(posKey)) {
      return true;
    }
    visited.add(posKey);

    const nextPos = nextPosition(pos, dir);
    if (!isValid(nextPos, input)) {
      return false;
    }

    if (input[nextPos.row][nextPos.col] === "#" || equal(nextPos, obstacle)) {
      dir = changeDirection(dir);
      continue;
    }

    pos = nextPos;
  }
}

export function parseInput(input: string): InputType {
  return input.trim().split("\n").map((r) => r.split(""));
}

// Part 1
export function part1(input: InputType): number {
  return findVisiteBeforeExit(input).length;
}

// Part 2
export function part2(input: InputType): number {
  const start = findStart(input);

  return findVisiteBeforeExit(input).filter((p) => findLoop(p, start, input))
    .length;
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
