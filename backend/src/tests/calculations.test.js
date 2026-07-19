const { calculateCartTotal, buildPaginationMeta } = require("../utils/calculations");

describe("calculateCartTotal", () => {
  it("returns 0 for an empty cart", () => {
    expect(calculateCartTotal([])).toBe(0);
  });

  it("sums price * quantity across items", () => {
    const items = [
      { product: { price: 10 }, quantity: 2 },
      { product: { price: 5 }, quantity: 3 },
    ];
    expect(calculateCartTotal(items)).toBe(35);
  });
});

describe("buildPaginationMeta", () => {
  it("computes total pages correctly", () => {
    expect(buildPaginationMeta({ page: 1, limit: 20, total: 45 })).toEqual({
      page: 1,
      limit: 20,
      total: 45,
      pages: 3,
    });
  });

  it("defaults page/limit when missing", () => {
    expect(buildPaginationMeta({ total: 10 })).toEqual({
      page: 1,
      limit: 20,
      total: 10,
      pages: 1,
    });
  });
});
