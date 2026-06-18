const express = require("express");
const router = express.Router(); // Membuat instance router

const CustomerController = require("../controllers/CustomerController");
const DealController = require("../controllers/DealController");

//Endpoint untuk mengakses halaman utama
router.get("/", (req, res) => {
  res.send("Hello express!");
});
router.get("/customers", CustomerController.index);
router.get("/customers/:id", CustomerController.show);

router.post("/customers", CustomerController.store);
router.put("/customers/:id", CustomerController.update);
router.delete("/customers/:id", CustomerController.delete);

//Routing deals
router.get("/deals", DealController.index);
router.get("/deals/:id", DealController.show);

module.exports = router;
