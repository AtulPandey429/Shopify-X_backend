import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddlewares.js";
import { brainTreePaymentController, braintreeTokenController, createProduct, deleteProduct, getAllProducts, getCloudinaryphoto, getProductByCategory, getSingleProduct, productCount, productFilter, productList,  productSearch,  relatedProduct,  updateProduct } from "../controllers/productControllers.js";
import upload from "../utils/multer.js";

const routes = express.Router();

// Create product route
routes.post("/create-product", requireSignIn, isAdmin, upload.single("file"), createProduct);

// Get all products route (public)
routes.get("/get-products", getAllProducts);

// Get single product route (public)
routes.get("/get-product/:slug", getSingleProduct);

// Delete product route
routes.delete("/delete-product/:id", requireSignIn, isAdmin, deleteProduct);

// Get photo URL route
routes.get("/product-photo/:_id", getCloudinaryphoto);

// Update product route
routes.put("/update-product/:id", requireSignIn, isAdmin, upload.single("file"), updateProduct);
 
// product-filter route 
routes.post("/product-filter",productFilter);
//product total-page 
routes.get('/product-count',productCount)

// perpage 

routes.get('/product-perpage/:page', productList);
routes.get('/product-search/:keyword', productSearch);
routes.get('/similar-product/:id/:category_id',relatedProduct)
routes.get('/product-bycategory/:slug',getProductByCategory)
//payments routes
//token
routes.get("/braintree/token", braintreeTokenController);

//payments
routes.post("/braintree/payment", requireSignIn, brainTreePaymentController);
export default routes;
