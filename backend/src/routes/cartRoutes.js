const router = require("express").Router();
const ctrl = require("../controllers/cartController");
const auth = require("../middlewares/auth");

router.get("/", auth, ctrl.getCart);
router.post("/items", auth, ctrl.addItem);
router.put("/items/:productId", auth, ctrl.updateItem);
router.delete("/items/:productId", auth, ctrl.removeItem);

module.exports = router;
