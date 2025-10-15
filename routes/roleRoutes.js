const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware")

//only admin can access
router.get("/admin" , authMiddleware, roleMiddleware("admin"), (req,res) =>{
    res.json({message :"Welcome admin"})
});

// All can access this
router.get("/user" ,authMiddleware,roleMiddleware("admin" , "user"), (req,res) =>{
    res.json({message :"Welcome user"})
});


module.exports = router ;