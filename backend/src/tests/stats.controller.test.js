const statsController = require("../controllers/statsController"); // Matches your statsController.js
const prisma = require("../config/prisma");
const Review = require("../models/Review");
const ActivityLog = require("../models/ActivityLog");

// Mocking the databases to isolate the controller logic
jest.mock("../config/prisma", () => ({
  user: { count: jest.fn() },
  product: { count: jest.fn() },
  order: { count: jest.fn() },
  category: { count: jest.fn() },
}));

jest.mock("../models/Review", () => ({ countDocuments: jest.fn() }));
jest.mock("../models/ActivityLog", () => ({
  find: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn(),
}));

describe("Stats Controller Unit Tests", () => {
  it("getSummary() should aggregate statistics cleanly across separate databases", async () => {
    const req = {};
    const res = { json: jest.fn() };

    // Setup mock resolution values
    prisma.user.count.mockResolvedValue(10);
    prisma.product.count.mockResolvedValue(50);
    prisma.order.count.mockResolvedValue(5);
    prisma.category.count.mockResolvedValue(4);
    Review.countDocuments.mockResolvedValue(100);
    
    ActivityLog.find.mockReturnThis();
    ActivityLog.sort.mockReturnThis();
    ActivityLog.limit.mockResolvedValue([{ action: "test" }]);

    // Execute the controller method
    await statsController.getSummary(req, res);

    // Verify the output matches the shape of your code's response
    expect(res.json).toHaveBeenCalledWith({
      users: 10,
      products: 50,
      orders: 5,
      categories: 4,
      reviews: 100,
      recentActivity: [{ action: "test" }],
    });
  });
});