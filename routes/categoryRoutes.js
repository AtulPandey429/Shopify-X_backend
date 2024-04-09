import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddlewares.js";
import {
  CreateCategory,
  deleteCategory,
  getAllCategory,
  getOneCategory,
  updateCategory,
} from "../controllers/createCategoryController.js";
const routes = express.Router();
//post route for create category
routes.post("/create-category", requireSignIn, isAdmin, CreateCategory);
// update route
routes.put("/update-category/:id", requireSignIn, isAdmin, updateCategory);
//get all route
routes.get("/allcategory", getAllCategory);
routes.get("/Onecategory/:slug", getOneCategory);

//delete route
routes.delete("/deletecategory/:id", requireSignIn, isAdmin, deleteCategory);

export default routes;
