import jwt from "jsonwebtoken";
export const createJwt = (payload = {}, options = {}) => {
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

export const verifyJwt = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
