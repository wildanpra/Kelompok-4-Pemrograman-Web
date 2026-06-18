const express = require("express");
const router = express.Router(); // Membuat instance router

const CustomerController = require("../controllers/CustomerController");

//Endpoint untuk mengakses halaman utama
router.get("/", (req, res) => {
    res.send("Hello express!");
})
router.get("/customers", CustomerController.index);
router.get("/customers/:id", CustomerController.show);

router.post("/customers", CustomerController.store);
router.put("/customers/:id", CustomerController.update);
router.delete("/customers/:id", CustomerController.delete);

module.exports = router;
