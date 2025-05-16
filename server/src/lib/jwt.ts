import jwt, { Secret, SignOptions } from "jsonwebtoken"

const JWT_SECRET: Secret = process.env.SECRET || "frrrrrr"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d"

export const signToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

export const verifyToken = (token : string)=> {

    return jwt.verify(token , JWT_SECRET)

}