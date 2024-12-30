import { combinations } from "@gabelluardo/itertools";

type InputType = Map<string, Set<string>>;

export function parseInput(input: string): InputType {
  const map = new Map();

  for (const line of input.trim().split("\n")) {
    const [a, b] = line.split("-");

    map.set(a, (map.get(a) ?? new Set()).add(b));
    map.set(b, (map.get(b) ?? new Set()).add(a));
  }

  return map;
}

// Part 1
export function part1(input: InputType): number {
  function isConnected(a: string, b: string): boolean {
    return (input.get(a) as Set<string>).has(b);
  }

  const triplets = [];
  for (const [a, b, c] of combinations(input.keys(), 3)) {
    if (a.startsWith("t") || b.startsWith("t") || c.startsWith("t")) {
      if (isConnected(a, b) && isConnected(b, c) && isConnected(c, a)) {
        triplets.push([a, b, c]);
      }
    }
  }

  return triplets.length;
}

// Part 2
export function part2(input: InputType): string {
  const disconnected = new Map();
  for (const node of input.keys()) {
    disconnected.set(node, []);
  }

  for (const [a, b] of combinations(input.keys(), 2)) {
    const A = input.get(a) as Set<string>;
    if (!A.has(b)) {
      disconnected.get(a).push(b);
      disconnected.get(b).push(a);
    }
  }

  while (disconnected.size > 0) {
    let worstPC = "";
    let disconnectionCount = 0;
    for (const [currentPC, missing] of disconnected) {
      if (missing.length > disconnectionCount) {
        worstPC = currentPC;
        disconnectionCount = missing.length;
      }
    }

    if (disconnectionCount === 0 || !worstPC) {
      break;
    }

    disconnected.delete(worstPC);
    for (const missing of disconnected.values()) {
      const idx = missing.indexOf(worstPC);
      if (idx !== -1) missing.splice(idx, 1);
    }
  }

  return Array.from(disconnected.keys()).sort().join(",");
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
