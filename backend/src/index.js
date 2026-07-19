require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectMongo = require("./config/mongo");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);

app.get("/", (req, res) => res.json({ status: "API running" }));

const PORT = process.env.PORT || 5000;

connectMongo()
  .catch((err) => console.error("Mongo connection failed:", err.message));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
