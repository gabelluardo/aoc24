import { permutationsWithReplacement } from "../utils/itertools.ts";
type InputType = Equation[];

type Equation = {
  test: number;
  numbers: number[];
};

type Operation = (a: number, b: number) => number;

function execOperations(arr: number[], operations: Operation[]): number {
  return operations.reduce(
    (acc, op, i) => op(acc, arr[i + 1]),
    arr[0],
  );
}

export function parseInput(input: string): InputType {
  return input.trim().split("\n").map((l) => {
    const eq = l.split(":");

    return {
      test: Number(eq[0]),
      numbers: eq[1].trim().split(" ").map(Number),
    };
  });
}

// Part 1
export function part1(input: InputType): number {
  const operations: Operation[] = [
    (a: number, b: number) => a + b,
    (a: number, b: number) => a * b,
  ];

  return input.filter((e) =>
    permutationsWithReplacement(operations, e.numbers.length - 1).some((ops) =>
      execOperations(e.numbers, ops) === e.test
    )
  ).reduce((acc, e) => acc + e.test, 0);
}

// Part 2
export function part2(input: InputType): number {
  const operations: Operation[] = [
    (a: number, b: number) => a + b,
    (a: number, b: number) => a * b,
    (a: number, b: number) => a * 10 ** (Math.floor(Math.log10(b)) + 1) + b,
  ];

  return input.filter((e) =>
    permutationsWithReplacement(operations, e.numbers.length - 1).some((ops) =>
      execOperations(e.numbers, ops) === e.test
    )
  ).reduce((acc, e) => acc + e.test, 0);
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
