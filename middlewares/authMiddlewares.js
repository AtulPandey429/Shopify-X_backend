import JWT from "jsonwebtoken";
import {User} from "../models/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const verifyToken = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = verifyToken;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "invalid token ",
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "user is not admin",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      error,
      message: "invalid credentials",
    });
  }
};
