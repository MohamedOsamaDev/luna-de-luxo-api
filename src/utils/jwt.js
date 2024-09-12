import jwt from "jsonwebtoken";
export const createJwt = (payload = {}, options = {}) => {
  return jwt.sign(payload, process.env.SECRETKEY, options);
};

export const verifyJwt = (token) => {
    return jwt.verify(token, process.env.SECRETKEY);
};
