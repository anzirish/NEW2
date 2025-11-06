import jwt from "jsonwebtoken"

export const signRefreshToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_REFESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFESH_SECRET);
  } catch (error) {
    console.log(error.message);
  }
};