import mongoose from "mongoose";

const category = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    // unique:true,
  },
  slug: {
    type: String,
    lowercase:true,
  },
},{ timestamps: true });

const Category = mongoose.model("Category", category);
export {Category};
