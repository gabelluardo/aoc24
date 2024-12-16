import { equal } from "@std/assert/equal";

type InputType = {
  map: Grid;
  moves: Direction[];
};

type Grid = string[][];

type Position = [number, number];

type World = {
  boxes: Map<string, string>;
  walls: Set<string>;
  revBoxes: Map<string, Item | Position>;
  hight: number;
  width: number;
};

type Item = {
  pos1: Position;
  pos2: Position;
};

type Direction = {
  dx: number;
  dy: number;
};

const directions = new Map<string, Direction>([
  ["^", { dx: -1, dy: 0 }], // up
  ["v", { dx: 1, dy: 0 }], // down
  [">", { dx: 0, dy: 1 }], // right
  ["<", { dx: 0, dy: -1 }], // left
]);

function findStart(map: Grid): Position {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] === "@") {
        return [i, j];
      }
    }
  }

  return [0, 0];
}

function wideMap(map: Grid): Grid {
  const rules = new Map([
    ["#", "##".split("")],
    ["O", "[]".split("")],
    [".", "..".split("")],
    ["@", "@.".split("")],
  ]);

  return map.map((r) => r.flatMap((t) => rules.get(t) ?? ""));
}

function _printWorld(world: World, pos: Position) {
  const { hight, width } = world;

  for (let i = 0; i < hight; i++) {
    let s = "";
    for (let j = 0; j < width; j++) {
      const key = [i, j].toString();
      if (world.boxes.has(key)) {
        s += "[]";
        j++;
      } else if (world.walls.has(key)) {
        s += "#";
      } else if (equal(pos, [i, j])) {
        s += "@";
      } else {
        s += ".";
      }
    }
    console.log(s);
  }
  console.log();
}

function checkMove(
  pos: string,
  { dx, dy }: Direction,
  world: World,
): string[] {
  const boxes = [world.boxes.get(pos) ?? ""];
  const [x, y] = pos.split(",").map(Number);

  let [ix, iy] = [x + dx, y + dy];
  let next = [ix, iy].toString();
  while (world.boxes.has(next)) {
    boxes.push(world.boxes.get(next) ?? "");

    [ix, iy] = [ix + dx, iy + dy];
    next = [ix, iy].toString();
  }

  if (world.walls.has(next)) {
    return [];
  }

  return boxes;
}

function checkMoveWide(
  pos: string,
  direction: Direction,
  world: World,
): string[] {
  function checkPositions(positions: Position[]) {
    for (const p of positions) {
      const pos = p.toString();
      if (world.boxes.has(pos)) {
        const id = world.boxes.get(pos) as string;
        if (!stack.includes(id)) {
          stack.push(id);
        }
        boxes.add(id);
      }
    }
  }

  const { dx, dy } = direction;
  const dirs = Array.from(directions.values());

  const id = world.boxes.get(pos) as string;
  const boxes = new Set([id]);
  const stack = [id];

  while (stack.length > 0) {
    const curr = stack.pop() as string;

    const { pos1, pos2 } = world.revBoxes.get(curr) as Item;

    const [x1, y1] = pos1;
    const [x2, y2] = pos2;

    const nextPos1 = [x1 + dx, y1 + dy] as Position;
    const nextPos2 = [x2 + dx, y2 + dy] as Position;

    if (
      world.walls.has(nextPos1.toString()) ||
      world.walls.has(nextPos2.toString())
    ) {
      return [];
    }

    if (equal(direction, dirs[0]) || equal(direction, dirs[1])) { // up or down
      checkPositions([nextPos1, nextPos2]);
    } else if (equal(direction, dirs[2])) { // right
      checkPositions([nextPos2]);
    } else if (equal(direction, dirs[3])) { // left
      checkPositions([nextPos1]);
    }
  }

  return Array.from(boxes);
}

