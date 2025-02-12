import mongoose from "mongoose";

const blogSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    image: { type: String, required: true },
    title: { type: String, required: true },
    blogpost: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Blog", blogSchema);
