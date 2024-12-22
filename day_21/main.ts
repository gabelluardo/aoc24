import { equal } from "@std/assert";
import { permutationsWithReplacement } from "@gabelluardo/itertools";

type InputType = string[];

type Pad = Map<string, string[]>;

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

const directionsMap = new Map([
  ["-1,0", "^"],
  ["1,0", "v"],
  ["0,1", ">"],
  ["0,-1", "<"],
]);

const numPad = createKeypad([
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  ["x", "0", "A"],
]);

const dirPad = createKeypad([
  ["x", "^", "A"],
  ["<", "v", ">"],
]);

function findMinPath(
  map: string[][],
  start: Position,
  end: Position,
): string[] {
  function isValid([x, y]: Position, map: string[][]): boolean {
    return x >= 0 && y >= 0 && x < map.length && y < map[0].length;
  }

  function countTurns(v: string[]): number {
    return v.reduce((acc, c, i) => acc + (i > 0 && c !== v[i - 1] ? 1 : 0), 1);
  }

  const visited = new Map<string, number>();
  const result = new Map<number, string[]>();

  function dfs(
    [x, y]: Position,
    { dx, dy }: Direction,
    path: string[],
    cost: number,
  ) {
    if (!isValid([x, y], map) || map[x][y] === "x") return;

    if (equal([x, y], end)) {
      const turns = countTurns(path);
      result.set(turns, [...(result.get(turns) ?? []), path.join("")]);
      return;
    }

    const key = `${x},${y},${dx},${dy}`;
    if (visited.has(key) && (visited.get(key) as number) <= cost) return;
    visited.set(key, cost);

    for (const dir of directions) {
      const pos = [dir.dx, dir.dy];
      const d = directionsMap.get(pos.toString()) ?? "";

      dfs([x + dir.dx, y + dir.dy], dir, [...path, d], cost + 1);
    }
  }

  dfs(start, directions[0], [], 0);

  return result.get(Math.min(...result.keys())) ?? [""];
}

function createKeypad(keypad: string[][]): Pad {
  const indices = [];
  for (let i = 0; i < keypad.length; i++) {
    for (let j = 0; j < keypad[0].length; j++) {
      if (keypad[i][j] === "x") continue;
      indices.push([i, j] as Position);
    }
  }

  const table: Pad = new Map();
  for (const [[x1, y1], [x2, y2]] of permutationsWithReplacement(indices, 2)) {
    const key = `${keypad[x1][y1]}-${keypad[x2][y2]}`;

    table.set(key, findMinPath(keypad, [x1, y1], [x2, y2]));
  }

  return table;
}

function translate(code: string, robots: number): number {
  const memo = new Map<string, number>();

  function inner(code: string, pad: Pad, robot: number): number {
    if (robot === robots + 1) {
      return code.length + 1;
    }

    const mkey = `${robot}${code}`;
    if (memo.has(mkey)) {
      return memo.get(mkey) as number;
    }

    let total = 0;
    let state = "A";
    for (const c of `${code}A`) {
      const key = `${state}-${c}`;
      const values = pad.get(key) ?? [];

      total += Math.min(...values.map((p) => inner(p, dirPad, robot + 1)));

      state = c;
    }

    memo.set(mkey, total);

    return total;
  }

  return inner(code.slice(0, 3), numPad, 0);
}

export function parseInput(input: string): InputType {
  return input.trim().split("\n");
}

// Part 1
export function part1(input: InputType): number {
  return input.map((c) => [Number(c.slice(0, 3)), translate(c, 2)])
    .reduce(
      (acc, [code, sequence]) => acc + code * sequence,
      0,
    );
}

// Part 2
export function part2(input: InputType): number {
  return input.map((c) => [Number(c.slice(0, 3)), translate(c, 25)])
    .reduce(
      (acc, [code, sequence]) => acc + code * sequence,
      0,
    );
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
