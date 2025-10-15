require("dotenv").config();
const express = require("express");
const router = express.Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET);
const authMiddleware = require("../middleware/authMiddleware");
const Customer = require("../models/customer");
const sendEmail = require("../utils/sendEmail");
const roleMiddleware =require("../middleware/roleMiddleware")
router.post("/create-payment", authMiddleware,roleMiddleware("admin" , "user"), async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ message: "amount is required" });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: process.env.CASHIER_CURRENCY,
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("stripe error", err);
    res.status(500).json({ message: "payment failed ", error: err.message });
  }
});

router.post("/send-email-confirmation", async (req, res) => {
  try {
    const { amount, email, name, startDate, endDate } = req.body;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="text-align: center;">
            <img src="https://media.istockphoto.com/id/1378442944/vector/real-estate-logo-design-vector-templates.jpg?s=612x612&w=0&k=20&c=BHpnD9-tRxNSEhDzxL_xgcWpfQLzNvUeVlKF3m_wfDI=" alt="Company Logo" width="120" style="margin-bottom: 15px;" />
            <h2 style="color: #2e86de;">Property Rent Confirmation</h2>
          </div>
          <p>Dear <strong>${name || "Customer"}</strong>,</p>
          <p>We are pleased to inform you that your payment has been <strong style="color:green;">successfully received</strong>.</p>

          <div style="background-color: #f1f1f1; padding: 15px; border-radius: 8px; margin-top: 15px;">
            <p><strong>Contract Details:</strong></p>
            <p>Start Date: ${
              startDate ? new Date(startDate).toLocaleDateString() : "N/A"
            }</p>
            <p>End Date: ${
              endDate ? new Date(endDate).toLocaleDateString() : "N/A"
            }</p>
            <p>Payment Amount: <strong>$${amount}</strong></p>
            <p>Status: <strong style="color: green;">Paid</strong></p>
          </div>
           <div style="text-align: center; margin-top: 30px;">
            <a href="http://localhost:5000/login" 
              style="
                background-color: #2e86de;
                color: white;
                padding: 12px 25px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: bold;
                display: inline-block;
              ">
              Login to Your Account
            </a>
          </div>

          <p style="margin-top: 20px;">If you have any questions, feel free to reach out to our support team.</p>

          <p style="text-align: center; color: #888; font-size: 12px; margin-top: 25px;">
            &copy; ${new Date().getFullYear()} Property Management. All rights reserved.
          </p>
        </div>
      </div>
    `;

    await sendEmail(email, "Payment Confirmation", htmlContent);

    res.status(200).json({ message: "email sent successfully" });
  } catch (err) {
    console.error("email error:", err);
    res
      .status(500)
      .json({ message: "Failed to send email", error: err.message });
  }
});

module.exports = router;
