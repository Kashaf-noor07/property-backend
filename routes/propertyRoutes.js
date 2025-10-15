const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");
const authMiddleware= require("../middleware/authMiddleware")
const upload = require ('../middleware/upload');
const roleMiddleware = require("../middleware/roleMiddleware");


// POST /api/properties
router.post("/add",upload.array("images"),authMiddleware,roleMiddleware("admin"), propertyController.addProperty);

// GET /api/properties
router.get("/list",authMiddleware,roleMiddleware("admin"),propertyController.getProperties);

//to get active property to form
router.get("/active",authMiddleware,roleMiddleware("admin" , "user"), propertyController.getActiveProperty);

//delte property
router.delete("/delete/:id",authMiddleware,roleMiddleware("admin"),propertyController.deleteProperty);

//fetch update property
router.get("/:id",authMiddleware,roleMiddleware("admin"),propertyController.getProperty);

//update property
router.put("/update/:id" , upload.array("images"),authMiddleware,roleMiddleware("admin"),propertyController.updateProperty);

//to toggel property
router.patch("/toggle/:id", authMiddleware,roleMiddleware("admin"), propertyController.togglePropertyStatus);



module.exports = router;
