const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role} = req.body;
    const exist = await User.findOne({ email });

    if (exist) return res.status(400).json({ message: "User already exists" });

let assignedRole = role;
    const adminExit = await User.findOne({ role: "admin" });
    if (assignedRole === "admin" && adminExit) {
      return res.status(403).json({ message: "Admin already exist" });
    }
    if (!adminExit) {
      assignedRole = "admin";
    } else {
      assignedRole = "user";
    }
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed, role });

    res.json({ message: `User registered successfully with username ${name}` });
  } catch (err) {
    console.error("Something went wrong with signup process", err);
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with email ${email} not found` });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "10h" }
    );

   res.json({message: "Login successful", token, user: { id: user._id, email: user.email,role: user.role,name: user.name,},
});

  } catch (err) {
    console.error("Something went wrong with login process", err);
    res.status(500).json({ error: err.message });
  }
};
