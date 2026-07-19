process.env.JWT_SECRET = "test_secret";

jest.mock("../config/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("../services/emailService", () => ({
  sendWelcomeEmail: jest.fn(),
}));

jest.mock("../services/activityLogService", () => ({
  logActivity: jest.fn(),
}));

const request = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../app");
const prisma = require("../config/prisma");

describe("POST /api/auth/register", () => {
  afterEach(() => jest.clearAllMocks());

  it("creates a new user and returns a token", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      role: "customer",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("test@example.com");
  });

  it("rejects registration when the email is already in use", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: "test@example.com" });

    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(409);
  });

  it("rejects registration when required fields are missing", async () => {
    const res = await request(app).post("/api/auth/register").send({ name: "No Email" });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  afterEach(() => jest.clearAllMocks());

  it("logs in with correct credentials", async () => {
    const hashed = await bcrypt.hash("password123", 10);
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      password: hashed,
      role: "customer",
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejects login with wrong password", async () => {
    const hashed = await bcrypt.hash("password123", 10);
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: "test@example.com",
      password: hashed,
      role: "customer",
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "wrongpass" });

    expect(res.status).toBe(401);
  });

  it("rejects login for a nonexistent user", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "password123" });

    expect(res.status).toBe(401);
  });
});
