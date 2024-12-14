type InputType = Machine[];

type Position = {
  x: number;
  y: number;
};

type Machine = {
  a: Position;
  b: Position;
  target: Position;
};

function calculateTokens(machine: Machine): number {
  // https://en.wikipedia.org/wiki/Cramer%27s_rule
  //
  // using Cramer's method for the square matrix of the linear system:
  //
  // a.x*x1 + b.x*x2 = target.x
  // a.y*x1 + b.y*x2 = target.y

  const { a, b, target } = machine;

  const det = a.x * b.y - a.y * b.x;
  const delta1 = target.x * b.y - target.y * b.x;
  const delta2 = a.x * target.y - a.y * target.x;

  const token1 = delta1 / det;
  const token2 = delta2 / det;

  if (Math.floor(token1) !== token1 || Math.floor(token2) !== token2) {
    return 0;
  }

  return 3 * token1 + token2;
}

export function parseInput(input: string): InputType {
  const re = /[+-]?\d+/g;

  return input.split("\n\n").map((s) => {
    const [a, b, target] = s.split("\n").map((line) => {
      const [x, y] = Array.from(line.matchAll(re), Number);

      return { x, y } as Position;
    });

    return { a, b, target } as Machine;
  });
}

// Part 1
export function part1(input: InputType): number {
  return input.reduce((acc, m) => acc + calculateTokens(m), 0);
}

// Part 2
export function part2(input: InputType): number {
  return input
    .map((m) =>
      Object({
        ...m,
        target: {
          x: m.target.x + 10000000000000,
          y: m.target.y + 10000000000000,
        },
      })
    )
    .reduce((acc, m) => acc + calculateTokens(m), 0);
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
