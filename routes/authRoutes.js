import express from "express";
import { registerUser, loginUser, forgetPassword, updateProfile, orderStatusController, getAllOrdersController, getOrdersController, getAllUsers } from "../controllers/authControllers.js";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddlewares.js";

const routes = express.Router();

//register route
routes.post("/register", registerUser);

//login route
routes.post("/login", loginUser);

//dashboard route
routes.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//admin route
routes.get("/admin-auth", requireSignIn,isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
//forgetPassword route
routes.post("/forgotpassword", forgetPassword);

//getALl Users 
routes.get("/all-users", requireSignIn, isAdmin, getAllUsers);

// route to update userprofile
routes.put("/user-profile", requireSignIn, updateProfile);

routes.get("/orders", requireSignIn, getOrdersController);

//all orders
routes.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
routes.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);


export default routes;
