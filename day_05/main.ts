type InputType = {
  rules: [number, number][];
  pages: number[][];
};

function isOrdered(rules: [number, number][], nums: number[]): boolean {
  return rules.every(([before, after]) =>
    !nums.includes(before) ||
    !nums.includes(after) ||
    nums.indexOf(before) < nums.indexOf(after)
  );
}

function getMiddle(nums: number[]): number {
  return nums[Math.floor(nums.length / 2)];
}

export function parseInput(input: string): InputType {
  const [rules, pages] = input.split("\n\n");
  return {
    rules: rules.split("\n").map((r) =>
      r.split("|").map(Number) as [number, number]
    ),
    pages: pages.trim().split("\n").map((r) => r.split(",").map(Number)),
  };
}

// Part 1
export function part1(input: InputType): number {
  return input.pages
    .filter((p) => isOrdered(input.rules, p))
    .reduce((acc, p) => acc + getMiddle(p), 0);
}

function topologicalSort(pages: number[], rules: [number, number][]): number[] {
  const adj = new Map(pages.map((p) => [p, new Set<number>()]));
  const inDegree = new Map(pages.map((p) => [p, 0]));

  for (const [from, to] of rules) {
    if (pages.includes(from) && pages.includes(to)) {
      adj.get(from)?.add(to);
      inDegree.set(to, (inDegree.get(to) ?? 0) + 1);
    }
  }

  const result = [];
  const queue = pages.filter((p) => !inDegree.get(p));

  while (queue.length) {
    const node = queue.shift() ?? 0;
    result.push(node);

    for (const next of adj.get(node) ?? []) {
      const count = (inDegree.get(next) ?? 0) - 1;
      inDegree.set(next, count);
      if (count === 0) queue.push(next);
    }
  }

  return result;
}

// Part 2
export function part2(input: InputType): number {
  return input.pages
    .filter((p) => !isOrdered(input.rules, p))
    .map((p) => topologicalSort(p, input.rules))
    .reduce((acc, p) => acc + getMiddle(p), 0);
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
