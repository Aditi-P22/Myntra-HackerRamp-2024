const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  outfitName: { type: String, required: true },
  description: { type: String, required: true },
  images: [
    {
      type: String, // URL to the image
      required: true,
    },
  ],
  tags: [
    {
      type: String,
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  saves: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  replies: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
