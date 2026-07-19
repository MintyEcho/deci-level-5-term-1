const categoryController = require("../controllers/categoryController");
const prisma = require("../config/prisma");

jest.mock("../config/prisma", () => ({
  category: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("Category Controller Unit Tests", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  it("getAll() should return array of categories", async () => {
    const list = [{ id: 1, name: "Electronics" }];
    prisma.category.findMany.mockResolvedValue(list);

    await categoryController.getAll(req, res);
    expect(res.json).toHaveBeenCalledWith(list);
  });

  it("create() should build new category", async () => {
    req.body = { name: "Books" };
    prisma.category.create.mockResolvedValue({ id: 2, name: "Books" });

    await categoryController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 2, name: "Books" });
  });

  it("update() should update categorical name structure", async () => {
    req.params.id = "2";
    req.body = { name: "Novels" };
    prisma.category.update.mockResolvedValue({ id: 2, name: "Novels" });

    await categoryController.update(req, res);
    expect(prisma.category.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { name: "Novels" },
    });
    expect(res.json).toHaveBeenCalledWith({ id: 2, name: "Novels" });
  });

  it("remove() should safely target and destroy dynamic entity", async () => {
    req.params.id = "2";

    await categoryController.remove(req, res);
    expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: 2 } });
    expect(res.status).toHaveBeenCalledWith(204);
  });
});