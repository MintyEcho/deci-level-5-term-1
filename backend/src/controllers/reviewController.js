const Review = require("../models/Review");

exports.getForProduct = async (req, res) => {
  const reviews = await Review.find({ productId: Number(req.params.productId) }).sort({
    createdAt: -1,
  });
  res.json(reviews);
};

exports.create = async (req, res) => {
  const { rating, comment } = req.body;
  const review = await Review.create({
    productId: Number(req.params.productId),
    userId: req.user.id,
    rating,
    comment,
  });
  res.status(201).json(review);
};

exports.remove = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ error: "Not found" });
  if (review.userId !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  await review.deleteOne();
  res.status(204).send();
};
