const router = require("express").Router();
const ctrl = require("../controllers/statsController");
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

router.get("/summary", auth, requireRole("admin"), ctrl.getSummary);

module.exports = router;
