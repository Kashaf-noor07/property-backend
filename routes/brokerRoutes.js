const express = require("express");
const router = express.Router();
const brokerController =  require('../controllers/brokerController')
const authMiddleware= require("../middleware/authMiddleware")
const roleMiddleware =require("../middleware/roleMiddleware")


// POST 
router.post("/addbroker",authMiddleware,roleMiddleware("admin"), brokerController.addBrokers);

// GET  broker in table
router.get("/listbroker",authMiddleware,roleMiddleware("admin"),brokerController.getBrokers);

// Delete broker by id
router.delete("/deletebroker/:id",authMiddleware,roleMiddleware("admin"),brokerController.deleteBrokers);


//update broker
router.put("/updatebroker/:id" , authMiddleware,roleMiddleware("admin"), brokerController.updateBrokers)


//fetch single broker from mongodb to update form with prefilled fields
router.get("/getbrokers/:id", authMiddleware,roleMiddleware("admin"), brokerController.getBroker)

//togglestatus
router.patch("/broker/toggle/:id" , authMiddleware,roleMiddleware("admin"), brokerController.toggleBrokerStatus)


//get active brokers
router.get("/broker/active", authMiddleware,roleMiddleware("admin"),brokerController.getActiveBrokers )

module.exports = router;