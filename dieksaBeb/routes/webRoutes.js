const express = require("express");
const router = express.Router();
const customerController = require("../controllers/webControllers");

router.get("/", (req, res) => {
  res.send("Hello Landing Page!");
});

router.get("/customers", customerController.index);
router.get("/customers/:id", customerController.show);

module.exports = router;