type InputType = {
  registers: Registers;
  program: number[];
};

type Registers = {
  a: number;
  b: number;
  c: number;
};

type Instruction = (system: System, op: number) => undefined;

type System = {
  ins: { value: number };
  registers: Registers;
  stdout: number[];
};

const instructions = new Map<number, Instruction>([
  // adv
  [0, ({ ins, registers }: System, op: number) => {
    registers.a = Math.floor(registers.a / (2 ** combo(op, registers)));
    ins.value += 2;
  }],

  // bxl
  [
    1,
    ({ ins, registers }: System, op: number) => {
      registers.b = (registers.b ^ op) >>> 0;
      ins.value += 2;
    },
  ],

  // bst
  [
    2,
    ({ ins, registers }: System, op: number) => {
      registers.b = combo(op, registers) & 7;
      ins.value += 2;
    },
  ],

  // jnz
  [
    3,
    ({ ins, registers }: System, op: number) => {
      if (registers.a === 0) {
        ins.value += 2;
        return;
      }

      ins.value = op;
    },
  ],

  // bxc
  [
    4,
    ({ ins, registers }: System, _op: number) => {
      registers.b = (registers.b ^ registers.c) >>> 0;
      ins.value += 2;
    },
  ],

  // out
  [
    5,
    ({ ins, registers, stdout }: System, op: number) => {
      stdout.push(combo(op, registers) % 8);
      if ((combo(op, registers) % 8) < 0) {
        console.log(ins, registers);
      }
      ins.value += 2;
    },
  ],

  // out
  [
    6,
    ({ ins, registers }: System, op: number) => {
      registers.b = Math.floor(registers.a / (2 ** combo(op, registers)));
      ins.value += 2;
    },
  ],

  // cdv
  [
    7,
    ({ ins, registers }: System, op: number) => {
      registers.c = Math.floor(registers.a / (2 ** combo(op, registers)));
      ins.value += 2;
    },
  ],
]);

function combo(op: number, { a, b, c }: Registers): number {
  if (op >= 0 && op <= 3) {
    return op;
  }
  if (op === 4) {
    return a;
  }
  if (op === 5) {
    return b;
  }
  if (op === 6) {
    return c;
  }

  throw new Error("Invalid operation");
}

export function parseInput(input: string): InputType {
  const re = /\d+/g;
  const [r, program] = input.trim().split("\n\n").map((p) =>
    Array.from(p.matchAll(re), Number)
  );

  const [a, b, c] = r;

  return { registers: { a, b, c }, program: program };
}

// Part 1
export function part1(input: InputType): string {
  const { registers, program } = input;

  const system = { ins: { value: 0 }, registers, stdout: [] };

  while (system.ins.value <= program.length - 1) {
    const idx = system.ins.value;
    const [code, op] = [program[idx], program[idx + 1]];
    const exec = instructions.get(code) as Instruction;

    exec(system, op);
  }

  return system.stdout.join(",");
}

// Part 2
export function part2(input: InputType): number {
  type StackItem = { value: number; len: number };

  const { program } = input;

  const stack = [{ value: 0, len: 0 }];
  const programLength = program.length;

  while (stack.length > 0) {
    const { value, len } = stack.shift() as StackItem;
    if (len === programLength) {
      return value;
    }

    const test = program.slice(-(len + 1)).join(",");

    for (let i = 0; i < 8; i++) {
      const a = value * 8 + i;
      const out = part1({ registers: { a, b: 0, c: 0 }, program });

      if (out === test) {
        stack.push({ value: a, len: len + 1 });
      }
    }
  }

  return -1;
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