function getInfo(map: Grid): World {
  const boxes = new Map();
  const walls = new Set<string>();
  const revBoxes = new Map();

  const hight = map.length;
  const width = map[0].length;

  for (let i = 0; i < hight; i++) {
    for (let j = 0; j < width; j++) {
      if (map[i][j] === "O") {
        const key = `box_${boxes.size}`;

        revBoxes.set(key, [i, j]);
        boxes.set([i, j].toString(), key);
      } else if (map[i][j] === "#") {
        walls.add([i, j].toString());
      }
    }
  }

  return { boxes, walls, revBoxes, hight, width };
}

function getInfoWide(map: Grid): World {
  const boxes = new Map();
  const walls = new Set<string>();
  const revBoxes = new Map();

  const hight = map.length;
  const width = map[0].length;

  for (let i = 0; i < hight; i++) {
    for (let j = 0; j < width; j++) {
      if (map[i][j] === "[") {
        const key = `box_${boxes.size / 2}`;

        revBoxes.set(key, { pos1: [i, j], pos2: [i, j + 1] });
        boxes.set([i, j].toString(), key);
        boxes.set([i, j + 1].toString(), key);
      } else if (map[i][j] === "#") {
        walls.add([i, j].toString());
      }
    }
  }

  return { boxes, walls, revBoxes, hight, width };
}

export function parseInput(input: string): InputType {
  const [map, moves] = input.split("\n\n");

  return {
    map: map.split("\n").map((s) => s.split("")),
    moves: moves.split("\n").flatMap((m) =>
      m.split("").map((m) => directions.get(m) ?? { dx: 0, dy: 0 })
    ),
  };
}

// Part 1
export function part1(input: InputType): number {
  const { map, moves } = structuredClone(input);
  const world = getInfo(map);
  const { walls, boxes, revBoxes } = world;

  let curr = findStart(map);
  for (const { dx, dy } of moves) {
    const [x, y] = curr;
    const [nx, ny] = [x + dx, y + dy];

    const next = [nx, ny].toString();
    if (walls.has(next)) continue;

    if (boxes.has(next)) {
      const toMove = checkMove(next, { dx, dy }, world);

      if (toMove.length === 0) continue;

      for (const id of toMove) {
        const [xx, yy] = revBoxes.get(id) as Position;
        const nextPos = [xx + dx, yy + dy] as Position;

        revBoxes.set(id, nextPos);
      }

      // update boxes info
      boxes.clear();
      for (const [k, v] of revBoxes) {
        boxes.set(v.toString(), k);
      }
    }

    curr = [nx, ny];
  }

  return revBoxes.values().map((v) => v as Position).reduce(
    (acc, [x, y]) => acc + x * 100 + y,
    0,
  );
}

// Part 2
export function part2(input: InputType): number {
  const { map: old, moves } = structuredClone(input);
  const map = wideMap(old);
  const world = getInfoWide(map);

  const { walls, boxes, revBoxes } = world;

  let curr = findStart(map);
  for (const { dx, dy } of moves) {
    const [x, y] = curr;
    const [nx, ny] = [x + dx, y + dy];

    const next = [nx, ny].toString();
    if (walls.has(next)) continue;

    if (boxes.has(next)) {
      const toMove = checkMoveWide(next, { dx, dy }, world);

      if (toMove.length === 0) continue;

      for (const id of toMove) {
        const { pos1, pos2 } = revBoxes.get(id) as Item;
        const [x1, y1] = pos1;
        const [x2, y2] = pos2;

        revBoxes.set(id, {
          pos1: [x1 + dx, y1 + dy],
          pos2: [x2 + dx, y2 + dy],
        });
      }

      // update boxes info
      boxes.clear();
      for (const [k, v] of revBoxes) {
        const { pos1, pos2 } = v as Item;
        boxes.set(pos1.toString(), k);
        boxes.set(pos2.toString(), k);
      }
    }

    curr = [nx, ny];
  }

  return revBoxes.values().map((v) => v as Item).reduce(
    (acc, { pos1: [x, y] }) => acc + x * 100 + y,
    0,
  );
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
