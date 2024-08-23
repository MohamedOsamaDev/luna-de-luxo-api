const SetCookie = (options={}) => {
  return {
    maxAge: 2 * 365 * 24 * 60 * 60 * 1000,
    httpOnly: true, // accessible only by web server
    secure: process.env.MODE === "pro", // send only over HTTPS
    path: "/",
    ...(process.env.MODE === "pro"
      ? { domain: ".lunadeluxo.com", sameSite: "Strict" }
      : {}),
    ...options,
  };
};

export default SetCookie;
