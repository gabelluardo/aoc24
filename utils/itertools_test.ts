import { permutations, permutationsWithReplacement } from "./itertools.ts";
import { assertEquals } from "jsr:@std/assert";

Deno.test("permutations", () => {
    const test = Array.from(permutations([1, 2, 3, 4], 2));

    assertEquals(test, [
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 1],
        [2, 3],
        [2, 4],
        [3, 1],
        [3, 2],
        [3, 4],
        [4, 1],
        [4, 2],
        [4, 3],
    ]);
});

Deno.test("permutations - empty array", () => {
    const test = Array.from(permutations([], 2));
    assertEquals(test, []);
});

Deno.test("permutations - length greater than array", () => {
    const test = Array.from(permutations([1, 2], 3));
    assertEquals(test, []);
});

Deno.test("permutations - negative length", () => {
    const test = Array.from(permutations([1, 2], -1));
    assertEquals(test, []);
});

Deno.test("permutations - objects", () => {
    const input = [{ id: 1 }, { id: 2 }];
    const test = Array.from(permutations(input, 2));
    assertEquals(test, [
        [{ id: 1 }, { id: 2 }],
        [{ id: 2 }, { id: 1 }],
    ]);
});

Deno.test("permutationWithRepetition - full length", () => {
    const test = Array.from(permutationsWithReplacement([1, 2], 2));
    assertEquals(test, [
        [1, 1],
        [1, 2],
        [2, 1],
        [2, 2],
    ]);
});

Deno.test("permutationWithRepetition - specific length", () => {
    const test = Array.from(permutationsWithReplacement([1, 2, 3], 2));
    assertEquals(test, [
        [1, 1],
        [1, 2],
        [1, 3],
        [2, 1],
        [2, 2],
        [2, 3],
        [3, 1],
        [3, 2],
        [3, 3],
    ]);
});

Deno.test("permutationWithRepetition - length 1", () => {
    const test = Array.from(permutationsWithReplacement([1, 2, 3], 1));
    assertEquals(test, [[1], [2], [3]]);
});

Deno.test("permutationWithRepetition - length 0", () => {
    const test = Array.from(permutationsWithReplacement([1, 2, 3], 0));
    assertEquals(test, [[]]);
});

Deno.test("permutationWithRepetition - strings", () => {
    const test = Array.from(permutationsWithReplacement(["a", "b"], 2));
    assertEquals(test, [
        ["a", "a"],
        ["a", "b"],
        ["b", "a"],
        ["b", "b"],
    ]);
});

Deno.test("permutationsWithReplacement - empty array", () => {
    const test = Array.from(permutationsWithReplacement([], 2));
    assertEquals(test, []);
});
