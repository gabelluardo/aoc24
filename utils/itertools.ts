export function* permutationsWithReplacement<T>(
    iterables: Iterable<T>,
    r: number,
): Generator<T[]> {
    const pool = [...iterables];
    let result: T[][] = [[]];
    for (let i = 0; i < r; i++) {
        result = result.flatMap((x) => pool.map((y) => [...x, y]));
    }
    for (const prod of result) {
        yield prod;
    }
}

export function* permutations<T>(
    iterable: Iterable<T>,
    r: number,
): Generator<T[]> {
    const pool = [...iterable];
    const n = pool.length;
    for (const indices of permutationsWithReplacement(range(n), r)) {
        if (new Set(indices).size === r) {
            yield indices.map((i) => pool[i]);
        }
    }
}

function range(n: number): number[] {
    if (!Number.isInteger(n) || n < 0) {
        throw RangeError("n must be a non-negative integer");
    }
    const result = Array(n);
    for (let i = 0; i < n; i++) {
        result[i] = i;
    }
    return result;
}
