require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectMongo = require("./config/mongo");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => res.json({ status: "API running" }));

const PORT = process.env.PORT || 5000;

connectMongo()
  .catch((err) => console.error("Mongo connection failed:", err.message));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
