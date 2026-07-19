const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true },
    userId: { type: Number, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
