type InputType = string[][];

type Position = [number, number];

type Info = {
  area: number;
  sides: number;
  perimeter: number;
};

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

function dfs(
  [x, y]: Position,
  visited: Set<string>,
  input: InputType,
): Info {
  const info = new Map<string, Position[]>();

  const stack = [[x, y]];
  const type = input[x][y];
  while (stack.length > 0) {
    const curr = stack.pop();
    if (!curr) break;

    const key = curr.toString();
    if (visited.has(key)) continue;

    info.set(key, []);
    visited.add(key);

    const [cx, cy] = curr;
    for (const { dx, dy } of directions) {
      const [nx, ny] = [cx + dx, cy + dy] as Position;

      if (!isValid([nx, ny], input) || input[nx][ny] !== type) {
        info.set(key, [[nx, ny], ...info.get(key) ?? []]);
      } else {
        stack.push([nx, ny]);
      }
    }
  }

  const items = Array.from(info.keys());

  const area = items.length;
  const perimeter = Array.from(info.values()).reduce(
    (acc, n) => acc + n.length,
    0,
  );
  const sides = countSides(
    items.map((s) => s.split(",").map(Number) as Position),
  );

  return { area, perimeter, sides };
}

function countSides(coords: [number, number][]): number {
  function isInside([x, y]: Position, positions: Position[]): boolean {
    return positions.some(([px, py]) => px === x && py === y);
  }

  function sides(positions: Position[], [dx, dy]: Position): number {
    let check = positions.slice();

    let sides = 0;
    while (check.length > 0) {
      const pos = check.pop();
      if (!pos) break;

      const [x, y] = pos;

      if (isInside([x + dx, y + dy], positions)) {
        continue;
      }

      sides += 1;
      for (const [mx, my] of [[dy, dx], [-dy, -dx]]) {
        let nextPos = [x + mx, y + my] as Position;

        while (
          isInside(nextPos, check) &&
          !isInside([nextPos[0] + dx, nextPos[1] + dy], positions)
        ) {
          const [nx, ny] = nextPos;

          check = check.filter(([px, py]) => px !== nx || py !== ny);
          nextPos = [nx + mx, ny + my];
        }
      }
    }

    return sides;
  }

  return directions.reduce(
    (acc, { dx, dy }) => acc + sides(coords, [dx, dy]),
    0,
  );
}

export function parseInput(input: string): InputType {
  return input.trim().split("\n").map((s) => s.split(""));
}

// Part 1
export function part1(input: InputType): number {
  const visited = new Set<string>();

  const positions = input.flatMap((row, i) =>
    row.map((_, j) => [i, j] as Position)
  );

  return positions.reduce((acc, [i, j]) => {
    if (!visited.has([i, j].toString())) {
      const { area, perimeter } = dfs([i, j], visited, input);

      return acc + (area * perimeter);
    }
    return acc;
  }, 0);
}

// Part 2
export function part2(input: InputType): number {
  const visited = new Set<string>();

  const positions = input.flatMap((row, i) =>
    row.map((_, j) => [i, j] as Position)
  );

  return positions.reduce((acc, [i, j]) => {
    if (!visited.has([i, j].toString())) {
      const { area, sides } = dfs([i, j], visited, input);

      return acc + (area * sides);
    }
    return acc;
  }, 0);
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);
  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
