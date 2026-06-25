const express = require("express");
const router = express.Router(); // Membuat instance router

const CustomerController = require("../controllers/CustomerController");
const DealController = require("../controllers/DealController");
const UsersController = require("../controllers/UsersController");
const LeadController = require("../controllers/LeadController");
const ActivitiesController = require("../controllers/ActivitiesController");
const ContactsController = require("../controllers/ContactController");
const DashboardController = require("../controllers/DashboardController");
const AuthController = require("../controllers/AuthController");
const auth = require("../middleware/auth");

//Endpoint untuk mengakses halaman utama
router.get("/", (req, res) => {
  res.send("Hello express!");
});

router.post("/register", (req, res) => AuthController.register(req, res));
router.post("/login", (req, res) => AuthController.login(req, res));

router.get("/dashboard", auth, (req, res) =>
  DashboardController.index(req, res),
);

router.get("/customers", auth, CustomerController.index);
router.get("/customers/:id", auth, CustomerController.show);
router.post("/customers", auth, CustomerController.store);
router.put("/customers/:id", auth, CustomerController.update);
router.delete("/customers/:id", auth, CustomerController.destroy);

//Routing Contact
router.get("/contacts", ContactsController.index);
router.get("/contacts/:id", ContactsController.show);
router.post("/contacts", ContactsController.store);
router.put("/contacts/:id", ContactsController.update);
router.delete("/contacts/:id", ContactsController.destroy);

//Routing Activities
router.get("/activities", auth, ActivitiesController.index);
router.get("/activities/:id", auth, ActivitiesController.show);
router.post("/activities", auth, ActivitiesController.store);
router.put("/activities/:id", auth, ActivitiesController.update);
router.delete("/activities/:id", auth, ActivitiesController.destroy);

//Routing Contacts
router.get("/contacts", ContactsController.index);
router.get("/contacts/:id", ContactsController.show);

//Routing Leads
router.get("/leads", LeadController.index);
router.get("/leads/:id", LeadController.show);
router.post("/leads", LeadController.store);
router.put("/leads/:id", LeadController.update);
router.delete("/leads/:id", LeadController.destroy);

//Routing deals
router.get("/deals", DealController.index);
router.get("/deals/:id", DealController.show);
router.post("/deals", DealController.store);

//Routing Users
router.get("/users", UsersController.index);
router.get("/users/:id", UsersController.show);
router.post("/users", UsersController.store);

module.exports = router;
