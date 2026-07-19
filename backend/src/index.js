const app = require("./app");
const connectMongo = require("./config/mongo");

const PORT = process.env.PORT || 5000;

connectMongo().catch((err) => console.error("Mongo connection failed:", err.message));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
