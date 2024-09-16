import jwt from "jsonwebtoken";
import { confirmationLayout } from "./temaplate.js";
// import { transporter } from "../../../utils/sendEmail.js";
import nodemailer from "nodemailer";

const confirmEmail = async (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.Email_user,
      pass: process.env.Email_password,
    },
  });

  const token = jwt.sign({ email }, process.env.SECRETKEY);

  const info = await transporter.sendMail({
    from: ` 'Mazen Sherif' <${process.env.EMAIL_NAME}>`, //sender adress
    to: email, //list of recivers
    subject: "Verfiy Your Email", //subject line
    html: confirmationLayout(token), //html body
  });
};

export default confirmEmail;