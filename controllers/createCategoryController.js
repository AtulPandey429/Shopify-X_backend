import slugify from "slugify";
import {Category} from "../models/createCategory.js";

export const CreateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        success: false,
        message: "name is required",
      });
    }
    const nameExit = await Category.findOne({ name });
    if (nameExit) {
      return res.status(200).send({
        success: true,
        message: "name is alredy exist",
      });
    }

    const newcategory = await Category({
      name,
      slug: slugify(name),
    }).save();
    return res.status(201).send({
      success: true,
      message: `newCategory is created`,
      newcategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error in createfunction ",
    });
  }
};
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const updatedname = await Category.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "successfully updated",
      updatedname,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "error in updatefunction ",
    });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const category = await Category.find({});
    res.status(200).send({
      success: true,
      message: "all category is here",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "error in getall ",
    });
  }
};

export const getOneCategory = async (req, res) => {
  try {
    const oneCategory = await Category.findOne({ slug: req.params.slug });
    return res.status(200).send({
      success: true,
      message: "desired category is here",
      oneCategory,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "error in above one ",
    });
  }
};
  //delete constrolller

  export const deleteCategory = async(req,res)=>{
    try {
        const {id} = req.params
        const deleteItem = await Category.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"deleted category is here",
            deleteItem
        }) 
    } catch (error) {
        res.status(500).send({
            success:false,
            error,
            message:"not deleted",
            
        }) 
    }
  }