import { assertEquals } from "https://deno.land/std@0.129.0/testing/asserts.ts";

import { filterOutliers } from "./quartile.ts";

Deno.test("filterOutliers", () => {
  assertEquals(filterOutliers([1, 2, 3, 4, 5, 6], (x) => x), [
    1,
    2,
    3,
    4,
    5,
    6,
  ]);

  assertEquals(filterOutliers([-121, 2, 3, 4, 5, 3682], (x) => x), [
    2,
    3,
    4,
    5,
  ]);
});
