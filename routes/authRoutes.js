const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware =require("../middleware/roleMiddleware")
// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);
 
//  protected route
router.get("/home", authMiddleware,roleMiddleware("admin" , "user"), (req, res) => {
  res.json({ message: `Welcome ${req.user.email}, you are authenticated` });
});

module.exports = router;
