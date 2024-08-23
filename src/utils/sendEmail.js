import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); //config env

export const transporter = nodemailer.createTransport({
  service: process.env.Email_service,
  auth: {
    user: process.env.Email_user,
    pass: process.env.Email_password,
  },
});
