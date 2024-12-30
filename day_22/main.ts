import { CircularBuffer } from "../utils/collections.ts";

type InputType = number[];

type Prices = {
  value: number;
  variation: number;
  sequence: number[];
};

export function parseInput(input: string): InputType {
  return input.trim().split("\n").map(Number);
}

export function mix(value: number, secret: number): number {
  return (value ^ secret) >>> 0;
}

export function prune(value: number): number {
  return value % 16777216;
}

export function lastDigit(num: number): number {
  return Math.abs(num) % 10;
}

export function nextSecret(num: number): number {
  let secret = num;

  secret = prune(mix(secret * 64, secret));
  secret = prune(mix(Math.floor(secret / 32), secret));
  secret = prune(mix(secret * 2048, secret));

  return secret;
}

export function prices(initial: number, iter: number): Prices[] {
  const array = [];
  const sequence = new CircularBuffer<number>(4);

  let secret = initial;
  let precVal = lastDigit(secret);
  for (let i = 0; i < iter; i++) {
    secret = nextSecret(secret);

    const value = lastDigit(secret);
    const variation = value - precVal;
    sequence.push(variation);

    array.push({
      value,
      variation,
      sequence: Array.from(sequence),
    });

    precVal = value;
  }

  return array;
}

// Part 1
export function part1(input: InputType): number {
  function generate(initial: number, iter: number): number {
    let secret = initial;

    for (let i = 0; i < iter; i++) {
      secret = nextSecret(secret);
    }

    return secret;
  }

  return input.map((n) => generate(n, 2000)).reduce((acc, n) => acc + n, 0);
}

// Part 2
export function part2(input: InputType): number {
  const market = new Map();

  for (const secret of input) {
    const keys = new Set();
    for (const p of prices(secret, 2000)) {
      const k = p.sequence.toString();
      if (!keys.has(k)) {
        market.set(k, (market.get(k) ?? 0) + p.value);
        keys.add(k);
      }
    }
  }

  return Math.max(...market.values());
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
