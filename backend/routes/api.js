const express = require("express");
const router = express.Router(); // Membuat instance router

const CustomerController = require("../controllers/CustomerController");
const DealController = require("../controllers/DealController");
const UsersController = require("../controllers/UsersController");
const LeadController = require("../controllers/LeadController");
const Activitiesontroller = require("../controllers/ActivitiesController");
const ContactsController = require("../controllers/ContactController");

//Endpoint untuk mengakses halaman utama
router.get("/", (req, res) => {
  res.send("Hello express!");
});
router.get("/customers", CustomerController.index);
router.get("/customers/:id", CustomerController.show);
router.post("/customers", CustomerController.store);
router.put("/customers/:id", CustomerController.update);
router.delete("/customers/:id", CustomerController.destroy);

//Routing Activities
router.get("/activities", Activitiesontroller.index);
router.get("/activities/:id", Activitiesontroller.show);

//Routing Contacts
router.get("/contacts", ContactsController.index);
router.get("/contacts/:id", ContactsController.show);

//Routing deals
router.get("/deals", DealController.index);
router.get("/deals/:id", DealController.show);

//Routing Users
router.get("/users", UsersController.index);
router.get("/users/:id", UsersController.show);

module.exports = router;
