type InputType = Robot[];

type Position = {
  x: number;
  y: number;
};

type Robot = {
  p: Position;
  v: Position;
};

function calculateQuads(
  robots: InputType,
  { x: width, y: higth }: Position,
): number[] {
  const dict = new Map();
  for (const { p } of robots) {
    dict.set(JSON.stringify(p), (dict.get(JSON.stringify(p)) ?? 0) + 1);
  }

  const quads = [0, 0, 0, 0];
  for (const [k, v] of dict) {
    const p = JSON.parse(k);

    if (p.x < Math.floor(width / 2) && p.y < Math.floor(higth / 2)) {
      quads[0] += v;
    } else if (p.x < Math.floor(width / 2) && p.y > Math.floor(higth / 2)) {
      quads[1] += v;
    } else if (p.x > Math.floor(width / 2) && p.y < Math.floor(higth / 2)) {
      quads[2] += v;
    } else if (p.x > Math.floor(width / 2) && p.y > Math.floor(higth / 2)) {
      quads[3] += v;
    }
  }
  return quads;
}

function move(newC: number, maxValue: number): number {
  return ((newC % maxValue) + maxValue) % maxValue;
}

function calculateEntropy(mat: number[][]): number {
  const counts = new Map<number, number>();
  let total = 0;

  for (const row of mat) {
    for (const cell of row) {
      counts.set(cell, (counts.get(cell) ?? 0) + 1);
      total++;
    }
  }

  let entropy = 0;
  for (const count of counts.values()) {
    const p = count / total;
    entropy -= p * Math.log2(p);
  }

  return entropy;
}

export function parseInput(input: string): InputType {
  const re = /[+-]?\d+/g;

  return input.trim().split("\n").map((s) => {
    const [px, py, vx, vy] = Array.from(s.matchAll(re), Number);

    return { p: { x: px, y: py }, v: { x: vx, y: vy } };
  });
}

// Part 1
export function part1(
  input: InputType,
  space = { x: 101, y: 103 } as Position,
): number {
  const robots = structuredClone(input);

  for (let i = 0; i < 100; i++) {
    for (const { p, v } of robots) {
      p.x = move(p.x + v.x, space.x);
      p.y = move(p.y + v.y, space.y);
    }
  }

  return calculateQuads(robots, space).reduce((acc, n) => acc * n, 1);
}

// Part 2
export function part2(
  input: InputType,
  space = { x: 101, y: 103 } as Position,
): number {
  const entropy = [];

  for (let i = 0; i < 10_000; i++) {
    const mat = Array.from({ length: space.y }, () => Array(space.x).fill(0));

    for (const { p, v } of input) {
      p.x = move(p.x + v.x, space.x);
      p.y = move(p.y + v.y, space.y);

      mat[p.y][p.x] += 1;
    }
    entropy.push(calculateEntropy(mat));
  }

  return entropy.indexOf(Math.min(...entropy)) + 1;
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
