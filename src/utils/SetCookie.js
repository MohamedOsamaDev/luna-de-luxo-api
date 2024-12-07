import dotenv from "dotenv";
dotenv.config(); //config env
const SetCookie = (options = {}) => {
  return {
    maxAge: 365 * 24 * 60 * 60 * 1000,
    httpOnly: true, // accessible only by web server
    secure: process.env.MODE === "pro", // send only over HTTPS
    path: "/",
    ...(process.env.MODE === "pro"
      ? { domain: process.env.DOMAIN, sameSite: "Strict" }
      : {}),
    ...options,
  };
};

export default SetCookie;
