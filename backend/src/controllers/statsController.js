const prisma = require("../config/prisma");
const Review = require("../models/Review");
const ActivityLog = require("../models/ActivityLog");

exports.getSummary = async (req, res) => {
  const [userCount, productCount, orderCount, categoryCount, reviewCount, recentActivity] =
    await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.category.count(),
      Review.countDocuments(),
      ActivityLog.find().sort({ createdAt: -1 }).limit(10),
    ]);

  res.json({
    users: userCount,
    products: productCount,
    orders: orderCount,
    categories: categoryCount,
    reviews: reviewCount,
    recentActivity,
  });
};
