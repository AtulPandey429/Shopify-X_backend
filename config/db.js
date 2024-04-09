import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const url = process.env.URL;

const databaseConnect = async () => {
  try {
    if (!url) {
      throw new Error("MongoDB URL is not provided");
    }

    await mongoose.connect(url).then(() => {
      console.log("Database connected");
    });
  } catch (error) {
    console.error("Connection to MongoDB failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

export default databaseConnect;
