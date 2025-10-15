const jwt = require("jsonwebtoken");
const SECRET_KEY = "mySecretKey";

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied, token missing" });
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = {
      id: verified.id || verified._id,
      email: verified.email,
     role : verified.role
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = authMiddleware;
