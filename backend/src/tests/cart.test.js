process.env.JWT_SECRET = "test_secret";

jest.mock("../config/prisma", () => ({
  cart: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  cartItem: {
    upsert: jest.fn(),
  },
}));

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const prisma = require("../config/prisma");

function tokenFor(role) {
  return jwt.sign({ id: 1, email: "user@example.com", role }, process.env.JWT_SECRET);
}

describe("GET /api/cart", () => {
  afterEach(() => jest.clearAllMocks());

  it("rejects requests without a token", async () => {
    const res = await request(app).get("/api/cart");
    expect(res.status).toBe(401);
  });

  it("returns the cart with a computed total", async () => {
    prisma.cart.findUnique
      .mockResolvedValueOnce({ id: 1, userId: 1 })
      .mockResolvedValueOnce({
        id: 1,
        userId: 1,
        items: [{ id: 1, productId: 1, quantity: 2, product: { price: 25 } }],
      });

    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${tokenFor("customer")}`);

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(50);
  });
});

describe("POST /api/cart/items", () => {
  afterEach(() => jest.clearAllMocks());

  it("adds an item to the cart", async () => {
    prisma.cart.findUnique.mockResolvedValue({ id: 1, userId: 1 });
    prisma.cartItem.upsert.mockResolvedValue({ id: 1, cartId: 1, productId: 2, quantity: 1 });

    const res = await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${tokenFor("customer")}`)
      .send({ productId: 2, quantity: 1 });

    expect(res.status).toBe(201);
    expect(res.body.productId).toBe(2);
  });
});
