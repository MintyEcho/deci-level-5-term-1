process.env.JWT_SECRET = "test_secret";

jest.mock("../config/prisma", () => ({
  product: {
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("../services/activityLogService", () => ({
  logActivity: jest.fn(),
}));

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const prisma = require("../config/prisma");

function tokenFor(role) {
  return jwt.sign({ id: 1, email: "user@example.com", role }, process.env.JWT_SECRET);
}

describe("GET /api/products", () => {
  afterEach(() => jest.clearAllMocks());

  it("returns paginated products", async () => {
    prisma.product.findMany.mockResolvedValue([{ id: 1, name: "Phone", price: 500 }]);
    prisma.product.count.mockResolvedValue(1);

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination.total).toBe(1);
  });
});

describe("POST /api/products", () => {
  afterEach(() => jest.clearAllMocks());

  it("rejects creation without a token", async () => {
    const res = await request(app).post("/api/products").send({ name: "New Product" });
    expect(res.status).toBe(401);
  });

  it("rejects creation from a non-admin user", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${tokenFor("customer")}`)
      .send({ name: "New Product", price: 10, categoryId: 1 });

    expect(res.status).toBe(403);
  });

  it("allows creation from an admin user", async () => {
    prisma.product.create.mockResolvedValue({ id: 5, name: "New Product", price: 10 });

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${tokenFor("admin")}`)
      .send({ name: "New Product", price: 10, categoryId: 1 });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("New Product");
  });
});
