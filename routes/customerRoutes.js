const express = require("express")
const router = express.Router();
const customerController = require ("../controllers/customerController");
const authMiddleware = require ("../middleware/authMiddleware");
const roleMiddleware =require("../middleware/roleMiddleware")
// to add customers to database
router.post("/addcustomer" , authMiddleware , roleMiddleware("admin" , "user"),customerController.addRentCustomer);

//to get the property which dates are over
router.get("/available",authMiddleware, roleMiddleware("admin" , "user"),customerController.getAvailableProperties)

//to get rented properties List
router.get("/rented-list" ,authMiddleware, roleMiddleware("admin" , "user"),customerController.getRentedProperties);


module.exports = router;