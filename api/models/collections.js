const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  name: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Reference to the Post model
    },
  ],
  isPublic: {
    type: Boolean,
    default: true, // Default to public
  },
});

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;
