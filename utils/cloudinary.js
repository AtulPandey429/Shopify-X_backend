import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return;
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: "ecommerceImage",
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error(error);
    fs.unlinkSync(localFilePath);
    throw error;
  }
};



