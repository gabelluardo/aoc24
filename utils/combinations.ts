export function combinations<T>(arr: T[], length: number): T[][] {
    if (length === 0) {
        return [[]];
    }

    if (length === 1) {
        return arr.map((x) => [x]);
    }

    const result: T[][] = [];
    const subCombinations = combinations(arr, length - 1);

    for (const item of arr) {
        for (const sub of subCombinations) {
            result.push([item, ...sub]);
        }
    }

    return result;
}
