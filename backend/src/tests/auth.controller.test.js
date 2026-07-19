const authController = require("../controllers/authController"); // Update path as needed
const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail } = require("../services/emailService");
const { logActivity } = require("../services/activityLogService");

jest.mock("../config/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}));
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../services/emailService");
jest.mock("../services/activityLogService");

describe("Auth Controller Unit Tests", () => {
  let req, res;

  beforeEach(() => {
    process.env.JWT_SECRET = "testsecret";
    req = { body: {}, user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("register()", () => {
    it("should return 400 if email or password is missing", async () => {
      req.body = { email: "", password: "" };
      await authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Email and password are required" });
    });

    it("should return 409 if email already exists", async () => {
      req.body = { name: "John", email: "john@example.com", password: "password123" };
      prisma.user.findUnique.mockResolvedValue({ id: 1, email: "john@example.com" });

      await authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: "Email already in use" });
    });

    it("should register a user successfully and return 201", async () => {
      req.body = { name: "John", email: "john@example.com", password: "password123" };
      prisma.user.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword");
      
      const mockCreatedUser = { id: 1, name: "John", email: "john@example.com", role: "user" };
      prisma.user.create.mockResolvedValue(mockCreatedUser);
      jwt.sign.mockReturnValue("mockedToken");

      await authController.register(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(prisma.user.create).toHaveBeenCalled();
      expect(sendWelcomeEmail).toHaveBeenCalledWith("john@example.com", "John");
      expect(logActivity).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        token: "mockedToken",
        user: mockCreatedUser,
      });
    });
  });

  describe("login()", () => {
    it("should return 401 if user is not found", async () => {
      req.body = { email: "wrong@example.com", password: "password" };
      prisma.user.findUnique.mockResolvedValue(null);

      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 401 if password verification fails", async () => {
      req.body = { email: "john@example.com", password: "wrongpassword" };
      prisma.user.findUnique.mockResolvedValue({ id: 1, password: "hashedPassword" });
      bcrypt.compare.mockResolvedValue(false);

      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should authenticate and return a token on success", async () => {
      req.body = { email: "john@example.com", password: "correctpassword" };
      const mockUser = { id: 1, name: "John", email: "john@example.com", password: "hashedPassword", role: "user" };
      
      prisma.user.findUnique.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("mockedToken");

      await authController.login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        token: "mockedToken",
        user: { id: 1, name: "John", email: "john@example.com", role: "user" },
      });
    });
  });

  describe("getProfile()", () => {
    it("should return 404 if profile user is missing", async () => {
      req.user = { id: 99 };
      prisma.user.findUnique.mockResolvedValue(null);

      await authController.getProfile(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return the profile data on success", async () => {
      req.user = { id: 1 };
      const mockUser = { id: 1, name: "John", email: "john@example.com", role: "user" };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await authController.getProfile(req, res);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  });

  describe("updateProfile()", () => {
    it("should compile update payload and return updated user profile", async () => {
      req.user = { id: 1 };
      req.body = { name: "John New", password: "newpassword" };
      bcrypt.hash.mockResolvedValue("newHashedPassword");
      
      const updatedUser = { id: 1, name: "John New", email: "john@example.com", role: "user" };
      prisma.user.update.mockResolvedValue(updatedUser);

      await authController.updateProfile(req, res);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: "John New", password: "newHashedPassword" },
      });
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });
  });
});