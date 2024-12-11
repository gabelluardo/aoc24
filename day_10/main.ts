type InputType = number[][];

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

function isValid([x, y]: Position, input: InputType): boolean {
  return x >= 0 && x < input.length && y >= 0 && y < input[0].length;
}

function startingPoints(input: InputType): Position[] {
  return input.flatMap((r, i) =>
    r.map((n, j) => [n, j]).filter(([n, _]) => n === 0).map(([_, j]) =>
      [i, j] as Position
    )
  );
}

export function parseInput(input: string): InputType {
  return input.trim().split("\n").map((s) => s.split("").map(Number));
}

// Part 1
export function part1(input: InputType): number {
  const points = startingPoints(input);

  const trailhead = new Map(
    points.map((p) => [p.toString(), new Set()]),
  );

  for (const start of points) {
    const stack = [{ pos: start, value: 0 }];
    const currentTrail = trailhead.get(start.toString()) ?? new Set();

    while (stack.length > 0) {
      const current = stack.pop();
      if (!current) break;

      const { pos: [x, y], value } = current;

      if (value === 9) {
        currentTrail.add([x, y].toString());
        continue;
      }

      for (const { dx, dy } of directions) {
        const nextPos = [x + dx, y + dy] as Position;

        if (!isValid(nextPos, input)) continue;

        const nextValue = input[nextPos[0]][nextPos[1]];
        if (nextValue === value + 1) {
          stack.push({ pos: nextPos, value: nextValue });
        }
      }
    }
  }

  return trailhead.values().reduce((acc, s) => acc + s.size, 0);
}

// Part 2
export function part2(input: InputType): number {
  const points = startingPoints(input);

  const trailhead = new Map(
    points.map((p) => [p.toString(), 0]),
  );

  for (const start of points) {
    const stack = [{ pos: start, value: 0 }];

    while (stack.length > 0) {
      const current = stack.pop();
      if (!current) break;

      const { pos: [x, y], value } = current;

      if (value === 9) {
        const count = trailhead.get(start.toString()) ?? 0;
        trailhead.set(start.toString(), count + 1);
        continue;
      }

      for (const { dx, dy } of directions) {
        const nextPos = [x + dx, y + dy] as Position;

        if (!isValid(nextPos, input)) continue;

        const nextValue = input[nextPos[0]][nextPos[1]];
        if (nextValue === value + 1) {
          stack.push({ pos: nextPos, value: nextValue });
        }
      }
    }
  }

  return trailhead.values().reduce((acc, n) => acc + n, 0);
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
