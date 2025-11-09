require("dotenv").config();

const nodemailer = require("nodemailer");

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;


async function sendVerificationEmail(to, subject, body) {

  if (!to) {
    console.log("No recipient email defined");
    return;
  }
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"ToyVerse" <${EMAIL_USER}>`,
    to,
    subject,
    html: body,
  };

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error("❌ EMAIL_USER or EMAIL_PASS missing from .env");
  }

  await transporter.verify(); 

  await transporter.sendMail(mailOptions); //can send mail to user
  console.log("Email going to nodemailer:", to);

}

module.exports = sendVerificationEmail;
