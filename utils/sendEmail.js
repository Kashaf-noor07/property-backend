const nodemailer = require ("nodemailer")
require('dotenv').config(); 

const sendEmail= async(to,subject,htmlContent) =>{
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
        });

        const mailOptions= {
            from: `"Property Management " <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html : htmlContent,

        }
        await transporter.sendMail(mailOptions);
        console.log("email sent successfully to:" , to)
        
    } catch (err) {
        console.error("error sending a email" , err)
    }
}
module.exports = sendEmail;