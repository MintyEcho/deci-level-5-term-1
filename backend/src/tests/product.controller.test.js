const productController = require("../controllers/productController");
const prisma = require("../config/prisma");
const { logActivity } = require("../services/activityLogService");

jest.mock("../config/prisma", () => ({
  product: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  productImage: {
    create: jest.fn(),
  },
  $transaction: jest.fn((promises) => Promise.all(promises)),
}));
jest.mock("../services/activityLogService");

describe("Product Controller Unit Tests", () => {
  let req, res;

  beforeEach(() => {
    req = { query: {}, params: {}, body: {}, user: { id: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("getAll()", () => {
    it("should process default paginated criteria, offsets and query counts", async () => {
      req.query = { search: "shoe", categoryId: "3", sort: "price_asc", page: "2", limit: "5" };
      prisma.product.findMany.mockResolvedValue([{ id: 1, name: "Running Shoes" }]);
      prisma.product.count.mockResolvedValue(12);

      await productController.getAll(req, res);

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: "shoe", mode: "insensitive" } },
            { description: { contains: "shoe", mode: "insensitive" } },
          ],
          categoryId: 3,
        },
        orderBy: { price: "asc" },
        skip: 5,
        take: 5,
        include: { category: true, images: true },
      });

      expect(res.json).toHaveBeenCalledWith({
        data: [{ id: 1, name: "Running Shoes" }],
        pagination: { page: 2, limit: 5, total: 12, pages: 3 },
      });
    });
  });

  describe("getOne()", () => {
    it("should return 404 if unique record does not exist", async () => {
      req.params.id = "99";
      prisma.product.findUnique.mockResolvedValue(null);

      await productController.getOne(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should output valid data payload directly if found", async () => {
      req.params.id = "1";
      prisma.product.findUnique.mockResolvedValue({ id: 1, name: "Gadget" });

      await productController.getOne(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: "Gadget" });
    });
  });

  describe("create()", () => {
    it("should instantiate entity, log operations and respond 201", async () => {
      req.body = { name: "Shirt", description: "Cool shirt", price: "25", stock: "10", categoryId: "2" };
      prisma.product.create.mockResolvedValue({ id: 5, name: "Shirt" });

      await productController.create(req, res);

      expect(prisma.product.create).toHaveBeenCalledWith({
        data: { name: "Shirt", description: "Cool shirt", price: 25, stock: 10, categoryId: 2 },
      });
      expect(logActivity).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("uploadImages()", () => {
    it("should throw a 400 error if files collection is entirely empty", async () => {
      req.params.id = "1";
      req.files = [];

      await productController.uploadImages(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should run bulk file creation via Prisma database transaction processing", async () => {
      req.params.id = "4";
      req.files = [{ filename: "img1.png" }, { filename: "img2.png" }];
      prisma.productImage.create.mockImplementation(({ data }) => Promise.resolve(data));

      await productController.uploadImages(req, res);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });
});