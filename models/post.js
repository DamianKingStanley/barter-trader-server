import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    image: { type: String, required: true }, // URL or path to the photo
    TradingCategory: { type: String, required: true },
    offer: { type: String, required: true },
    exchange: { type: String, required: true },
    exchangeCategory: { type: String, required: true },
    textAreaValue: { type: String, required: true },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ["success", "waiting"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", postSchema);
