type InputType = {
  towels: string[];
  designs: string[];
};

function canMakeDesign(
  design: string,
  towels: string[],
  memo = new Set<string>(),
): boolean {
  if (design === "") return true;
  if (memo.has(design)) return false;

  memo.add(design);

  for (const towel of towels) {
    if (design.startsWith(towel)) {
      if (canMakeDesign(design.slice(towel.length), towels, memo)) {
        return true;
      }
    }
  }

  return false;
}

function countArrangements(
  design: string,
  towels: string[],
  memo = new Map<string, number>(),
): number {
  if (design === "") return 1;
  if (memo.has(design)) return memo.get(design) as number;

  let count = 0;
  for (const towel of towels) {
    if (design.startsWith(towel)) {
      count += countArrangements(design.slice(towel.length), towels, memo);
    }
  }

  memo.set(design, count);
  return count;
}

export function parseInput(input: string): InputType {
  const [t, d] = input.trim().split("\n\n");

  const designs = d.split("\n").map((s) => s.trim());
  const towels = t.split(",")
    .map((s) => s.trim())
    .sort((a, b) => b.length - a.length);

  return { towels, designs };
}

export function part1(input: InputType): number {
  const { towels, designs } = input;
  return designs.filter((d) => canMakeDesign(d, towels)).length;
}

export function part2(input: InputType): number {
  const { towels, designs } = input;
  return designs.reduce(
    (sum, design) => sum + countArrangements(design, towels),
    0,
  );
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
