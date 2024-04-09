import {Product} from "../models/productModel.js";
import slugify from "slugify";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import {Category} from "../models/createCategory.js";
import {Order} from "../models/orderModal.js";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

//payment gateway
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


export const createProduct = async (req, res) => {
  try {
    const { name, price, description, quantity, category,shipping } = req.body;
    const { file } = req;

    if (!name || !price || !description || !quantity || !category || !shipping) {
      return res.status(400).send({ error: "All fields are required" });
    }

    if (!file) {
      return res.status(400).send({ error: "No file uploaded" });
    }

    if (file.size > 10000000) {
      return res
        .status(400)
        .send({ error: "Photo size should be less than 10MB" });
    }

    const photoUrl = await uploadOnCloudinary(file.path);
    console.log("Photo URL:", photoUrl);

    const product = new Product({
      name,
      price,
      description,
      quantity,
      category,
      shipping,
      photo: photoUrl,
      slug: slugify(name),
    });

    await product.save();

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
      photoUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error: error.message,
    });
  }
};

// get all products

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate("category")
    .limit(12)
    .sort({ createdAt: -1 });
    res.status(200).send({
      totalProducts: products.length,
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching products",
      error: error.message,
    });
  }
};

//get single product by slug

export const getSingleProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug:slug })
    .populate("category");
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching product",
      error: error.message,
    });
  }
};

//delete product

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting product",
      error: error.message,
    });
  }
};

//controller function to get product phot url from cloudinary

export const getCloudinaryphoto = async(req,res)=>{
 try {
 
 const product = await Product.findById({_id:req.params._id});

 if(!product && !product.photo){
  res.status(400).send({
    success:false,
    message:"photo or product not found",
  })
 }
res.status(200).send({
    success:true,
    message:"photo fetched successfully",
    photoUrl:product.photo,
})


  
 } catch (error) {
  console.error(error);
  res.status(500).send({
    success:false,
    message:"error in fetching photo",
    error:error.message,
})
 }
}


// update product controller


export const updateProduct = async (req, res) => {
  const { name, price, description, quantity, category,shipping } = req.body;
  const { file } = req;

  try {
    if (![name, price, description, quantity, category, file,shipping].every(Boolean)) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (file.size > 10000000) {
      return res.status(400).json({ error: "Photo size should be less than 10MB" });
    }

    const photoUrl = await uploadOnCloudinary(file.path);

    let product = await Product.findByIdAndUpdate(req.params.id, {
      name,
      price,
      description,
      quantity,
      category,
      shipping,
      photo: photoUrl,
      slug: slugify(name)
    }, { new: true });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
      photoUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in updating product",
      error: error.message
    });
  }
};



// product-filter controller 


export const productFilter = async (req, res) => {
  try {
    const { checked, price } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (price.length > 0) args.price = { $gte: price[0], $lte: price[1] };

    const products = await Product.find(args); // Pass args directly here

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in fetching products",
      error: error.message
    });
  }
};

//productCountController logic
export const productCount = async (req, res) => {
  try{
    const total = await Product.find({}).estimatedDocumentCount();
    res.status(200).json({
      success:true,
      total,
      message:"product count fetched successfully",
    })
  }catch(error){
    console.error(error);
    res.status(500).json({
      success:false,
      message:"error in fetching product count",
      error:error.message,
    })
  }
}


//productListController 
export const productList = async (req, res) => {
  try {
    const perPage =6;
    const page = req.params.page || 1;
    const products = await Product.find({}).skip((page - 1) * perPage).limit(perPage);
    res.status(200).json({
      success: true,
      products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in fetching products",
      error: error.message,
    });
  }
}


//productSearchController 
export const productSearch = async (req, res) => {
  try {
    const {keyword} = req.params;
    const results =await Product.find({
      $or:[
        {name:{ $regex: keyword, $options: 'i' }},
        {description:{ $regex: keyword, $options: 'i' }},
      ]
    });
     res.json(results)
    
  } catch (error) {
    res.status(500).json({
      success:false,
      message:"Error in fetching products",
      error:error.message,

    })
    
  }
}

//relatedproduct controller 
export const relatedProduct = async (req, res) => {
  try {
    const {id,category_id} = req.params;
    const products = await Product.find({
     _id:{$ne:id},
     category:category_id, 
    }).limit(4).populate("category");
    res.status(200).json({  
      success:true,
      products,
      message:"Related products fetched successfully",
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message:"Error in fetching products",
      error:error.message,
  })
  }
}

//getProduct by category 
export const getProductByCategory = async (req, res) => {
  try {
     const category = await Category.findOne({slug:req.params.slug});
    const products = await Product.find({ category}).populate("category");
    res.status(200).json({
      success: true,
      category,
      products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in fetching products",
      error: error.message,
    });
  }
}


//payment gateway api
//token
// Controller for generating client token
export const braintreeTokenController = async (req, res) => {
  try {
    // Generate client token
    gateway.clientToken.generate({}, (err, response) => {
      if (err) {
        throw err; // Throw error for async handling
      }
      res.send(response);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

// Controller for processing payments
// Controller for processing payments
// Controller for processing payments
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;

    // Check if cart is missing or invalid
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is missing or invalid' });
    }

    // Calculate total price
    const total = cart.reduce((acc, item) => acc + item.price, 0);

    // Create new transaction
    gateway.transaction.sale(
      {
        amount: total.toFixed(2), // Ensure the amount is properly formatted
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      (error, result) => {
        if (error) {
          throw error; // Throw error for async handling
        }
        // If successful, save order details
        const order = new Order({
          products: cart,
          payment: result,
          buyer: req.user._id,
        });
        order.save();
        res.json({ ok: true });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

