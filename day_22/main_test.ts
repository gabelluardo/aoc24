import { assertEquals } from "@std/assert";
import { mix, nextSecret, part1, part2, prices, prune } from "./main.ts";

Deno.test("part1", () => {
  const testInput = [
    1,
    10,
    100,
    2024,
  ];

  assertEquals(part1(testInput), 37327623);
});

Deno.test("part2", () => {
  const testInput = [
    1,
    2,
    3,
    2024,
  ];

  assertEquals(part2(testInput), 23);
});

Deno.test("mix", () => {
  assertEquals(mix(15, 42), 37);
});

Deno.test("prune", () => {
  assertEquals(prune(100000000), 16113920);
});

Deno.test("generate", () => {
  const expected = [
    15887950,
    16495136,
    527345,
    704524,
    1553684,
    12683156,
    11100544,
    12249484,
    7753432,
    5908254,
  ];

  let secret = 123;
  const array = [];
  for (let i = 0; i < 10; i++) {
    secret = nextSecret(secret);
    array.push(secret);
  }

  assertEquals(array, expected);
});

Deno.test("variations", () => {
  const expected = [
    { value: 0, variation: -3 },
    { value: 6, variation: 6 },
    { value: 5, variation: -1 },
    { value: 4, variation: -1 },
    { value: 4, variation: 0 },
    { value: 6, variation: 2 },
    { value: 4, variation: -2 },
    { value: 4, variation: 0 },
    { value: 2, variation: -2 },
  ];

  const actual = prices(123, 9);

  assertEquals(actual.map((p) => p.value), expected.map((p) => p.value));
  assertEquals(
    actual.map((p) => p.variation),
    expected.map((p) => p.variation),
  );
});
