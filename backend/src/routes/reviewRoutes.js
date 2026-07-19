const router = require("express").Router({ mergeParams: true });
const ctrl = require("../controllers/reviewController");
const auth = require("../middlewares/auth");

router.get("/", ctrl.getForProduct);
router.post("/", auth, ctrl.create);
router.delete("/:id", auth, ctrl.remove);

module.exports = router;
