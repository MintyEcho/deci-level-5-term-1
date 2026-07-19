const router = require("express").Router();
const ctrl = require("../controllers/categoryController");
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

router.get("/", ctrl.getAll);
router.post("/", auth, requireRole("admin"), ctrl.create);
router.put("/:id", auth, requireRole("admin"), ctrl.update);
router.delete("/:id", auth, requireRole("admin"), ctrl.remove);

module.exports = router;
