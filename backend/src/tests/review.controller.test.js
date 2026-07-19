const reviewController = require("../controllers/reviewController");
const Review = require("../models/Review");

// Complete isolation of Mongoose Model instances
jest.mock("../models/Review", () => {
  return {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  };
});

describe("Review Controller Unit Tests", () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {}, user: { id: "user123", role: "user" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  it("getForProduct() should list inverted chronological reviews for a product", async () => {
    req.params.productId = "100";
    Review.find.mockReturnThis();
    Review.sort.mockResolvedValue([{ rating: 5, comment: "Awesome!" }]);

    await reviewController.getForProduct(req, res);

    expect(Review.find).toHaveBeenCalledWith({ productId: 100 });
    expect(Review.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(res.json).toHaveBeenCalledWith([{ rating: 5, comment: "Awesome!" }]);
  });

  it("create() should build new instance document successfully", async () => {
    req.params.productId = "100";
    req.body = { rating: 4, comment: "Good stuff" };
    Review.create.mockResolvedValue({ id: "rev_abc", productId: 100, rating: 4 });

    await reviewController.create(req, res);

    expect(Review.create).toHaveBeenCalledWith({
      productId: 100,
      userId: "user123",
      rating: 4,
      comment: "Good stuff",
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  describe("remove()", () => {
    it("should return 403 if user is neither author nor admin resource modifier", async () => {
      req.params.id = "rev_abc";
      const mockReview = { userId: "someone_else", role: "user", deleteOne: jest.fn() };
      Review.findById.mockResolvedValue(mockReview);

      await reviewController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(mockReview.deleteOne).not.toHaveBeenCalled();
    });

    it("should allow a direct author to safely delete review details", async () => {
      req.params.id = "rev_abc";
      const mockReview = { userId: "user123", deleteOne: jest.fn() };
      Review.findById.mockResolvedValue(mockReview);

      await reviewController.remove(req, res);

      expect(mockReview.deleteOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});