const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('../config/db');
const authRoutes = require('../routes/authRoutes');
const propertyRoutes = require('../routes/propertyRoutes')
const brokerRoutes = require('../routes/brokerRoutes')
const upload = require('../middleware/upload')
const customerRoutes = require('../routes/customerRoutes')
const paymentRoutes = require('../routes/paymentRoutes')
const roleRoutes = require("../routes/roleRoutes")
require('dotenv').config(); 

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use ("/upload", express.static("upload"))


// Connect DB
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/role", roleRoutes);
app.use("/property", propertyRoutes);
app.use("/broker", brokerRoutes);
app.use("/customer" , customerRoutes);
app.use("/payment" , paymentRoutes);



// Test route
app.get("/", (req, res) => {
  res.send("API working fine ✅");
});


if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}


module.exports = app;