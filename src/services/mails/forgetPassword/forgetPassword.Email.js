import jwt from "jsonwebtoken";
import { forgetPasswordLayout } from "./template.js";
// import { transporter } from "../../../utils/sendEmail.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.Email_user,
    pass: process.env.Email_password,
  },
});

export const forgetPasswordEmail = async ({ email, OTP }) => {
  try {
    // Generate a token that expires in 15 minutes
    const token = jwt.sign({ email, OTP }, process.env.SECRETKEY, { expiresIn: '15m' });

    // Create a reset link that includes the token
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Send the email
    const info = await transporter.sendMail({
      from: ` 'Mazen Sherif' <${process.env.EMAIL_NAME}>`, // sender address
      to: email, // recipient address
      subject: "Reset Your Password", // subject line
      html: forgetPasswordLayout({ OTP, resetLink }).toString(), // email body
    });

    return info;
  } catch (error) {
    console.error('Error sending reset password email:', error);
    return undefined;
  }
};
