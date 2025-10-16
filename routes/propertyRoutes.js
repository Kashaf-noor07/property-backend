const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");
const authMiddleware= require("../middleware/authMiddleware")
const {upload, uploadToVercelBlob} = require("../middleware/uploadBlob")

const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/add",
  upload.array("images"),
  uploadToVercelBlob,
  authMiddleware,
  roleMiddleware("admin"),
  propertyController.addProperty
);
//update
router.put(
  "/update/:id",
  upload.array("images"),
  uploadToVercelBlob,
  authMiddleware,
  roleMiddleware("admin"),
  propertyController.updateProperty
);


// GET /api/properties
router.get("/list",authMiddleware,roleMiddleware("admin"),propertyController.getProperties);

//to get active property to form
router.get("/active",authMiddleware,roleMiddleware("admin" , "user"), propertyController.getActiveProperty);

//delte property
router.delete("/delete/:id",authMiddleware,roleMiddleware("admin"),propertyController.deleteProperty);

//fetch update property
router.get("/:id",authMiddleware,roleMiddleware("admin"),propertyController.getProperty);

//to toggel property
router.patch("/toggle/:id", authMiddleware,roleMiddleware("admin"), propertyController.togglePropertyStatus);



module.exports = router;
