import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 90 },
    description: { type: String, required: true, trim: true, maxlength: 1200 },
    author: { type: String, trim: true, maxlength: 40, default: "Dreamer" },
    category: { type: String, enum: ["dream", "hobby"], required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
