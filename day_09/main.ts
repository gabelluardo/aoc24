type InputType = {
  files: Map<number, SpanInfo>;
  free: SpanInfo[];
  disk: number[];
};

type SpanInfo = {
  start: number;
  length: number;
};

export function parseInput(input: string): InputType {
  const d = input.trim().split("").map(Number);
  const free = [];
  const files = new Map();
  const disk = new Array(d.reduce((a, b) => a + b, 0));

  let pos = 0;
  let id = 0;

  for (let i = 0; i < d.length; i += 2) {
    const fileLength = d[i];
    const spaceLength = d[i + 1] || 0;

    files.set(id, { start: pos, length: fileLength });
    disk.fill(id++, pos, pos + fileLength);
    pos += fileLength;

    if (spaceLength) {
      free.push({ start: pos, length: spaceLength });
      disk.fill(-1, pos, pos + spaceLength);
      pos += spaceLength;
    }
  }

  return { files, free, disk };
}

// Part 1
export function part1(input: InputType): number {
  const { disk } = structuredClone(input);

  let left = 0;
  let right = disk.length - 1;

  while (left < right) {
    while (left < right && disk[left] !== -1) {
      left++;
    }
    while (left < right && disk[right] === -1) {
      right--;
    }
    if (left < right) {
      [disk[left], disk[right]] = [disk[right], disk[left]];
    }
  }

  // Calcolo checksum
  return disk.filter((n) => n >= 0).reduce((acc, n, i) => acc + n * i, 0);
}

// Part 2
export function part2(input: InputType): number {
  const { files, free, disk } = input;

  const fileIds = Array.from(files.keys()).sort((a, b) => b - a);

  for (const fileId of fileIds) {
    const info = files.get(fileId);
    if (!info) continue;

    const fileLength = info.length;
    const fileStart = info.start;

    const spanIndex = free.findIndex(
      (s) => s.length >= fileLength && s.start <= fileStart,
    );

    if (spanIndex === -1) continue;

    const span = free[spanIndex];
    for (let j = 0; j < fileLength; j++) {
      [disk[span.start + j], disk[fileStart + j]] = [fileId, -1];
    }

    if (span.length === fileLength) {
      free.splice(spanIndex, 1);
    } else {
      span.start += fileLength;
      span.length -= fileLength;
    }
  }

  return disk.map((n) => n >= 0 ? n : 0).reduce((acc, n, i) => acc + n * i, 0);
}

if (import.meta.main) {
  const input = await Deno.readTextFile("./input");
  const lines = parseInput(input);

  console.log("Part 1:", part1(lines));
  console.log("Part 2:", part2(lines));
}
