const router = require("express").Router();
const ensureAuthenticated = require("../../middlewares/headers/ensureAuthenticated");

router.use("/orders", ensureAuthenticated, require("./orders"));

module.exports = router;
