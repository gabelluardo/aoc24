type InputType = string[][];
type Position = {
  row: number;
  col: number;
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
  { dx: -1, dy: 1 }, // upRight
  { dx: 1, dy: 1 }, // downRight
  { dx: -1, dy: -1 }, // upLeft
  { dx: 1, dy: -1 }, // downLeft
];

function checkSequence(
  data: InputType,
  pos: Position,
  dir: Direction,
): boolean {
  const { dx, dy } = dir;
  const { row, col } = pos;

  if (
    row + dx * 3 < 0 || row + dx * 3 >= data.length ||
    col + dy * 3 < 0 || col + dy * 3 >= data[0].length
  ) {
    return false;
  }

  const string = [
    data[row + dx][col + dy],
    data[row + dx * 2][col + dy * 2],
    data[row + dx * 3][col + dy * 3],
  ].join("");

  return string === "MAS";
}

function checkCross(data: InputType, pos: Position): boolean {
  const { row, col } = pos;

  if (
    row - 1 < 0 || row + 1 >= data.length ||
    col - 1 < 0 || col + 1 >= data[0].length
  ) {
    return false;
  }

  const diagonals = [
    [data[row - 1][col - 1], data[row + 1][col + 1]].join(""), // diag1
    [data[row - 1][col + 1], data[row + 1][col - 1]].join(""), // diag2
  ];

  return diagonals.every((d) => d === "MS" || d === "SM");
}

export function parseInput(input: string): InputType {
  return input.trim().split("\n").map((s) => s.split(""));
}

// Part1
export function part1(input: InputType): number {
  function countSequence(input: InputType, pos: Position): number {
    return directions.filter(
      (dir) => checkSequence(input, pos, dir),
    ).length;
  }

  return input.map((row, i) =>
    row.reduce(
      (acc, c, j) =>
        c === "X" ? acc + countSequence(input, { row: i, col: j }) : acc,
      0,
    )
  ).reduce((acc, i) => acc + i);
}

// Part2
export function part2(input: InputType): number {
  return input.map((row, i) =>
    row.filter((c, j) => c === "A" && checkCross(input, { row: i, col: j }))
      .length
  ).reduce((acc, i) => acc + i);
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
