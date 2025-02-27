type InputType = {
  variables: Variables;
  instructions: Instructions;
};

type Instruction = {
  operation: string;
  args: [string, string];
  output: string;
  exec: { value: boolean };
};

type Variables = Map<string, number>;
type Instructions = Map<string, Instruction>;

type Operation = (in1: number, in2: number) => number;

const operations = new Map<string, Operation>([
  ["AND", (in1: number, in2: number) => in1 & in2],
  ["OR", (in1: number, in2: number) => in1 | in2],
  ["XOR", (in1: number, in2: number) => (in1 ^ in2) >>> 0],
]);

function extractValue(id: string, variables: Variables): number[] {
  return Array.from(variables.entries())
    .filter(([k, _]) => k.startsWith(id))
    .sort(([k1], [k2]) => k2.localeCompare(k1))
    .map(([_, v]) => v);
}

function toDigit(num: number[]): number {
  return Number.parseInt(num.join(""), 2);
}

export function parseInput(input: string): InputType {
  const [vars, ins] = input.trim().split("\n\n");

  const variables = new Map(
    vars.split("\n").map((s) => {
      const [k, v] = s.split(": ");
      return [k, Number(v)] as [string, number];
    }),
  );

  const instructions = new Map(
    ins.split("\n").map((s) => {
      const [v1, operation, v2, _, output] = s.split(" ");
      const ins = {
        operation,
        output,
        args: [v1, v2] as [string, string],
        exec: { value: false },
      };

      return [output, ins];
    }),
  );

  return { variables, instructions };
}

// Part 1
export function part1(input: InputType): number {
  const { variables, instructions } = structuredClone(input);
  const ins = Array.from(instructions.values());

  while (ins.some(({ exec }) => !exec.value)) {
    for (const { operation, output, args: [v1, v2], exec } of ins) {
      if (!variables.has(v1) || !variables.has(v2) || exec.value) {
        continue;
      }

      const in1 = variables.get(v1) as number;
      const in2 = variables.get(v2) as number;

      const op = operations.get(operation) as Operation;

      variables.set(output, op(in1, in2));
      exec.value = true;
    }
  }

  return toDigit(extractValue("z", variables));
}

// Part 2
export function part2(input: InputType): string {
  function findGate(in1: string, op: string, in2: string) {
    return instructions.values().find(
      ({ operation, args: [input1, input2] }) => {
        return operation === op && (
          input1 === in1 ||
          input2 === in1 ||
          input1 === in2 ||
          input2 === in2
        );
      },
    );
  }

  function swap(a: string, b: string) {
    swaps.add(a);
    swaps.add(b);
    const gateA = instructions.get(a);
    const gateB = instructions.get(b);

    if (gateA && gateB) {
      const temp = { ...gateA, output: b };
      instructions.set(a, { ...gateB, output: a });
      instructions.set(b, temp);
    }
  }

  const { instructions } = input;
  const swaps: Set<string> = new Set();
  const iter =
    Array.from(instructions.keys().filter((i) => i.startsWith("z"))).length;

  let carry = findGate("x00", "AND", "y00") as Instruction;
  for (let n = 1; n < iter - 1; n++) {
    const nn = n.toString().padStart(2, "0");
    const xx = `x${nn}`;
    const yy = `y${nn}`;
    const zz = `z${nn}`;

    const { output: xor } = findGate(xx, "XOR", yy) as Instruction;
    const { output: and } = findGate(xx, "AND", yy) as Instruction;

    const sum = findGate(xor, "XOR", carry.output) as Instruction;
    const { output: c } = findGate(xor, "AND", carry.output) as Instruction;

    const { args: [in1, in2], output } = sum;
    if (!output.startsWith("z")) {
      swap(output, zz);
    } else if (
      ![xor, carry.output].includes(in1) ||
      ![xor, carry.output].includes(in2)
    ) {
      swap(xor, and);
    }

    carry = findGate(and, "OR", c) as Instruction;
  }

  return Array.from(swaps).sort((a, b) => a.localeCompare(b)).join(",");
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
