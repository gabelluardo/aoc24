import { permutations } from "../utils/itertools.ts";

type InputType = string[][];

type Position = {
  row: number;
  col: number;
};

function isValid(pos: Position, mat: InputType): boolean {
  return pos.row >= 0 && pos.row < mat.length &&
    pos.col >= 0 && pos.col < mat[0].length;
}

function findAntennaLocations(input: InputType): Map<string, Position[]> {
  const hm = new Map();

  for (const [i, row] of input.entries()) {
    for (const [j, cell] of row.entries()) {
      if (cell !== ".") {
        const pos = { row: i, col: j };

        if (!hm.has(cell)) {
          hm.set(cell, [pos]);
          continue;
        }

        hm.set(cell, [pos, ...hm.get(cell)]);
      }
    }
  }

  return hm;
}

export function parseInput(input: string): InputType {
  return input.trim().split("\n").map((s) => s.split(""));
}

// Part 1
export function part1(input: InputType): number {
  const hm = findAntennaLocations(input);
  const antinodes = new Set();

  for (const [_, positions] of hm.entries()) {
    for (const [a, b] of permutations(positions, 2)) {
      const [dx, dy] = [b.row - a.row, b.col - a.col];
      const node = { row: b.row + dx, col: b.col + dy };

      if (isValid(node, input)) {
        antinodes.add(`${node.row},${node.col}`);
      }
    }
  }

  return antinodes.size;
}

// Part 2
export function part2(input: InputType): number {
  const hm = findAntennaLocations(input);
  const antinodes = new Set();

  for (const [_, positions] of hm.entries()) {
    for (const [a, b] of permutations(positions, 2)) {
      const [dx, dy] = [b.row - a.row, b.col - a.col];
      let [nx, ny] = [b.row + dx, b.col + dy];

      antinodes.add(`${b.row},${b.col}`);

      while (isValid({ row: nx, col: ny }, input)) {
        antinodes.add(`${nx},${ny}`);
        [nx, ny] = [nx + dx, ny + dy];
      }
    }
  }

  return antinodes.size;
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
